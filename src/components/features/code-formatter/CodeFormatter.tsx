import React, { useState } from "react";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import parserHtml from "prettier/parser-html";
import parserCss from "prettier/parser-postcss";
import parserTypescript from "prettier/parser-typescript";

const languages = [
  { value: "javascript", label: "JavaScript", parser: "babel" },
  { value: "typescript", label: "TypeScript", parser: "typescript" },
  { value: "html", label: "HTML", parser: "html" },
  { value: "css", label: "CSS", parser: "css" },
];

export const CodeFormatter = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [error, setError] = useState<String | null>(null);
  const [formatted, setFormatted] = useState<String | null>(null);

  const formatCode = async () => {
    setError(null);
    try {
      const parser = languages.find((lang) => lang.value === language)?.parser;
      if (!parser) {
        throw new Error("不支持的语言类型");
      }

      const result = await prettier.format(code, {
        parser,
        plugins: [parserBabel, parserHtml, parserCss, parserTypescript],
        semi: true,
        singleQuote: true,
      });

      setFormatted(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "格式化失败");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          选择语言
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          输入代码
        </label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-48 p-2 font-mono text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600"
          placeholder="输入要格式化的代码..."
        />
      </div>

      <button
        onClick={formatCode}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        格式化
      </button>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      {formatted && (
        <div>
          <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">
            格式化结果
          </h3>
          <pre className="p-4 bg-gray-50 rounded-md dark:bg-gray-700/50 overflow-auto font-mono text-sm">
            {formatted}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CodeFormatter;
