export const Skeleton = () => (
  <div className="p-4 w-full">
    {/* 顶部导航栏骨架 */}
    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 animate-pulse"></div>
    
    {/* 主要内容区域骨架 */}
    <div className="space-y-4">
      {/* 标题骨架 */}
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 animate-pulse"></div>
      
      {/* 内容区域骨架 */}
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 animate-pulse"></div>
      </div>
      
      {/* 工具区域骨架 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        ))}
      </div>
    </div>
  </div>
); 