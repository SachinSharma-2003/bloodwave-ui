import { cn } from "@/lib/utils";

interface StatusChipProps {
  status: "available" | "unavailable" | "open" | "fulfilled" | "cancelled" | "pending";
  className?: string;
}

const StatusChip = ({ status, className }: StatusChipProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "available":
      case "open":
        return {
          label: status === "available" ? "Available" : "Open",
          className: "status-available",
          indicator: "bg-success"
        };
      case "fulfilled":
        return {
          label: "Fulfilled",
          className: "status-available",
          indicator: "bg-success"
        };
      case "pending":
        return {
          label: "Pending",
          className: "status-pending",
          indicator: "bg-warning"
        };
      case "unavailable":
      case "cancelled":
        return {
          label: status === "unavailable" ? "Unavailable" : "Cancelled",
          className: "status-unavailable",
          indicator: "bg-neutral"
        };
      default:
        return {
          label: "Unknown",
          className: "status-unavailable",
          indicator: "bg-neutral"
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={cn(
      "inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium",
      config.className,
      className
    )}>
      <div className={cn("w-2 h-2 rounded-full", config.indicator)} />
      <span>{config.label}</span>
    </div>
  );
};

export default StatusChip;