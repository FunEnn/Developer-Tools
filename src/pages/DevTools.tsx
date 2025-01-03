import { useNavigate } from "react-router-dom";
import { ChevronRight, Search, Github, Settings, Sun, Moon } from "lucide-react";
import React, { useState, useMemo } from "react";
import { useTheme } from "../hooks/useTheme";

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
  const { theme, toggleTheme } = useTheme();


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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 顶部栏 */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              DevTools
            </h1>
            <span className="px-2 py-1 text-xs font-medium bg-blue-100/80 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
              Beta
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <a
              href="https://github.com/funenn"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* 搜索框 */}
        <div className="max-w-2xl mx-auto relative mb-12">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索工具..."
            className="w-full px-12 py-3 text-lg rounded-2xl border border-gray-200 dark:border-gray-700 
                     bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                     text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 
                           text-gray-400 dark:text-gray-500 w-5 h-5" />
        </div>

        {/* 工具分类区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((category) => (
            <div
              key={category.category}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md 
                       border border-gray-200 dark:border-gray-700
                       transition-all duration-200"
            >
              {/* 分类标题 */}
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
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
                      className="flex items-center justify-between p-4 
                               hover:bg-gray-50 dark:hover:bg-gray-700/50 
                               cursor-pointer group/item"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 
                                    group-hover/item:bg-blue-50 dark:group-hover/item:bg-blue-900/20">
                          <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400 
                                       group-hover/item:text-blue-500 dark:group-hover/item:text-blue-400" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 
                                     group-hover/item:text-blue-500 dark:group-hover/item:text-blue-400">
                          {tool.label}
                        </span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 
                                           group-hover/item:text-blue-500 dark:group-hover/item:text-blue-400" />
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
