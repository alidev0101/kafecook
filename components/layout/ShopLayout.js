import Header from "./Header";
import Footer from "./Footer";

export default function ShopLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Ambient glass backdrop — soft orbs the frosted panels blur against */}
      {/* <div aria-hidden className="page-ambient">
        <div className="absolute top-[30%] left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-coffee-300/15 dark:bg-coffee-700/[0.12] blur-[130px]" />
      </div> */}

      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
