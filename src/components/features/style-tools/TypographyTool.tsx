import React, { useState } from "react";
import { Copy } from "lucide-react";

interface FontProperty {
  property: string;
  value: string | number;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
}

export const TypographyTool = () => {
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog");
  const [fontProperties, setFontProperties] = useState<FontProperty[]>([
    { property: "font-size", value: 16, unit: "px", min: 8, max: 72, step: 1 },
    { property: "font-weight", value: 400, min: 100, max: 900, step: 100 },
    { property: "line-height", value: 1.5, min: 0.5, max: 3, step: 0.1 },
    { property: "letter-spacing", value: 0, unit: "px", min: -5, max: 10, step: 0.5 },
    { property: "word-spacing", value: 0, unit: "px", min: -5, max: 20, step: 1 },
  ]);

  const [selectedFont, setSelectedFont] = useState("system-ui");
  const commonFonts = [
    "system-ui",
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Georgia",
    "Courier New",
    "Monaco",
  ];

  const generateCSS = () => {
    return fontProperties
      .map(({ property, value, unit }) => `${property}: ${value}${unit || ''};`)
      .join('\n');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  const updateProperty = (index: number, newValue: string | number) => {
    const newProperties = [...fontProperties];
    newProperties[index].value = newValue;
    setFontProperties(newProperties);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold dark:text-white">字体工具</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* 字体选择 */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              字体系列
            </label>
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            >
              {commonFonts.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* ��试文本输入 */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              测试文本
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          {/* 属性控制 */}
          <div className="space-y-4">
            {fontProperties.map((prop, index) => (
              <div key={prop.property}>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                  {prop.property}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    value={prop.value}
                    onChange={(e) => updateProperty(index, Number(e.target.value))}
                    min={prop.min}
                    max={prop.max}
                    step={prop.step}
                    className="flex-1"
                  />
                  <span className="text-sm dark:text-gray-300">
                    {prop.value}{prop.unit || ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {/* 预览区域 */}
          <div className="p-4 border rounded-lg dark:border-gray-700">
            <p
              style={{
                fontFamily: selectedFont,
                ...Object.fromEntries(
                  fontProperties.map(({ property, value, unit }) => [
                    property,
                    `${value}${unit || ''}`
                  ])
                )
              }}
              className="break-words dark:text-white"
            >
              {text}
            </p>
          </div>

          {/* CSS 代码 */}
          <div className="relative">
            <pre className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800 text-sm">
              <code className="dark:text-gray-300">
                {`font-family: ${selectedFont};\n${generateCSS()}`}
              </code>
            </pre>
            <button
              onClick={() => copyToClipboard(`font-family: ${selectedFont};\n${generateCSS()}`)}
              className="absolute top-2 right-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
              title="复制 CSS"
            >
              <Copy className="w-4 h-4 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypographyTool; 