import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import React from "react";
export const DevTools = ({ tools }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            开发者工具箱
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            常用开发工具集合
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((category) => (
            <div key={category.category} className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {category.category}
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                {category.items.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <div
                      key={tool.id}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer border-b last:border-b-0 border-gray-100 dark:border-gray-700"
                      onClick={() => navigate(`/tools/${tool.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">
                          {tool.label}
                        </span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Made with ❤️ by Funenn
        </div>
      </div>
    </div>
  );
};

export default DevTools;
