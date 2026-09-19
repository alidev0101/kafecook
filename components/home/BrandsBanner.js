"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import SectionHeader from "@/components/shared/SectionHeader";
import Skeleton from "@/components/ui/Skeleton";

export default function BrandsBanner() {
  const { data: brands, isLoading } = useQuery({
    queryKey: ["featured-brands"],
    queryFn: () =>
      axios.get("/api/brands?featured=true").then((r) => r.data.data),
    staleTime: 10 * 60 * 1000,
  });

  const displayBrands = brands?.length ? brands : defaultBrands;

  return (
    <section className="py-16 md:py-20 bg-coffee-950">
      <div className="container-custom">
        <SectionHeader
          title="برندهای برتر"
          subtitle="با بهترین برندهای قهوه جهان آشنا شو"
          href="/brands"
          className="[&_h2]:text-white [&_p]:text-coffee-400 [&_a]:text-coffee-300"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-2xl bg-coffee-800" />
              ))
            : displayBrands.map((brand) => (
                <Link
                  key={brand._id || brand.name}
                  href={`/brands/${brand.slug || brand.name}`}
                  className="group bg-coffee-900/50 hover:bg-coffee-800 border border-coffee-800 hover:border-coffee-600 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 transition-all duration-300 min-h-[96px]"
                >
                  {brand.logo ? (
                    <div className="relative w-12 h-12">
                      <Image src={brand.logo} alt={brand.name} fill className="object-contain filter brightness-0 invert opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ) : (
                    <span className="text-2xl opacity-60 group-hover:opacity-100 transition-opacity">☕</span>
                  )}
                  <span className="text-xs text-coffee-400 group-hover:text-white transition-colors font-medium text-center">
                    {brand.name}
                  </span>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}

const defaultBrands = [
  { _id: "1", name: "ایلی", slug: "illy" },
  { _id: "2", name: "لاواتزا", slug: "lavazza" },
  { _id: "3", name: "نسپرسو", slug: "nespresso" },
  { _id: "4", name: "استارباکس", slug: "starbucks" },
  { _id: "5", name: "جیمز", slug: "james" },
  { _id: "6", name: "لینگو", slug: "lingo" },
];
