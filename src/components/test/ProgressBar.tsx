'use client';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.round(((current + 1) / total) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-muted">
          {current + 1}/{total}
        </span>
        <span className="text-sm font-semibold">{percentage}%</span>
      </div>
      <div className="w-full h-1 bg-border dark:bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-smooth"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
