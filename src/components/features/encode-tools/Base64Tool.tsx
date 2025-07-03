import { useState } from "react";

type ConvertMode = "base64" | "url" | "unicode" | "hex";
type Direction = "encode" | "decode";

export const Base64Tool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<ConvertMode>("base64");
  const [direction, setDirection] = useState<Direction>("encode");
  const [error, setError] = useState<string | null>(null);

  const convert = {
    base64: {
      encode: (str: string) => btoa(str),
      decode: (str: string) => atob(str),
    },
    url: {
      encode: (str: string) => encodeURIComponent(str),
      decode: (str: string) => decodeURIComponent(str),
    },
    unicode: {
      encode: (str: string) => str.split('').map(c => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`).join(''),
      decode: (str: string) => str.replace(/\\u[\dA-F]{4}/gi, match => 
        String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
      ),
    },
    hex: {
      encode: (str: string) => str.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(''),
      decode: (str: string) => str.match(/.{1,2}/g)?.map(byte => String.fromCharCode(parseInt(byte, 16))).join('') || '',
    },
  };

  const handleConvert = () => {
    setError(null);
    if (!input.trim()) {
      setError("请输入内容");
      return;
    }

    try {
      const result = convert[mode][direction](input);
      setOutput(result);
    } catch (err) {
      setError(`转换错误：${err instanceof Error ? err.message : '输入格式不正确'}`);
    }
  };

  const modes = [
    { value: "base64", label: "Base64" },
    { value: "url", label: "URL编码" },
    { value: "unicode", label: "Unicode" },
    { value: "hex", label: "十六进制" },
  ];

  return (
    <div className="space-y-6">
      {/* 模式选择 */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {modes.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value as ConvertMode)}
              className={`px-4 py-2 rounded-xl transition-all duration-200 shadow-sm
                ${mode === m.value
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setDirection("encode")}
            className={`flex-1 py-2.5 rounded-xl transition-all duration-200 shadow-sm
              ${direction === "encode"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
          >
            编码
          </button>
          <button
            onClick={() => setDirection("decode")}
            className={`flex-1 py-2.5 rounded-xl transition-all duration-200 shadow-sm
              ${direction === "decode"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
          >
            解码
          </button>
        </div>
      </div>

      {/* 输入输出区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {direction === "encode" ? "原文" : "编码内容"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-40 p-3 rounded-xl
                     border border-gray-300 dark:border-gray-700
                     bg-white dark:bg-gray-800
                     text-gray-900 dark:text-gray-100
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600
                     shadow-sm transition-all duration-200"
            placeholder={`请输入要${direction === "encode" ? "编码" : "解码"}的内容`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {direction === "encode" ? "编码结果" : "解码结果"}
          </label>
          <textarea
            value={output}
            readOnly
            className="w-full h-40 p-3 rounded-xl
                     border border-gray-300 dark:border-gray-700
                     bg-gray-50 dark:bg-gray-800
                     text-gray-900 dark:text-gray-100
                     shadow-sm"
          />
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="p-3 rounded-xl bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleConvert}
          className="px-4 py-2.5 rounded-xl bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-all duration-200"
        >
          转换
        </button>
        <button
          onClick={() => {
            setInput("");
            setOutput("");
            setError(null);
          }}
          className="px-4 py-2.5 rounded-xl bg-gray-500 text-white shadow-sm hover:bg-gray-600 transition-all duration-200"
        >
          清空
        </button>
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(output);
          }}
          className="px-4 py-2.5 rounded-xl bg-blue-500 text-white shadow-sm hover:bg-blue-600 transition-all duration-200"
        >
          复制结果
        </button>
      </div>
    </div>
  );
};

export default Base64Tool;
