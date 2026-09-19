import { cn } from "@/lib/utils";
import Link from "next/link";
import Button from "./Button";

export default function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      {Icon && (
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-5">
          <Icon size={36} className="text-muted-foreground opacity-40" />
        </div>
      )}
      {title && <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>}
      {description && <p className="text-muted-foreground text-sm max-w-xs mb-6">{description}</p>}
      {action && (
        action.href
          ? <Link href={action.href}><Button size="md">{action.label}</Button></Link>
          : <Button size="md" onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}
