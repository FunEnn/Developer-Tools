import { useRouteError, Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import React from "react";

export const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <AlertCircle className="h-16 w-16 text-red-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {error.status === 404 ? "页面未找到" : "出错了"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {error.status === 404
              ? "抱歉，您访问的页面不存在。"
              : "抱歉，发生了意外错误。"}
          </p>
          {error.statusText && (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {error.statusText}
            </p>
          )}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            返回上页
          </button>
          <Link
            to="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
