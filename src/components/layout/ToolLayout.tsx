import { Link, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import React from "react";

interface ToolLayoutProps {
  children: React.ReactNode;
}

export const ToolLayout = ({ children }: ToolLayoutProps) => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {!isHome && (
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>返回工具箱</span>
          </Link>
        )}
        {children}
      </div>
    </div>
  );
};

export default ToolLayout;
