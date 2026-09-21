import PostCard from "./PostCard";
import { motion } from "framer-motion";

export default function PostGrid({ posts = [], loading = false, featured = false }) {
  if (loading) return <PostGridSkeleton count={featured ? 6 : 9} />;

  if (!posts.length) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="text-4xl mb-4 opacity-20">📝</p>
        <p className="font-medium">مقاله‌ای یافت نشد</p>
      </div>
    );
  }

  if (featured && posts.length > 0) {
    const [first, ...rest] = posts;
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <PostCard post={first} index={0} featured />
        {rest.slice(0, 4).map((post, i) => (
          <PostCard key={post._id} post={post} index={i + 1} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {posts.map((post, i) => (
        <PostCard key={post._id} post={post} index={i} />
      ))}
    </div>
  );
}

export function PostGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
          <div className="aspect-[16/9] bg-muted" />
          <div className="p-5 space-y-3">
            <div className="h-5 bg-muted rounded-xl w-5/6" />
            <div className="h-3 bg-muted rounded-xl w-full" />
            <div className="h-3 bg-muted rounded-xl w-2/3" />
            <div className="h-3 bg-muted rounded-xl w-1/2 mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
