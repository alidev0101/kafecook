"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SectionHeader from "@/components/shared/SectionHeader";
import Skeleton from "@/components/ui/Skeleton";

export default function BrandsBanner() {
  const reduce = useReducedMotion();

  const { data: brands, isLoading } = useQuery({
    queryKey: ["featured-brands"],
    queryFn: () => axios.get("/api/brands?featured=true").then((r) => r.data.data),
    staleTime: 10 * 60 * 1000,
  });

  const items = brands || [];

  return (
    <section className="relative overflow-x-hidden pb-14 dark:bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 bottom-0 opacity-[0.055] blur-[2px] hidden lg:block">
          <Image src={"/images/coffe-baner.png"} alt="" width={300} height={300} className="object-cover" />
        </div>

        {/* <div className="absolute -right-20 top-10 h-[360px] w-[360px] rounded-full bg-coffee-300/20 blur-[120px] dark:bg-coffee-600/[0.10]" />
        <div className="absolute -bottom-32 left-[12%] h-[340px] w-[340px] rounded-full bg-amber-200/25 blur-[120px] dark:bg-amber-700/[0.08]" /> */}
      </div>

      <div className="container-custom relative">
        <SectionHeader
          title="برندهای برتر"
          subtitle="انتخابی از معتبرترین برندهای قهوه جهان"
          href="/brands"
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-[26px] bg-coffee-100/60 dark:bg-coffee-900/40" />
              ))
            : items.map((brand, i) => (
                <motion.div
                  key={brand._id || brand.name}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={reduce ? undefined : { y: -4 }}
                  className="group"
                >
                  <Link href={`/brands/${brand.slug}`} className="relative flex flex-col items-center justify-center overflow-hidden rounded-[26px] bg-coffee-100/50 dark:bg-white/[0.04] px-4 py-5 shadow-md backdrop-blur-xl transition-all duration-500 hover:border-coffee-300 hover:bg-white hover:shadow-[0_18px_40px_-18px_rgba(91,61,43,0.3)] dark:border-coffee-800/70">
                    <div className="pointer-events-none absolute -inset-12 rounded-full bg-coffee-300/0 blur-3xl transition-all duration-500 group-hover:bg-coffee-300/15 dark:group-hover:bg-coffee-600/10" />

                    <div className="relative flex h-16 w-28 items-center justify-center">
                      <Image
                        src={brand.logo || "/icons/icon-72x72.png"}
                        alt={brand.name}
                        fill
                        sizes="112px"
                        className={`object-contain transition-all duration-500 group-hover:scale-105 ${brand.logo ? "opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0" : "opacity-25 grayscale group-hover:grayscale-0 group-hover:opacity-60"}`}
                      />
                    </div>

                    <span className="relative mt-2 text-xs font-semibold text-coffee-600/70 transition-colors duration-300 group-hover:text-coffee-900 dark:text-coffee-300/60 dark:group-hover:text-white">
                      {brand.name}
                    </span>

                    <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-coffee-400 to-transparent transition-all duration-500 group-hover:w-1/2" />
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}