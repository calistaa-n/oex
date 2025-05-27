
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  color: string;
  stats?: {
    value: string | number;
    label: string;
  }[];
}

export default function DashboardCard({
  title,
  description,
  icon,
  href,
  color,
  stats
}: DashboardCardProps) {
  return (
    <Link
      to={href}
      className={cn(
        "block p-6 rounded-xl border border-gray-200 dark:border-gray-800",
        "bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-300",
        "transform hover:-translate-y-1"
      )}
    >
      <div className="space-y-4">
        <div className={cn(
          "inline-flex items-center justify-center p-2 rounded-lg", 
          `bg-${color}-50 dark:bg-${color}-950/30`
        )}>
          <div className={cn(`text-${color}-600 dark:text-${color}-400`)}>
            {icon}
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-100 dark:border-gray-800">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className={cn(`text-xl font-semibold text-${color}-600 dark:text-${color}-400`)}>
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-end">
          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-1 group">
            View Details
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
