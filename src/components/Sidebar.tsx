import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Sun, Moon, ChevronRight } from "lucide-react";
import type { Category } from "../types";

interface SidebarProps {
  tools: Category[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  theme: string;
  toggleTheme: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  tools,
  searchQuery,
  onSearchChange,
  theme,
  toggleTheme,
  isSidebarOpen,
  toggleSidebar,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* 遮罩层 - 仅在移动端显示 */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* 侧边栏主体 */}
      <aside
        className={`
        fixed lg:sticky top-0 left-0 z-50
        w-[280px] h-screen
        bg-white dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-800
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col
      `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
          <h1
            className="text-xl font-bold bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 
                         dark:from-pink-400 dark:via-purple-400 dark:to-indigo-400 
                         bg-clip-text text-transparent animate-text"
          >
            DevTools
          </h1>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                     bg-gray-50 dark:bg-gray-800 
                     border border-gray-200 dark:border-gray-700
                     hover:bg-violet-50 dark:hover:bg-violet-900/20
                     hover:border-violet-200 dark:hover:border-violet-800
                     group transition-all duration-200"
            title={theme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400 
                             group-hover:text-violet-500 dark:group-hover:text-violet-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400
                              group-hover:text-violet-500 dark:group-hover:text-violet-400">
                  亮色
                </span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400 
                              group-hover:text-violet-500 dark:group-hover:text-violet-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400
                              group-hover:text-violet-500 dark:group-hover:text-violet-400">
                  暗色
                </span>
              </>
            )}
          </button>
        </div>

        {/* 搜索框 */}
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="搜索工具..."
              className="w-full pl-10 pr-4 py-2 text-sm
                rounded-lg
                border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800
                text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                focus:ring-2 focus:ring-violet-500 focus:border-transparent
                transition-all duration-200"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* 导航菜单 - 添加自定义滚动条样式 */}
        <nav
          className="flex-1 overflow-y-auto px-4 py-2 space-y-6
                       scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 
                       scrollbar-track-gray-100 dark:scrollbar-track-gray-800
                       hover:scrollbar-thumb-pink-400 dark:hover:scrollbar-thumb-pink-500
                       scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
        >
          {tools.map((category) => (
            <div key={category.category} className="mb-6">
              {/* 分类标题 */}
              <div className="flex items-center gap-3 mb-3 px-2">
                <h2
                  className="text-xs font-bold bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 
                               dark:from-pink-400 dark:via-purple-400 dark:to-indigo-400 
                               bg-clip-text text-transparent uppercase tracking-wider
                               animate-text"
                >
                  {category.category}
                </h2>

                {/* 渐变分隔线 */}
                <div
                  className="flex-1 h-px bg-linear-to-r from-pink-200 via-purple-200 to-transparent 
                               dark:from-pink-800 dark:via-purple-800 dark:to-transparent
                               opacity-60"
                ></div>
              </div>

              {/* 工具列表 */}
              <div className="space-y-1">
                {category.items.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = location.pathname === `/tools/${tool.id}`;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => {
                        navigate(`/tools/${tool.id}`);
                        if (window.innerWidth < 1024) toggleSidebar();
                      }}
                      className={`w-full flex items-center px-3 py-2 rounded-lg
                        transition-all duration-200 group
                        ${
                          isActive
                            ? "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-600 dark:hover:text-violet-400"
                        }`}
                    >
                      <Icon className={`w-5 h-5 mr-3 ${
                        isActive
                          ? "text-violet-500 dark:text-violet-400"
                          : "text-gray-400 group-hover:text-violet-500 dark:group-hover:text-violet-400"
                      }`} />
                      <span className="text-sm font-medium flex-1 text-left">
                        {tool.label}
                      </span>
                      <ChevronRight className={`w-4 h-4 transition-all duration-200 ${
                        isActive
                          ? "opacity-100 translate-x-1"
                          : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};
