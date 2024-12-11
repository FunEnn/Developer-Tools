import React, { useState, useRef } from "react";
import QRCode from "qrcode";
import jsQR from "jsqr";
import { Upload, Download, Copy } from "lucide-react";

interface QROptions {
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
  margin: number;
  color: {
    dark: string;
    light: string;
  };
  width: number;
}

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
      {/* 生成二维码部�� */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
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
              className="w-full h-32 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
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
                    errorCorrectionLevel: e.target.value as
                      | "L"
                      | "M"
                      | "Q"
                      | "H",
                  }))
                }
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
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
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
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
                className="w-full p-1 border rounded-md"
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
                className="w-full p-1 border rounded-md"
              />
            </div>
          </div>

          <button
            onClick={generateQR}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            生成二维码
          </button>

          {qrImage && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={qrImage}
                  alt="QR Code"
                  className="border rounded-lg"
                />
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={downloadQR}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
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
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          解析二维码
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              上传二维码图片
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
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
              <div className="flex items-center justify-between gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div className="flex-1 break-all">{decodedText}</div>
                <button
                  onClick={() => copyToClipboard(decodedText)}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  title="复制内容"
                >
                  <Copy className="w-4 h-4" />
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
