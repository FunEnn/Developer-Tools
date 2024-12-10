import React, { useState } from "react";

export const ColorPicker = () => {
  const [color1, setColor1] = useState("#000000");
  const [color2, setColor2] = useState("#ffffff");
  const [gradient, setGradient] = useState(
    `linear-gradient(to right, ${color1}, ${color2})`
  );

  const handleColorChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setColor: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const newColor = e.target.value;
    setColor(newColor);
    setGradient(`linear-gradient(to right, ${color1}, ${color2})`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            选择颜色 1
          </label>
          <input
            type="color"
            value={color1}
            onChange={(e) => handleColorChange(e, setColor1)}
            className="w-full h-40 rounded-lg cursor-pointer"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            选择颜色 2
          </label>
          <input
            type="color"
            value={color2}
            onChange={(e) => handleColorChange(e, setColor2)}
            className="w-full h-40 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          渐变预览
        </label>
        <div
          className="w-full h-32 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-200"
          style={{ background: gradient }}
        />
      </div>
      <div className="mt-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">CSS:</span>
          <code className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-sm flex-1">
            background: {gradient};
          </code>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
