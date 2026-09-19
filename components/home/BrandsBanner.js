"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SectionHeader from "@/components/shared/SectionHeader";
import Skeleton from "@/components/ui/Skeleton";

const defaultBrands = [
  { _id: "1", name: "لاواتزا",       slug: "lavazza"          },
  { _id: "2", name: "ایلی",          slug: "illy"             },
  { _id: "3", name: "نسپرسو",        slug: "nespresso"        },
  { _id: "4", name: "استارباکس",     slug: "starbucks"        },
  { _id: "5", name: "کافه‌کوک ویژه", slug: "kafecook-special" },
  { _id: "6", name: "لینگو",         slug: "lingo"            },
];

export default function BrandsBanner() {
  const { data: brands, isLoading } = useQuery({
    queryKey: ["featured-brands"],
    queryFn: () => axios.get("/api/brands?featured=true").then((r) => r.data.data),
    staleTime: 10 * 60 * 1000,
  });

  const items = brands?.length ? brands : defaultBrands;

  return (
    <section className="py-16 md:py-20 bg-coffee-950 dark:bg-gray-950">
      <div className="container-custom">
        <SectionHeader
          title="برندهای برتر"
          subtitle="با بهترین برندهای قهوه جهان آشنا شو"
          href="/brands"
          className="[&_h2]:text-white [&_p]:text-coffee-400 [&_a]:text-coffee-300"
        />

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 md:gap-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-2xl bg-coffee-800" />
              ))
            : items.map((brand, i) => (
                <motion.div
                  key={brand._id || brand.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -3 }}
                >
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="group bg-coffee-900/50 hover:bg-coffee-800 border border-coffee-800 hover:border-coffee-600 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all duration-300 min-h-[88px]"
                  >
                    {brand.logo ? (
                      <div className="relative w-10 h-10">
                        <Image
                          src={brand.logo}
                          alt={brand.name}
                          fill
                          className="object-contain filter brightness-0 invert opacity-50 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                    ) : (
                      <span className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">☕</span>
                    )}
                    <span className="text-xs text-coffee-400 group-hover:text-white transition-colors font-medium text-center line-clamp-1">
                      {brand.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
