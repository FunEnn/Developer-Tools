import React, { useState, useRef } from "react";
import QRCode from "qrcode";
import jsQR from "jsqr";
import { Upload, Download, Copy } from "lucide-react";

export type QROptions = {
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
  margin: number;
  color: {
    dark: string;
    light: string;
  };
  width: number;
};

export const QrCodeTool = () => {
  const [text, setText] = useState("");
  const [qrImage, setQrImage] = useState<string>("");
  const [decodedText, setDecodedText] = useState<string>("");
  const [options, setOptions] = useState<QROptions>({
    errorCorrectionLevel: "M",
    margin: 4,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
    width: 300,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 生成二维码
  const generateQR = async () => {
    if (!text) return;

    try {
      const url = await QRCode.toDataURL(text, options);
      setQrImage(url);
    } catch (err) {
      console.error("生成二维码失败:", err);
    }
  };

  // 解析二维码图片
  const decodeQR = async (file: File) => {
    const image = new Image();
    image.src = URL.createObjectURL(file);

    image.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 设置canvas大小与图片一致
      canvas.width = image.width;
      canvas.height = image.height;

      // 绘制图片到canvas
      ctx.drawImage(image, 0, 0);

      // 获取图片数据
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // 解析二维码
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        setDecodedText(code.data);
      } else {
        setDecodedText("未能识别二维码");
      }

      URL.revokeObjectURL(image.src);
    };
  };

  // 下载二维码图片
  const downloadQR = () => {
    if (!qrImage) return;

    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = qrImage;
    link.click();
  };

  // 复制文本到剪贴板
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* 生成二维码部分 */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 
                    dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
          生成二维码
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              输入文本
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-32 p-4 rounded-xl
                      border border-gray-200 dark:border-gray-700
                      bg-white dark:bg-gray-800 
                      text-gray-900 dark:text-gray-100
                      focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600 
                      focus:border-transparent transition-all duration-200"
              placeholder="输入要生成二维码的文本..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                纠错级别
              </label>
              <select
                value={options.errorCorrectionLevel}
                onChange={(e) =>
                  setOptions((prev) => ({
                    ...prev,
                    errorCorrectionLevel: e.target.value as "L" | "M" | "Q" | "H",
                  }))
                }
                className="w-full p-2 rounded-xl
                        border border-gray-200 dark:border-gray-700
                        bg-white dark:bg-gray-800 
                        text-gray-900 dark:text-gray-100
                        focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600 
                        focus:border-transparent transition-all duration-200"
              >
                <option value="L">低 (7%)</option>
                <option value="M">中 (15%)</option>
                <option value="Q">较高 (25%)</option>
                <option value="H">高 (30%)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                边距大小
              </label>
              <input
                type="number"
                value={options.margin}
                onChange={(e) =>
                  setOptions((prev) => ({
                    ...prev,
                    margin: Number(e.target.value),
                  }))
                }
                min="0"
                max="10"
                className="w-full p-2 rounded-xl
                        border border-gray-200 dark:border-gray-700
                        bg-white dark:bg-gray-800 
                        text-gray-900 dark:text-gray-100
                        focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600 
                        focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                前景色
              </label>
              <input
                type="color"
                value={options.color.dark}
                onChange={(e) =>
                  setOptions((prev) => ({
                    ...prev,
                    color: { ...prev.color, dark: e.target.value },
                  }))
                }
                className="w-full h-10 p-1 rounded-xl cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                背景色
              </label>
              <input
                type="color"
                value={options.color.light}
                onChange={(e) =>
                  setOptions((prev) => ({
                    ...prev,
                    color: { ...prev.color, light: e.target.value },
                  }))
                }
                className="w-full h-10 p-1 rounded-xl cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={generateQR}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-400 to-indigo-400 
                   text-white shadow-sm hover:from-violet-500 hover:to-indigo-500 
                   transition-colors"
          >
            生成二维码
          </button>

          {qrImage && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={qrImage}
                  alt="QR Code"
                  className="border border-gray-200 dark:border-gray-700 rounded-xl"
                />
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={downloadQR}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl
                         bg-gradient-to-r from-emerald-400 to-green-400
                         text-white shadow-sm hover:from-emerald-500 hover:to-green-500 
                         transition-colors"
                >
                  <Download className="w-4 h-4" />
                  下载
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 解析二维码部分 */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 
                    dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
          解析二维码
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              上传二维码图片
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
                    点击或拖拽上传二维码图片
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] && decodeQR(e.target.files[0])
                  }
                />
              </label>
            </div>
          </div>

          {decodedText && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 p-4 
                           bg-white dark:bg-gray-800 rounded-xl
                           border border-gray-200 dark:border-gray-700">
                <div className="flex-1 break-all text-gray-900 dark:text-gray-100">
                  {decodedText}
                </div>
                <button
                  onClick={() => copyToClipboard(decodedText)}
                  className="p-2 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg
                         transition-colors group"
                  title="复制内容"
                >
                  <Copy className="w-4 h-4 text-gray-400 group-hover:text-violet-500 
                               dark:group-hover:text-violet-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 隐藏的canvas用于解析二维码 */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default QrCodeTool;
