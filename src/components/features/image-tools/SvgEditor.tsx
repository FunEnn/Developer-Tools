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
          <label className="flex flex-col items-center justify-center w-full h-32 
                           border-2 border-dashed rounded-xl cursor-pointer 
                           border-gray-300 dark:border-gray-600
                           hover:border-violet-400 dark:hover:border-violet-500
                           hover:bg-violet-50 dark:hover:bg-violet-900/20
                           transition-all duration-200 group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-4 text-gray-400 dark:text-gray-500
                               group-hover:text-violet-500 dark:group-hover:text-violet-400
                               transition-colors" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400
                          group-hover:text-violet-600 dark:group-hover:text-violet-300">
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
            className="w-full h-96 p-4 font-mono text-sm rounded-xl
                     border border-gray-200 dark:border-gray-700
                     bg-white dark:bg-gray-800 
                     text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600 
                     focus:border-transparent transition-all duration-200"
            placeholder="输入SVG代码..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            预览
          </label>
          <div className="w-full h-96 rounded-xl p-4 
                        bg-white dark:bg-gray-800 
                        border border-gray-200 dark:border-gray-700
                        overflow-auto"
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={updatePreview}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-400 
                   text-white shadow-sm hover:from-violet-500 hover:via-indigo-500 hover:to-blue-500 
                   transition-colors"
        >
          更新预览
        </button>
        <button
          onClick={downloadSvg}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-green-400
                   text-white shadow-sm hover:from-emerald-500 hover:to-green-500 
                   transition-colors"
        >
          下载SVG
        </button>
      </div>
    </div>
  );
};

export default SvgEditor;
