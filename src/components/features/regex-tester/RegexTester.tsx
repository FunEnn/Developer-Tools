import { useState } from "react";

interface Match {
  text: string;
  index: number;
  groups?: { [key: string]: string };
}

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
    setFlags(prev => 
      prev.includes(flag)
        ? prev.replace(flag, "")
        : prev + flag
    );
  };

  return (
    <div className="space-y-6">
      {/* 正则表达式输入 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          正则表达式
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="flex-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            placeholder="/pattern/"
          />
          <button
            onClick={testRegex}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            测试
          </button>
        </div>
      </div>

      {/* 标志位选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          标志位
        </label>
        <div className="flex flex-wrap gap-2">
          {flagOptions.map((flag) => (
            <button
              key={flag.value}
              onClick={() => toggleFlag(flag.value)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                flags.includes(flag.value)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
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
          className="w-full h-32 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          placeholder="输入要测试的文本..."
        />
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* 匹配结果 */}
      {matches.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">
            匹配结果 ({matches.length})
          </h3>
          <div className="space-y-2">
            {matches.map((match, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-md dark:bg-gray-700/50"
              >
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">匹配文本:</span>
                  <code className="px-2 py-0.5 bg-gray-100 rounded dark:bg-gray-600">
                    {match.text}
                  </code>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  位置: {match.index}
                </div>
                {match.groups && Object.keys(match.groups).length > 0 && (
                  <div className="mt-2 text-sm">
                    <span className="font-medium">分组:</span>
                    <pre className="mt-1 p-2 bg-gray-100 rounded dark:bg-gray-600">
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
