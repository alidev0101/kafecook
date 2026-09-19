export const dynamic = 'force-dynamic';
import { apiHandler } from "@/lib/apiHandler";
import { successResponse } from "@/lib/apiResponse";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import Review from "@/models/Review";

// GET /api/admin/stats
export const GET = apiHandler(
  async (req) => {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalOrders,
      todayOrders,
      monthOrders,
      todaySales,
      monthSales,
      totalUsers,
      totalProducts,
      lowStockProducts,
      pendingReviews,
      recentOrders,
      ordersByStatus,
    ] = await Promise.all([
      Order.countDocuments({}),
      Order.countDocuments({ createdAt: { $gte: todayStart } }),
      Order.countDocuments({ createdAt: { $gte: monthStart } }),

      Order.aggregate([
        { $match: { createdAt: { $gte: todayStart }, paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),

      Order.aggregate([
        { $match: { createdAt: { $gte: monthStart }, paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),

      User.countDocuments({ role: "USER" }),
      Product.countDocuments({ isActive: true }),

      Product.find({
        "variants.stock": { $gt: 0, $lte: 5 },
        isActive: true,
      })
        .select("name slug variants images")
        .limit(10)
        .lean(),

      Review.countDocuments({ status: "pending" }),

      Order.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "name email")
        .select("orderNumber status total createdAt user")
        .lean(),

      Order.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    // Monthly sales chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const salesChart = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Top selling products
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
          name: { $first: "$items.productSnapshot.name" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    return successResponse({
      orders: {
        total: totalOrders,
        today: todayOrders,
        thisMonth: monthOrders,
        byStatus: ordersByStatus,
      },
      sales: {
        today: todaySales[0]?.total || 0,
        thisMonth: monthSales[0]?.total || 0,
        chart: salesChart,
      },
      users: {
        total: totalUsers,
      },
      products: {
        total: totalProducts,
        lowStock: lowStockProducts,
      },
      reviews: {
        pending: pendingReviews,
      },
      recentOrders,
      topProducts,
    });
  },
  { requireAdmin: true }
);
