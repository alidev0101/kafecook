import { NextResponse } from "next/server";

export function successResponse(data, message = "عملیات موفق", status = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

export function errorResponse(message = "خطای سرور", status = 500, errors = null) {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(errors && { errors }),
    },
    { status }
  );
}

export function paginatedResponse(data, pagination, message = "عملیات موفق") {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      pagination,
    },
    { status: 200 }
  );
}

// Standard pagination helper
export function getPagination(page = 1, limit = 12) {
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;
  return { page: pageNum, limit: limitNum, skip };
}

export function buildPaginationMeta(total, page, limit) {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
