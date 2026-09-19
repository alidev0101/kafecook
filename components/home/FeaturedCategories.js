"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Skeleton from "@/components/ui/Skeleton";
import SectionHeader from "@/components/shared/SectionHeader";

export default function FeaturedCategories() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["featured-categories"],
    queryFn: () =>
      axios.get("/api/categories?featured=true&parent=root").then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section className="py-16 md:py-20 bg-cream-50">
      <div className="container-custom">
        <SectionHeader
          title="دسته‌بندی‌های محبوب"
          subtitle="بهترین قهوه‌ها را بر اساس سلیقه‌ات پیدا کن"
          href="/categories"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <Skeleton className="w-20 h-20 rounded-2xl" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))
            : (categories || defaultCategories).map((cat) => (
                <Link
                  key={cat._id || cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="group flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-white transition-all duration-300 hover:shadow-card"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-coffee-100 group-hover:bg-coffee-gradient transition-all duration-300 flex items-center justify-center text-3xl overflow-hidden relative shadow-sm group-hover:shadow-warm">
                    {cat.image ? (
                      <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                    ) : (
                      <span>{cat.icon || "☕"}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-coffee-700 transition-colors text-center">
                    {cat.name}
                  </span>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}

const defaultCategories = [
  { _id: "1", name: "اسپرسو", slug: "espresso", icon: "☕" },
  { _id: "2", name: "دان قهوه", slug: "coffee-beans", icon: "🫘" },
  { _id: "3", name: "فرنچ پرس", slug: "french-press", icon: "🍵" },
  { _id: "4", name: "کپسولی", slug: "capsule", icon: "💊" },
  { _id: "5", name: "کولد برو", slug: "cold-brew", icon: "🧊" },
  { _id: "6", name: "ویژه", slug: "specialty", icon: "⭐" },
];
