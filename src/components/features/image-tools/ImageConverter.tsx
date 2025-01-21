import React, { useState, useRef } from "react";
import { FileImage, ArrowRight, Download, Upload } from "lucide-react";

export const ImageConverter = () => {
  const [image, setImage] = useState<string | null>(null);
  const [format, setFormat] = useState("png");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImage(e.target?.result as string);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const convertImage = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      // 转换并下载
      const link = document.createElement("a");
      link.download = `converted.${format}`;
      link.href = canvas.toDataURL(`image/${format}`);
      link.click();
    };

    img.src = image;
  };

  return (
    <div className="space-y-6">
      <h3 className="flex items-center gap-2 text-lg font-bold 
                   bg-gradient-to-r from-sky-600 to-cyan-600 
                   dark:from-sky-400 dark:to-cyan-400 
                   bg-clip-text text-transparent">
        <FileImage className="w-6 h-6 text-sky-500 dark:text-sky-400" />
        图片格式转换
      </h3>

      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 
                       border-2 border-dashed rounded-xl cursor-pointer 
                       border-sky-300 dark:border-sky-600
                       hover:border-sky-400 dark:hover:border-sky-500
                       hover:bg-sky-50 dark:hover:bg-sky-900/20
                       transition-all duration-200 group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-4 text-sky-400 dark:text-sky-500
                           group-hover:text-sky-500 dark:group-hover:text-sky-400
                           transition-colors" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400
                       group-hover:text-sky-600 dark:group-hover:text-sky-300">
              点击或拖拽上传图片
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              支持 PNG、JPG、WebP、AVIF 等格式
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </label>
      </div>

      {image && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              预览
            </label>
            <div className="max-w-full overflow-auto p-4 rounded-xl
                        bg-white dark:bg-gray-800 
                        border border-gray-200 dark:border-gray-700">
              <img src={image} alt="预览" className="max-h-[400px] mx-auto" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              选择格式
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full p-2 rounded-xl
                      border border-gray-200 dark:border-gray-700
                      bg-white dark:bg-gray-800 
                      text-gray-900 dark:text-gray-100
                      focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600 
                      focus:border-transparent transition-all duration-200"
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPEG</option>
              <option value="webp">WebP</option>
            </select>
          </div>

          <button
            onClick={convertImage}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-400 
                   text-white shadow-sm hover:from-violet-500 hover:via-indigo-500 hover:to-blue-500 
                   transition-colors"
          >
            转换并下载
          </button>
        </>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default ImageConverter;
