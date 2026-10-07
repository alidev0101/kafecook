import ShopLayout from "@/components/layout/ShopLayout";

export default function UserLayout({ children }) {
  return <ShopLayout><div className="py-14">{children}</div></ShopLayout>;
}
