import React, { useState } from "react";
import { Search, Flag, Code2, AlertCircle } from "lucide-react";

interface Match {
  text: string;
  index: number;
  groups?: { [key: string]: string };
}

// 常用正则表达式选项
const commonPatterns = [
  { label: "电子邮件", pattern: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$" },
  { label: "电话号码", pattern: "^\\+?[1-9]\\d{1,14}$" },
  { label: "URL", pattern: "^(https?|ftp)://[^\\s/$.?#].[^\\s]*$" },
  { label: "邮政编码", pattern: "^\\d{5}(-\\d{4})?$" },
  {
    label: "IP 地址",
    pattern:
      "^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$",
  },
];

export const RegexTester = () => {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 预设标志位
  const flagOptions = [
    { value: "g", label: "全局匹配", description: "查找所有匹配项" },
    { value: "i", label: "忽略大小写", description: "不区分大小写" },
    { value: "m", label: "多行匹配", description: "^和$匹配每行" },
    { value: "s", label: "点号匹配", description: ".匹配换行符" },
    { value: "u", label: "Unicode", description: "启用Unicode支持" },
    { value: "y", label: "粘性匹配", description: "从lastIndex开始匹配" },
  ];

  const testRegex = () => {
    setError(null);
    setMatches([]);

    if (!pattern) {
      setError("请输入正则表达式");
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const results: Match[] = [];
      let match;

      while ((match = regex.exec(testString)) !== null) {
        results.push({
          text: match[0],
          index: match.index,
          groups: match.groups,
        });

        if (!flags.includes("g")) break;
      }

      setMatches(results);
      if (results.length === 0) {
        setError("没有找到匹配项");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "无效的正则表达式");
    }
  };

  const toggleFlag = (flag: string) => {
    setFlags((prev) =>
      prev.includes(flag) ? prev.replace(flag, "") : prev + flag
    );
  };

  const handlePatternSelect = (selectedPattern: string) => {
    setPattern(selectedPattern);
  };

  return (
    <div className="space-y-6">
      {/* 常用正则表达式选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          常用正则表达式
        </label>
        <select
          onChange={(e) => handlePatternSelect(e.target.value)}
          className="w-full p-2 rounded-xl
                  border border-gray-200 dark:border-gray-700
                  bg-white dark:bg-gray-800 
                  text-gray-900 dark:text-gray-100
                  focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600 
                  focus:border-transparent transition-all duration-200"
        >
          <option value="">选择一个常用正则表达式</option>
          {commonPatterns.map((option) => (
            <option key={option.label} value={option.pattern}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 正则表达式输入 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          正则表达式
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl
                      border border-gray-200 dark:border-gray-700
                      bg-white dark:bg-gray-800 
                      text-gray-900 dark:text-gray-100
                      focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600 
                      focus:border-transparent transition-all duration-200"
              placeholder="/pattern/"
            />
          </div>
          <button
            onClick={testRegex}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-400 to-indigo-400 
                   text-white shadow-sm hover:from-violet-500 hover:to-indigo-500 
                   transition-colors"
          >
            测试
          </button>
        </div>
      </div>

      {/* 标志位选择 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Flag className="w-4 h-4" />
          标志位
        </label>
        <div className="flex flex-wrap gap-2">
          {flagOptions.map((flag) => (
            <button
              key={flag.value}
              onClick={() => toggleFlag(flag.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  flags.includes(flag.value)
                    ? "bg-gradient-to-r from-violet-400 to-indigo-400 text-white shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-violet-400 dark:hover:border-violet-500"
                }`}
              title={flag.description}
            >
              {flag.label} ({flag.value})
            </button>
          ))}
        </div>
      </div>

      {/* 测试文本 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          测试文本
        </label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          className="w-full h-32 p-4 rounded-xl
                  border border-gray-200 dark:border-gray-700
                  bg-white dark:bg-gray-800 
                  text-gray-900 dark:text-gray-100
                  focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600 
                  focus:border-transparent transition-all duration-200"
          placeholder="输入要测试的文本..."
        />
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl
                     bg-red-50 dark:bg-red-900/20 
                     text-red-600 dark:text-red-400
                     border border-red-200 dark:border-red-800">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* 匹配结果 */}
      {matches.length > 0 && (
        <div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 
                      dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4">
            匹配结果 ({matches.length})
          </h3>
          <div className="space-y-3">
            {matches.map((match, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-white dark:bg-gray-800 
                        border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    匹配文本:
                  </span>
                  <code className="px-2 py-1 rounded-lg
                               bg-violet-50 dark:bg-violet-900/20
                               text-violet-700 dark:text-violet-300
                               font-mono">
                    {match.text}
                  </code>
                </div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  位置: {match.index}
                </div>
                {match.groups && Object.keys(match.groups).length > 0 && (
                  <div className="mt-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      分组:
                    </span>
                    <pre className="mt-2 p-3 rounded-lg overflow-x-auto
                                bg-gray-50 dark:bg-gray-900/50
                                text-sm font-mono">
                      {JSON.stringify(match.groups, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegexTester;
