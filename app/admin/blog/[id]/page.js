"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PostForm from "@/components/admin/PostForm";
import Skeleton from "@/components/ui/Skeleton";

export default function EditPostPage() {
  const { id } = useParams();

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["admin-post", id],
    queryFn: () => axios.get(`/api/admin/posts/${id}`).then((r) => r.data.data),
    staleTime: 0,
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-[600px] rounded-2xl" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p>مقاله یافت نشد</p>
      </div>
    );
  }

  return <PostForm post={post} />;
}
