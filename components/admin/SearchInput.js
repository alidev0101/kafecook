"use client";

import { Search } from "lucide-react";
import { useRef } from "react";

export default function SearchInput({ value, onChange, placeholder = "جستجو..." }) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 pr-9 pl-4 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent w-full sm:w-64 transition-all"
      />
    </div>
  );
}
