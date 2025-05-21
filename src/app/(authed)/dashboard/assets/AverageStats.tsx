import "./averageStats.css";
import { Clock, Target, Icon as LucideIcon } from "lucide-react";

interface AverageStatsProps {
  title: string;
  value: number;
  unit?: string;
  icon?: LucideIcon;
  comparison: {
    percent: string;
    position: "más" | "menos";
    direction: "alto" | "bajo";
    color: string; // e.g. "#F57C00" or "var(--green)"
  };
}

export default function AverageStats({
  title,
  value,
  unit,
  icon: Icon = Clock,
  comparison,
}: AverageStatsProps) {
  return (
    <div className="average-stats-card">
      <div className="ac-content">
        <div className="ac-title">{title}</div>

        <div className="average-stats-main-score">
          <div className="flex items-baseline">
            <span className="average-stats-number">{value}</span>
            {unit && <span className="average-stats-unit">{unit}</span>}
          </div>
          <Icon className="average-stats-icon" />
        </div>

        <div className="average-stats-comparison">
          <span
            className="percent"
            style={{ color: comparison.color }}
          >
            {comparison.percent}
          </span>
          <span className="gray">{comparison.position}</span>
          <span
            className="highlight"
            style={{ color: comparison.color }}
          >
            {comparison.direction}
          </span>
          <span className="gray">que el promedio</span>
        </div>
      </div>
    </div>
  );
}
