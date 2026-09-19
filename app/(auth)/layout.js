import Link from "next/link";
import { Coffee } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-950 via-coffee-900 to-coffee-800 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-coffee-700/20 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-amber-600/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-coffee-500/20 border border-coffee-500/30 flex items-center justify-center">
            <Coffee size={24} className="text-coffee-300" />
          </div>
          <span className="text-3xl font-black text-white">کافه کوک</span>
        </Link>

        {children}
      </div>
    </div>
  );
}
