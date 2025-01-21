import React, { useState, useRef } from "react";
import { ImageDown, ArrowRight, Download, Upload, Settings } from "lucide-react";

export const ImageCompressor = () => {
  const [image, setImage] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
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

  const compressImage = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      // 压缩并下载
      const link = document.createElement("a");
      link.download = "compressed.jpg";
      link.href = canvas.toDataURL("image/jpeg", quality / 100);
      link.click();
    };

    img.src = image;
  };

  return (
    <div className="space-y-6">
      <h3 className="flex items-center gap-2 text-lg font-bold 
                   bg-gradient-to-r from-emerald-600 to-green-600 
                   dark:from-emerald-400 dark:to-green-400 
                   bg-clip-text text-transparent">
        <ImageDown className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
        图片压缩
      </h3>

      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 
                       border-2 border-dashed rounded-xl cursor-pointer 
                       border-emerald-300 dark:border-emerald-600
                       hover:border-emerald-400 dark:hover:border-emerald-500
                       hover:bg-emerald-50 dark:hover:bg-emerald-900/20
                       transition-all duration-200 group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-4 text-emerald-400 dark:text-emerald-500
                           group-hover:text-emerald-500 dark:group-hover:text-emerald-400
                           transition-colors" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400
                       group-hover:text-emerald-600 dark:group-hover:text-emerald-300">
              点击或拖拽上传图片
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              支持 PNG、JPG、WebP 等格式
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
              压缩质量 ({quality}%)
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none 
                      cursor-pointer accent-emerald-500 dark:accent-emerald-400"
            />
          </div>

          <button
            onClick={compressImage}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 via-green-400 to-lime-400 
                   text-white shadow-sm hover:from-emerald-500 hover:via-green-500 hover:to-lime-500 
                   transition-colors"
          >
            压缩并下载
          </button>
        </>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default ImageCompressor;
