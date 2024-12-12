import React, { useState } from "react";
import { Copy, Download, Palette, Droplet, Shuffle, Pipette } from "lucide-react";
import { HexColorPicker, HexColorInput } from "react-colorful";

interface ColorScheme {
  name: string;
  colors: string[];
}

const ColorPicker: React.FC = () => {
  const [color, setColor] = useState("#4a90e2");
  const [savedColors, setSavedColors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"picker" | "palette" | "gradient">(
    "picker"
  );
  const [isPickerMode, setIsPickerMode] = useState(false);

  const colorSchemes: ColorScheme[] = [
    {
      name: "主色调",
      colors: ["#4a90e2", "#357abd", "#2171b5", "#1a5a8e", "#134c77"],
    },
    {
      name: "互补色",
      colors: ["#4a90e2", "#e29a4a", "#e24a4a", "#4ae24a", "#4a4ae2"],
    },
    {
      name: "单色调",
      colors: ["#4a90e2", "#6ba3e8", "#8cb6ed", "#adc9f3", "#cedcf8"],
    },
  ];

  const generateRandomColor = () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
    setColor(randomColor);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  const saveColor = () => {
    if (!savedColors.includes(color)) {
      setSavedColors((prev) => [...prev, color]);
    }
  };

  const getRgb = () => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const getHsl = () => {
    const r = parseInt(color.slice(1, 3), 16) / 255;
    const g = parseInt(color.slice(3, 5), 16) / 255;
    const b = parseInt(color.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const hexToHsl = (hex: string) => {
    // 将 hex 转换为 rgb
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
  };

  const handleColorPick = async () => {
    try {
      // @ts-ignore - EyeDropper API 可能在某些浏览器中不支持
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      setColor(result.sRGBHex);
    } catch (err) {
      console.error("颜色拾取失败:", err);
    }
  };

  const renderPalettePage = () => {
    const { h } = hexToHsl(color);
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 单色调色板 */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              单色调色板
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {Array.from({ length: 9 }, (_, i) => {
                const lightness = 90 - i * 10;
                return (
                  <button
                    key={i}
                    onClick={() => setColor(hslToHex(h, 70, lightness))}
                    className="h-12 rounded-md flex items-center justify-between px-3"
                    style={{
                      backgroundColor: `hsl(${h}, 70%, ${lightness}%)`,
                    }}
                  >
                    <span className="text-sm font-mono">{`${lightness}%`}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 互补色调色板 */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              互补色调色板
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { s: 70, l: 50 }, // 原始颜色
                { s: 70, l: 50, hueOffset: 180 }, // 互补色
                { s: 60, l: 60 }, // 浅色原始
                { s: 60, l: 60, hueOffset: 180 }, // 浅色互补
                { s: 80, l: 40 }, // 深色原始
                { s: 80, l: 40, hueOffset: 180 }, // 深色互补
              ].map(({ s, l, hueOffset = 0 }, i) => {
                const finalHue = (h + (hueOffset || 0)) % 360;
                return (
                  <button
                    key={i}
                    onClick={() => setColor(hslToHex(finalHue, s, l))}
                    className="h-12 rounded-md flex items-center justify-between px-3"
                    style={{ backgroundColor: `hsl(${finalHue}, ${s}%, ${l}%)` }}
                  >
                    <span className="text-sm font-mono text-white text-shadow">
                      {hueOffset ? "互补" : "原色"} {s}s {l}l
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 三色调色板 */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              三色调色板
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { s: 70, l: 50, label: "主色" }, // 主色
                { s: 70, l: 50, hueOffset: 120, label: "三分色 1" }, // 三分色1
                { s: 70, l: 50, hueOffset: 240, label: "三分色 2" }, // 三分色2
                { s: 60, l: 60, label: "主色浅" }, // 浅色主色
                { s: 60, l: 60, hueOffset: 120, label: "三分色浅 1" }, // 浅色三分色1
                { s: 60, l: 60, hueOffset: 240, label: "三分色浅 2" }, // 浅色三分色2
              ].map(({ s, l, hueOffset = 0, label }, i) => {
                const finalHue = (h + (hueOffset || 0)) % 360;
                return (
                  <button
                    key={i}
                    onClick={() => setColor(hslToHex(finalHue, s, l))}
                    className="h-12 rounded-md flex items-center justify-between px-3"
                    style={{ backgroundColor: `hsl(${finalHue}, ${s}%, ${l}%)` }}
                  >
                    <span className="text-sm font-mono text-white text-shadow">
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGradientPage = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 线性渐变 */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            线性渐变
          </h3>
          <div className="grid gap-4">
            {[
              { angle: 0, label: "从上到下" },
              { angle: 90, label: "从左到右" },
              { angle: 45, label: "对角线" },
              { angle: 135, label: "反对角线" },
            ].map(({ angle, label }) => (
              <div
                key={angle}
                className="h-24 rounded-lg cursor-pointer"
                style={{
                  background: `linear-gradient(${angle}deg, ${color}, ${
                    colorSchemes[0].colors[4]
                  })`,
                }}
                onClick={() => {
                  copyToClipboard(
                    `background: linear-gradient(${angle}deg, ${color}, ${
                      colorSchemes[0].colors[4]
                    });`
                  );
                }}
                title="点击复制 CSS"
              >
                <div className="h-full flex items-center justify-center text-white font-medium shadow-sm">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 径向渐变 */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            径向渐变
          </h3>
          <div className="grid gap-4">
            {[
              { position: "circle at center", label: "圆形" },
              { position: "ellipse at center", label: "椭圆形" },
              { position: "circle at top left", label: "左上角" },
              { position: "circle at bottom right", label: "右下角" },
            ].map(({ position, label }) => (
              <div
                key={position}
                className="h-24 rounded-lg cursor-pointer"
                style={{
                  background: `radial-gradient(${position}, ${color}, ${
                    colorSchemes[0].colors[4]
                  })`,
                }}
                onClick={() => {
                  copyToClipboard(
                    `background: radial-gradient(${position}, ${color}, ${
                      colorSchemes[0].colors[4]
                    });`
                  );
                }}
                title="点击复制 CSS"
              >
                <div className="h-full flex items-center justify-center text-white font-medium shadow-sm">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          颜色工具
        </h2>
        <div className="flex gap-2">
          {(["picker", "palette", "gradient"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md ${
                activeTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              {tab === "picker"
                ? "选色器"
                : tab === "palette"
                  ? "调色板"
                  : "渐变色"}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "picker" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <HexColorPicker color={color} onChange={setColor} />
            <div className="flex items-center gap-4">
              <HexColorInput
                color={color}
                onChange={setColor}
                prefixed
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              />
              <button
                onClick={handleColorPick}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                title="拾取颜色"
              >
                <Pipette className="w-5 h-5" />
              </button>
              <button
                onClick={generateRandomColor}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                title="随机颜色"
              >
                <Shuffle className="w-5 h-5" />
              </button>
              <button
                onClick={saveColor}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                title="保存颜色"
              >
                <Droplet className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {[
                { label: "RGB", value: getRgb() },
                { label: "HSL", value: getHsl() },
                { label: "HEX", value: color.toUpperCase() },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{label}</span>
                  <button
                    onClick={() => copyToClipboard(value)}
                    className="text-sm text-blue-500 hover:text-blue-600"
                  >
                    {value}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              保存的颜色
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {savedColors.map((savedColor, index) => (
                <button
                  key={index}
                  onClick={() => setColor(savedColor)}
                  className="w-full aspect-square rounded-md"
                  style={{ backgroundColor: savedColor }}
                  title={savedColor}
                />
              ))}
            </div>

            <h3 className="font-medium text-gray-900 dark:text-gray-100 mt-6">
              配色方案
            </h3>
            <div className="space-y-4">
              {colorSchemes.map((scheme) => (
                <div key={scheme.name} className="space-y-2">
                  <h4 className="text-sm text-gray-500">{scheme.name}</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {scheme.colors.map((schemeColor, index) => (
                      <button
                        key={index}
                        onClick={() => setColor(schemeColor)}
                        className="w-full aspect-square rounded-md"
                        style={{ backgroundColor: schemeColor }}
                        title={schemeColor}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {activeTab === "palette" && renderPalettePage()}
      {activeTab === "gradient" && renderGradientPage()}
    </div>
  );
};

export default ColorPicker;
