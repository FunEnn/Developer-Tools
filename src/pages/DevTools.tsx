import { useNavigate } from "react-router-dom";
import React, { useState, useMemo } from "react";
import { Menu, ChevronRight, Github, Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { Sidebar } from "../components/Sidebar";
import type { Category } from "../types";

interface DevToolsProps {
  tools: Category[];
}

export const DevTools = ({ tools }: DevToolsProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // 过滤工具
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return tools;

    return tools
      .map((category) => ({
        ...category,
        items: category.items.filter((tool) =>
          tool.label.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [tools, searchQuery]);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        tools={filteredTools}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        theme={theme}
        toggleTheme={toggleTheme}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* 主内容区 */}
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 w-full">
        {/* 移动端顶部导航栏 */}
        <div className="lg:hidden sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between px-4 h-16">
            <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
              DevTools
            </h1>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="container mx-auto px-3 lg:px-4 py-4 lg:py-6">
          {/* 欢迎区域 */}
          <div className="mb-8">
            <div
              className="flex flex-col lg:flex-row lg:items-center lg:justify-between 
                            bg-gradient-to-r from-pink-50/50 via-purple-50/50 to-indigo-50/50 
                            dark:from-pink-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 
                            rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50"
            >
              {/* 左侧文本区域 */}
              <div className="space-y-2 mb-4 lg:mb-0">
                <h2
                  className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 
                               dark:from-pink-400 dark:via-purple-400 dark:to-indigo-400 
                               bg-clip-text text-transparent animate-text"
                >
                  欢迎使用开发者工具集
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
                  选择下方工具开始使用，或使用左侧搜索查找特定工具
                </p>
              </div>

              {/* 右侧操作区 */}
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/funenn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg 
                           bg-white dark:bg-gray-800 
                           border border-gray-200 dark:border-gray-700
                           hover:border-pink-200 dark:hover:border-pink-700
                           group transition-all duration-200"
                >
                  <Github
                    className="w-5 h-5 text-gray-600 dark:text-gray-400 
                                  group-hover:text-pink-500 dark:group-hover:text-pink-400"
                  />
                  <span
                    className="text-sm text-gray-600 dark:text-gray-400
                                group-hover:text-pink-500 dark:group-hover:text-pink-400"
                  >
                    GitHub
                  </span>
                </a>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg 
                           bg-white dark:bg-gray-800 
                           border border-gray-200 dark:border-gray-700
                           hover:border-pink-200 dark:hover:border-pink-700
                           group transition-all duration-200"
                  title={theme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
                >
                  {theme === "dark" ? (
                    <>
                      <Sun
                        className="w-5 h-5 text-gray-600 dark:text-gray-400 
                                   group-hover:text-pink-500 dark:group-hover:text-pink-400"
                      />
                      <span
                        className="text-sm text-gray-600 dark:text-gray-400
                                    group-hover:text-pink-500 dark:group-hover:text-pink-400"
                      >
                        亮色模式
                      </span>
                    </>
                  ) : (
                    <>
                      <Moon
                        className="w-5 h-5 text-gray-600 dark:text-gray-400 
                                    group-hover:text-pink-500 dark:group-hover:text-pink-400"
                      />
                      <span
                        className="text-sm text-gray-600 dark:text-gray-400
                                    group-hover:text-pink-500 dark:group-hover:text-pink-400"
                      >
                        暗色模式
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 按类型分组显示工具 */}
          <div className="space-y-8">
            {filteredTools.map((category) => (
              <div key={category.category} className="space-y-4">
                {/* 类型标题 */}
                <div className="flex items-center gap-3">
                  <h3
                    className="text-lg font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 
                               dark:from-pink-400 dark:via-purple-400 dark:to-indigo-400 
                               bg-clip-text text-transparent"
                  >
                    {category.category}
                  </h3>
                  <div
                    className="flex-1 h-[1px] bg-gradient-to-r from-pink-200 via-purple-200 to-transparent 
                               dark:from-pink-800 dark:via-purple-800 dark:to-transparent
                               opacity-60"
                  ></div>
                </div>

                {/* 该类型的工具卡片 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.items.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <div
                        key={tool.id}
                        onClick={() => navigate(`/tools/${tool.id}`)}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 
                                 shadow-sm hover:shadow-md transition-all duration-200
                                 border border-gray-200 dark:border-gray-700
                                 hover:border-pink-200 dark:hover:border-pink-800
                                 cursor-pointer group"
                      >
                        <div className="flex items-center mb-3 lg:mb-4">
                          <div
                            className="p-2 lg:p-3 rounded-lg bg-gradient-to-br from-pink-50 to-purple-50 
                                       dark:from-pink-900/20 dark:to-purple-900/20 
                                       group-hover:from-pink-100 group-hover:to-purple-100
                                       dark:group-hover:from-pink-800/30 dark:group-hover:to-purple-800/30
                                       transition-colors duration-200"
                          >
                            <Icon
                              className="w-5 h-5 lg:w-6 lg:h-6 text-pink-600 dark:text-pink-400
                                         group-hover:text-purple-600 dark:group-hover:text-purple-400"
                            />
                          </div>
                          <h3
                            className="ml-3 lg:ml-4 text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-200
                                       group-hover:text-purple-600 dark:group-hover:text-purple-400"
                          >
                            {tool.label}
                          </h3>
                        </div>

                        {/* 工具描述 */}
                        <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm min-h-[2.5rem]">
                          {tool.description || "点击开始使用此工具"}
                        </p>

                        {/* 使用指示器 */}
                        <div
                          className="mt-3 lg:mt-4 flex items-center text-pink-600 dark:text-pink-400 
                                     group-hover:text-purple-600 dark:group-hover:text-purple-400 
                                     text-xs lg:text-sm font-medium"
                        >
                          <span>开始使用</span>
                          <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* 底部信息 */}
          <div className="mt-8 lg:mt-12 text-center">
            <div className="inline-flex items-center space-x-2 text-xs lg:text-sm text-gray-500 dark:text-gray-400">
              <span>开发者工具集</span>
              <span>•</span>
              <span>版本 1.0.0</span>
              <span>•</span>
              <a
                href="https://github.com/FunEnn/Developer-Tools"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                反馈建议
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DevTools;
