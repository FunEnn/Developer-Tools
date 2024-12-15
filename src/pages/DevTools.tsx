import { useNavigate } from "react-router-dom";
import { ChevronRight, Search } from "lucide-react";
import React, { useState, useMemo } from "react";

interface Tool {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
}

interface Category {
  category: string;
  items: Tool[];
}

interface DevToolsProps {
  tools: Category[];
}

export const DevTools = ({ tools }: DevToolsProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // 过滤工具
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return tools;

    return tools.map(category => ({
      ...category,
      items: category.items.filter(tool => 
        tool.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(category => category.items.length > 0);
  }, [tools, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* 头部区域 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            开发者工具箱
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            为开发者提供的常用工具集合，提高开发效率
          </p>
          
          {/* 搜索框 */}
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索工具..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       placeholder-gray-500 dark:placeholder-gray-400"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 
                             text-gray-400 dark:text-gray-500 w-5 h-5" />
          </div>
        </div>

        {/* 工具分类区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTools.map((category) => (
            <div
              key={category.category}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden 
                       transition-transform hover:scale-[1.02]"
            >
              {/* 分类标题 */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 
                            border-b dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {category.category}
                </h2>
              </div>

              {/* 工具列表 */}
              {category.items.length > 0 ? (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {category.items.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <div
                        key={tool.id}
                        onClick={() => navigate(`/tools/${tool.id}`)}
                        className="flex items-center justify-between p-4 
                                 hover:bg-gray-50 dark:hover:bg-gray-700/50 
                                 cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 
                                        group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 
                                        transition-colors">
                            <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400 
                                          group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300 
                                         group-hover:text-blue-500 dark:group-hover:text-blue-400 
                                         transition-colors">
                            {tool.label}
                          </span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 
                                               group-hover:text-blue-500 dark:group-hover:text-blue-400 
                                               transition-colors" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  没有找到相关工具
                </div>
              )}
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
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 
                       dark:hover:text-blue-300"
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
