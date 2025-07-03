import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Copy, Download, Upload } from "lucide-react";

export const JsonEditor = () => {
  const [input, setInput] = useState("");
  const [formatted, setFormatted] = useState("");
  const [error, setError] = useState<string | null>(null);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      setFormatted(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err) {
      setError("JSON格式错误");
      setFormatted("");
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  const downloadJson = () => {
    if (!formatted) return;

    const blob = new Blob([formatted], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "formatted.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInput(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              输入JSON
            </h3>
            <div className="flex gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div
                  className="p-2 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-md 
                             transition-colors group"
                  title="上传JSON文件"
                >
                  <Upload className="w-5 h-5 text-gray-600 dark:text-gray-400 
                                    group-hover:text-violet-500 dark:group-hover:text-violet-400" />
                </div>
              </label>
              <button
                onClick={() => copyToClipboard(input)}
                className="p-2 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-md 
                           transition-colors group"
                title="复制内容"
              >
                <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400 
                                  group-hover:text-violet-500 dark:group-hover:text-violet-400" />
              </button>
            </div>
          </div>
          <Editor
            height="400px"
            defaultLanguage="json"
            value={input}
            onChange={(value) => setInput(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              wordWrap: "on",
              wrappingIndent: "indent",
              automaticLayout: true,
            }}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              格式化结果
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(formatted)}
                className="p-2 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-md 
                           transition-colors group"
                title="复制内容"
                disabled={!formatted}
              >
                <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400 
                                  group-hover:text-violet-500 dark:group-hover:text-violet-400" />
              </button>
              <button
                onClick={downloadJson}
                className="p-2 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-md 
                           transition-colors group"
                title="下载JSON"
                disabled={!formatted}
              >
                <Download className="w-5 h-5 text-gray-600 dark:text-gray-400 
                                    group-hover:text-violet-500 dark:group-hover:text-violet-400" />
              </button>
            </div>
          </div>
          <Editor
            height="400px"
            defaultLanguage="json"
            value={formatted}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              wordWrap: "on",
              wrappingIndent: "indent",
              automaticLayout: true,
            }}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={formatJson}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-400 
                     text-white shadow-sm hover:from-violet-500 hover:via-indigo-500 hover:to-blue-500 
                     transition-colors"
        >
          格式化
        </button>
        <button
          onClick={() => {
            setInput("");
            setFormatted("");
            setError(null);
          }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-gray-400 to-gray-500
                     text-white shadow-sm hover:from-gray-500 hover:to-gray-600 
                     transition-colors"
        >
          清空
        </button>
      </div>
    </div>
  );
};

export default JsonEditor;
