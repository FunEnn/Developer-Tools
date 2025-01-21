import React, { useState, useEffect } from "react";
import { Type, Copy, Palette, Settings, RefreshCw, Save, AlertCircle } from "lucide-react";

interface FontProperty {
  property: string;
  value: string | number;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
}

interface Preset {
  name: string;
  properties: FontProperty[];
  font: string;
}

export const TypographyTool = () => {
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog");
  const [fontProperties, setFontProperties] = useState<FontProperty[]>([
    { property: "font-size", value: 16, unit: "px", min: 8, max: 72, step: 1 },
    { property: "font-weight", value: 400, min: 100, max: 900, step: 100 },
    { property: "line-height", value: 1.5, min: 0.5, max: 3, step: 0.1 },
    { property: "letter-spacing", value: 0, unit: "px", min: -5, max: 10, step: 0.5 },
    { property: "word-spacing", value: 0, unit: "px", min: -5, max: 20, step: 1 },
    { property: "text-indent", value: 0, unit: "px", min: 0, max: 100, step: 1 },
  ]);

  const [selectedFont, setSelectedFont] = useState("system-ui");
  const [showCopied, setShowCopied] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [presets, setPresets] = useState<Preset[]>([]);
  const [showPresetDialog, setShowPresetDialog] = useState(false);

  // 加载预设
  useEffect(() => {
    const savedPresets = localStorage.getItem("typography-presets");
    if (savedPresets) {
      setPresets(JSON.parse(savedPresets));
    }
  }, []);

  const commonFonts = [
    "system-ui",
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Georgia",
    "Courier New",
    "Monaco",
    "Verdana",
    "Tahoma",
    "Trebuchet MS",
  ];

  const presetStyles = [
    {
      name: "标题大字",
      properties: [
        { property: "font-size", value: 32, unit: "px", min: 8, max: 72, step: 1 },
        { property: "font-weight", value: 700, min: 100, max: 900, step: 100 },
        { property: "line-height", value: 1.2, min: 0.5, max: 3, step: 0.1 },
        { property: "letter-spacing", value: -0.5, unit: "px", min: -5, max: 10, step: 0.5 },
      ],
      font: "Arial",
    },
    {
      name: "正文样式",
      properties: [
        { property: "font-size", value: 16, unit: "px", min: 8, max: 72, step: 1 },
        { property: "font-weight", value: 400, min: 100, max: 900, step: 100 },
        { property: "line-height", value: 1.6, min: 0.5, max: 3, step: 0.1 },
        { property: "letter-spacing", value: 0.2, unit: "px", min: -5, max: 10, step: 0.5 },
      ],
      font: "Georgia",
    },
  ];

  const generateCSS = () => {
    return fontProperties
      .map(({ property, value, unit }) => `${property}: ${value}${unit || ''};`)
      .join('\n');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  const updateProperty = (index: number, newValue: string | number) => {
    const newProperties = [...fontProperties];
    newProperties[index].value = newValue;
    setFontProperties(newProperties);
  };

  const applyPreset = (preset: Preset) => {
    setFontProperties(preset.properties);
    setSelectedFont(preset.font);
  };

  const savePreset = () => {
    if (!presetName) return;

    const newPreset: Preset = {
      name: presetName,
      properties: fontProperties,
      font: selectedFont,
    };

    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    localStorage.setItem("typography-presets", JSON.stringify(updatedPresets));
    setPresetName("");
    setShowPresetDialog(false);
  };

  const resetToDefault = () => {
    setFontProperties([
      { property: "font-size", value: 16, unit: "px", min: 8, max: 72, step: 1 },
      { property: "font-weight", value: 400, min: 100, max: 900, step: 100 },
      { property: "line-height", value: 1.5, min: 0.5, max: 3, step: 0.1 },
      { property: "letter-spacing", value: 0, unit: "px", min: -5, max: 10, step: 0.5 },
      { property: "word-spacing", value: 0, unit: "px", min: -5, max: 20, step: 1 },
    ]);
    setSelectedFont("system-ui");
  };

  // 添加删除预设函数
  const deletePreset = (presetName: string) => {
    const updatedPresets = presets.filter(preset => preset.name !== presetName);
    setPresets(updatedPresets);
    localStorage.setItem("typography-presets", JSON.stringify(updatedPresets));
  };

  return (
    <div className="space-y-8">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-xl font-bold 
                    bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
                    dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 
                    bg-clip-text text-transparent">
          <Type className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
          排版工具
        </h3>

        <div className="flex gap-2">
          <button
            onClick={() => setShowPresetDialog(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                    bg-white dark:bg-gray-800 
                    border border-gray-200 dark:border-gray-700
                    hover:border-indigo-200 dark:hover:border-indigo-800
                    hover:bg-indigo-50 dark:hover:bg-indigo-900/20
                    text-sm font-medium text-gray-700 dark:text-gray-300
                    transition-all duration-200 group"
          >
            <Save className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            保存预设
          </button>
          <button
            onClick={resetToDefault}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                    bg-white dark:bg-gray-800 
                    border border-gray-200 dark:border-gray-700
                    hover:border-indigo-200 dark:hover:border-indigo-800
                    hover:bg-indigo-50 dark:hover:bg-indigo-900/20
                    text-sm font-medium text-gray-700 dark:text-gray-300
                    transition-all duration-200 group"
          >
            <RefreshCw className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            重置
          </button>
        </div>
      </div>

      {/* 预设列表 */}
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin 
                     scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600
                     scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
          {/* 内置预设 */}
          {presetStyles.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="flex-shrink-0 w-56 p-4 rounded-xl bg-white dark:bg-gray-800 
                      border border-gray-200 dark:border-gray-700
                      hover:border-indigo-200 dark:hover:border-indigo-800
                      hover:shadow-lg dark:hover:shadow-indigo-900/20
                      text-left transition-all duration-200"
            >
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {preset.name}
              </div>
              <p
                style={{
                  fontFamily: preset.font,
                  ...Object.fromEntries(
                    preset.properties.map(({ property, value, unit }) => [
                      property,
                      `${value}${unit || ''}`
                    ])
                  )
                }}
                className="text-gray-600 dark:text-gray-400 truncate"
              >
                {text}
              </p>
            </button>
          ))}

          {/* 自定义预设 */}
          {presets.map((preset) => (
            <div
              key={preset.name}
              className="flex-shrink-0 w-56 relative group"
            >
              <button
                onClick={() => applyPreset(preset)}
                className="w-full p-4 rounded-xl bg-white dark:bg-gray-800 
                        border border-gray-200 dark:border-gray-700
                        hover:border-indigo-200 dark:hover:border-indigo-800
                        hover:shadow-lg dark:hover:shadow-indigo-900/20
                        text-left transition-all duration-200"
              >
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {preset.name}
                </div>
                <p
                  style={{
                    fontFamily: preset.font,
                    ...Object.fromEntries(
                      preset.properties.map(({ property, value, unit }) => [
                        property,
                        `${value}${unit || ''}`
                      ])
                    )
                  }}
                  className="text-gray-600 dark:text-gray-400 truncate"
                >
                  {text}
                </p>
              </button>
              {/* 删除按钮 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deletePreset(preset.name);
                }}
                className="absolute -top-2 -right-2 
                        w-8 h-8 
                        rounded-xl
                        bg-white dark:bg-gray-800
                        border border-gray-200 dark:border-gray-700
                        hover:border-indigo-200 dark:hover:border-indigo-800
                        hover:bg-indigo-50 dark:hover:bg-indigo-900/20
                        text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400
                        opacity-0 group-hover:opacity-100
                        flex items-center justify-center
                        transform scale-75 group-hover:scale-100
                        shadow-sm hover:shadow-md
                        transition-all duration-200"
                title="删除预设"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 控制面板 */}
        <div className="space-y-6">
          {/* 字体选择 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 
                       border border-gray-200 dark:border-gray-700
                       shadow-sm">
            <label className="flex items-center gap-2 text-sm font-medium 
                          text-gray-700 dark:text-gray-300 mb-3">
              <Palette className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              字体系列
            </label>
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="w-full p-3 rounded-xl
                      border border-gray-200 dark:border-gray-700
                      bg-white dark:bg-gray-800 
                      text-gray-900 dark:text-gray-100
                      focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 
                      focus:border-transparent transition-all duration-200"
            >
              {commonFonts.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* 测试文本输入 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 
                       border border-gray-200 dark:border-gray-700
                       shadow-sm">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              测试文本
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 rounded-xl
                      border border-gray-200 dark:border-gray-700
                      bg-white dark:bg-gray-800 
                      text-gray-900 dark:text-gray-100
                      focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 
                      focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* 属性控制 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 
                       border border-gray-200 dark:border-gray-700
                       shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium 
                        text-gray-700 dark:text-gray-300 mb-4">
              <Settings className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              样式属性
            </div>
            <div className="space-y-6">
              {fontProperties.map((prop, index) => (
                <div key={prop.property}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {prop.property}
                    </label>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {prop.value}{prop.unit || ''}
                    </span>
                  </div>
                  <input
                    type="range"
                    value={prop.value}
                    onChange={(e) => updateProperty(index, Number(e.target.value))}
                    min={prop.min}
                    max={prop.max}
                    step={prop.step}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full
                           accent-indigo-500 dark:accent-indigo-400
                           cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 预览和代码区域 */}
        <div className="space-y-6">
          {/* 预览区域 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 
                       border border-gray-200 dark:border-gray-700
                       shadow-sm min-h-[200px]">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              预览效果
            </div>
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
              className="break-words text-gray-900 dark:text-gray-100"
            >
              {text}
            </p>
          </div>

          {/* CSS 代码 */}
          <div className="relative p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 
                       border border-gray-200 dark:border-gray-700
                       shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                CSS 代码
              </div>
              <button
                onClick={() => copyToClipboard(`font-family: ${selectedFont};\n${generateCSS()}`)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 
                       transition-colors group"
                title="复制 CSS"
              >
                <Copy className="w-4 h-4 text-gray-400 
                             group-hover:text-indigo-500 dark:group-hover:text-indigo-400" />
              </button>
            </div>
            <pre className="text-sm overflow-x-auto">
              <code className="text-gray-900 dark:text-gray-100">
                {`font-family: ${selectedFont};\n${generateCSS()}`}
              </code>
            </pre>
          </div>
        </div>
      </div>

      {/* 保存预设对话框 */}
      {showPresetDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm 
                     flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md
                       shadow-xl dark:shadow-indigo-900/30">
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              保存预设
            </h4>
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="输入预设名称"
              className="w-full p-3 rounded-xl mb-4
                      border border-gray-200 dark:border-gray-700
                      bg-white dark:bg-gray-800 
                      text-gray-900 dark:text-gray-100
                      focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 
                      focus:border-transparent transition-all duration-200"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPresetDialog(false)}
                className="px-4 py-2 rounded-lg
                        text-gray-700 dark:text-gray-300
                        hover:bg-gray-100 dark:hover:bg-gray-700
                        transition-colors"
              >
                取消
              </button>
              <button
                onClick={savePreset}
                className="px-4 py-2 rounded-lg
                        bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                        text-white shadow-sm
                        hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600
                        transition-colors"
                disabled={!presetName}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 复制成功提示 */}
      {showCopied && (
        <div className="fixed bottom-4 right-4 
                     bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                     text-white px-4 py-2 rounded-xl shadow-lg 
                     flex items-center gap-2 animate-fade-in-up">
          <AlertCircle className="w-4 h-4" />
          已复制到剪贴板
        </div>
      )}
    </div>
  );
};

export default TypographyTool; 