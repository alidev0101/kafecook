import ShopLayout from "@/components/layout/ShopLayout";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import BestSellers from "@/components/home/BestSellers";
import NewProducts from "@/components/home/NewProducts";
import SpecialOffers from "@/components/home/SpecialOffers";
import BrandsBanner from "@/components/home/BrandsBanner";
import CoffeeTypes from "@/components/home/CoffeeTypes";
import Testimonials from "@/components/home/Testimonials";
import WhyUs from "@/components/home/WhyUs";
import FAQSection from "@/components/home/FAQSection";

export const metadata = {
  title: "کافه کوک | فروشگاه تخصصی قهوه کرمان",
  description:
    "بهترین قهوه‌های تخصصی را از کافه کوک بخرید. انواع دان قهوه، اسپرسو، فرنچ پرس با ارسال سریع به سراسر ایران",
};

export default function HomePage() {
  return (
    <ShopLayout>
      <main>
        <HeroSection />
        <FeaturedCategories />
        <BestSellers />
        <SpecialOffers />
        <CoffeeTypes />
        <NewProducts />
        <BrandsBanner />
        <WhyUs />
        <Testimonials />
        <FAQSection />
      </main>
    </ShopLayout>
  );
}
