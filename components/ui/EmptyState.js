import { cn } from "@/lib/utils";
import Button from "./Button";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      {Icon && (
        <div className="w-20 h-20 rounded-full bg-coffee-50 flex items-center justify-center mb-5">
          <Icon size={36} className="text-coffee-400" />
        </div>
      )}
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      )}
      {description && (
        <p className="text-gray-500 text-sm max-w-xs mb-6">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} href={action.href} size="md">
          {action.label}
        </Button>
      )}
    </div>
  );
}
