import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
  showLabel?: boolean;
}

const ProgressBar = ({ current, total, className, showLabel = true }: ProgressBarProps) => {
  const percentage = Math.min((current / total) * 100, 100);
  const isComplete = current >= total;

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className={cn(
            "font-medium",
            isComplete ? "text-success" : "text-foreground"
          )}>
            {current}/{total} units
          </span>
        </div>
      )}
      <div className="progress-bar">
        <div 
          className={cn(
            "progress-fill",
            isComplete ? "bg-success" : "bg-primary"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-muted-foreground">
          {percentage.toFixed(0)}% completed
        </p>
      )}
    </div>
  );
};

export default ProgressBar;