
import { ReactNode } from "react";

interface DashboardHeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
}

export default function DashboardHeader({ title, description, children }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}
