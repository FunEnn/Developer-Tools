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
              className={`px-4 py-2 rounded-md transition-colors ${
                mode === m.value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setDirection("encode")}
            className={`flex-1 py-2 rounded-md transition-colors ${
              direction === "encode"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            编码
          </button>
          <button
            onClick={() => setDirection("decode")}
            className={`flex-1 py-2 rounded-md transition-colors ${
              direction === "decode"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
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
            className="w-full h-40 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
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
            className="w-full h-40 p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleConvert}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          转换
        </button>
        <button
          onClick={() => {
            setInput("");
            setOutput("");
            setError(null);
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          清空
        </button>
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(output);
          }}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          复制结果
        </button>
      </div>
    </div>
  );
};

export default Base64Tool;
