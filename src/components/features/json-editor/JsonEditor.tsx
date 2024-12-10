import React, { useState } from "react";
import Editor from "@monaco-editor/react";

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
      setError("Invalid JSON format");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-medium mb-2">输入JSON</h3>
          <Editor
            height="400px"
            defaultLanguage="json"
            value={input}
            onChange={(value) => setInput(value || "")}
            theme="vs-dark"
          />
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">格式化结果</h3>
          <Editor
            height="400px"
            defaultLanguage="json"
            value={formatted}
            options={{ readOnly: true }}
            theme="vs-dark"
          />
        </div>
      </div>

      {error && <div className="text-red-500 mt-2">{error}</div>}

      <div className="flex gap-2">
        <button
          onClick={formatJson}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          格式化
        </button>
        <button
          onClick={() => setInput("")}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          清空
        </button>
      </div>
    </div>
  );
};

export default JsonEditor;
