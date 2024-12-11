import React, { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import { Copy } from "lucide-react";

// 注册插件
dayjs.extend(utc);
dayjs.extend(relativeTime); // 用于 fromNow() 方法

export const TimeConverter = () => {
  const [inputTime, setInputTime] = useState(
    dayjs().format("YYYY-MM-DD HH:mm:ss")
  );
  const timestamp = dayjs(inputTime).valueOf();

  const timeFormats = [
    {
      label: "时间戳（毫秒）",
      value: timestamp.toString(),
    },
    {
      label: "时间戳（秒）",
      value: Math.floor(timestamp / 1000).toString(),
    },
    {
      label: "ISO 8601",
      value: dayjs(inputTime).toISOString(),
    },
    {
      label: "UTC 时间",
      value: dayjs(inputTime).utc().format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      label: "本地时间",
      value: dayjs(inputTime).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      label: "相对时间",
      value: dayjs(inputTime).fromNow(),
    },
  ];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          输入时间
        </label>
        <input
          type="datetime-local"
          value={inputTime}
          onChange={(e) => setInputTime(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          时间格式
        </h2>
        <div className="grid gap-4">
          {timeFormats.map(({ label, value }) => (
            <div
              key={label}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {label}
                </span>
                <button
                  onClick={() => copyToClipboard(value)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="复制"
                >
                  <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              <div className="font-mono text-sm text-gray-900 dark:text-gray-100 break-all">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeConverter;
