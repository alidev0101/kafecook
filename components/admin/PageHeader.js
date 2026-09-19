import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";

export default function PageHeader({ title, description, action }) {
  return (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      {action && (
        <Button onClick={action.onClick} href={action.href} size="sm">
          <Plus size={15} />
          {action.label}
        </Button>
      )}
    </div>
  );
}
