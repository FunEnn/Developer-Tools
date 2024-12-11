import React, { useState } from "react";
import { Upload } from "lucide-react";

export const SvgEditor = () => {
  const [svgCode, setSvgCode] = useState("");
  const [preview, setPreview] = useState("");

  const handleSvgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setSvgCode(content);
        setPreview(content);
      };
      reader.readAsText(file);
    }
  };

  const updatePreview = () => {
    setPreview(svgCode);
  };

  const downloadSvg = () => {
    const blob = new Blob([svgCode], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "edited.svg";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          上传SVG
        </label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-4 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                点击或拖拽上传SVG文件
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".svg"
              onChange={handleSvgUpload}
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            SVG代码
          </label>
          <textarea
            value={svgCode}
            onChange={(e) => setSvgCode(e.target.value)}
            className="w-full h-96 p-2 font-mono text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600"
            placeholder="输入SVG代码..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            预览
          </label>
          <div
            className="w-full h-96 border rounded-md p-4 bg-white dark:bg-gray-800 overflow-auto"
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={updatePreview}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          更新预览
        </button>
        <button
          onClick={downloadSvg}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          下载SVG
        </button>
      </div>
    </div>
  );
};

export default SvgEditor;
