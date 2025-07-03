import { useState } from "react";
import prettier from "prettier";
import parserTypescript from "prettier/parser-typescript";
import parserBabel from "prettier/parser-babel"; 

export const CodeFormatter = () => {
  const [code, setCode] = useState("");
  const [formatted, setFormatted] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatCode = async () => {
    setError(null);
    try {
      if (!code.trim()) {
        throw new Error("请输入需要格式化的代码");
      }

      const result = await prettier.format(code, {
        parser: "babel",
        plugins: [parserBabel],
        printWidth: 80,
        tabWidth: 2,
        semi: true,
        singleQuote: false,
      });

      setFormatted(result);
    } catch (err) {
      console.error("Format error:", err);
      setError(err instanceof Error ? err.message : "格式化失败，请检查代码语法是否正确");
      setFormatted(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          输入代码
        </label>
        <div className="relative group">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-48 p-4 font-mono text-sm rounded-xl
                     border border-gray-200 dark:border-gray-700
                     bg-white dark:bg-gray-800
                     text-gray-900 dark:text-gray-100
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600 focus:border-transparent
                     shadow-sm transition-all duration-200
                     scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600
                     scrollbar-track-transparent"
            placeholder="输入要格式化的代码..."
            spellCheck="false"
          />
          <div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-400/10 to-blue-400/10 
                        opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={formatCode}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-400 
                   text-white shadow-sm
                   hover:from-violet-500 hover:via-indigo-500 hover:to-blue-500
                   transition-all duration-200"
        >
          格式化
        </button>
        <button
          onClick={async () => {
            if (formatted) {
              await navigator.clipboard.writeText(formatted);
            }
          }}
          disabled={!formatted}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400
                   text-white shadow-sm
                   hover:from-blue-500 hover:via-cyan-500 hover:to-teal-500
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200"
        >
          复制结果
        </button>
      </div>

      {error && (
        <div
          className="p-4 rounded-xl bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 
                      border border-red-100 dark:border-red-800/50
                      shadow-sm"
        >
          {error}
        </div>
      )}

      {formatted && (
        <div className="space-y-2">
          <h3
            className="text-lg font-medium bg-gradient-to-r from-violet-400 to-blue-400 
                        bg-clip-text text-transparent"
          >
            格式化结果
          </h3>
          <div className="relative group">
            <div
              className="p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 
                          dark:from-gray-800 dark:to-gray-900
                          border border-gray-200/50 dark:border-gray-700/50
                          shadow-sm backdrop-blur-sm
                          hover:shadow-md hover:border-violet-200/50 dark:hover:border-violet-700/50
                          transition-all duration-200"
            >
              <pre
                className="overflow-auto font-mono text-sm text-gray-800 dark:text-gray-200
                            max-h-[400px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600
                            scrollbar-track-transparent"
              >
                {formatted}
              </pre>
            </div>
            <div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-400/5 to-blue-400/5 
                          opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeFormatter;
