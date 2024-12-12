import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import React from "react";

export const DevTools = ({ tools }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* 头部区域 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            开发者工具箱
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            为开发者提供的常用工具集合，提高开发效率
          </p>
        </div>

        {/* 工具分类区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((category) => (
            <div
              key={category.category}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02]"
            >
              {/* 分类标题 */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {category.category}
                </h2>
              </div>

              {/* 工具列表 */}
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {category.items.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <div
                      key={tool.id}
                      onClick={() => navigate(`/tools/${tool.id}`)}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                          <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                          {tool.label}
                        </span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 页脚 */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <span>Made with</span>
            <span className="text-red-500">❤️</span>
            <span>by</span>
            <a
              href="https://github.com/funenn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Funenn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevTools;
