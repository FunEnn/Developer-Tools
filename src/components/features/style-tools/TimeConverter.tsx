import React, { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import { Copy, Clock, Calendar } from "lucide-react";

// 注册插件
dayjs.extend(utc);
dayjs.extend(relativeTime); // 用于 fromNow() 方法

export const TimeConverter = () => {
  const [inputTime, setInputTime] = useState(
    dayjs().format("YYYY-MM-DD HH:mm:ss")
  );
  const [showCopied, setShowCopied] = useState<string | null>(null);
  const timestamp = dayjs(inputTime).valueOf();

  const timeFormats = [
    {
      label: "时间戳（毫秒）",
      value: timestamp.toString(),
      icon: Clock,
    },
    {
      label: "时间戳（秒）",
      value: Math.floor(timestamp / 1000).toString(),
      icon: Clock,
    },
    {
      label: "ISO 8601",
      value: dayjs(inputTime).toISOString(),
      icon: Calendar,
    },
    {
      label: "UTC 时间",
      value: dayjs(inputTime).utc().format("YYYY-MM-DD HH:mm:ss"),
      icon: Calendar,
    },
    {
      label: "本地时间",
      value: dayjs(inputTime).format("YYYY-MM-DD HH:mm:ss"),
      icon: Calendar,
    },
    {
      label: "相对时间",
      value: dayjs(inputTime).fromNow(),
      icon: Clock,
    },
  ];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopied(text);
      setTimeout(() => setShowCopied(null), 2000);
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
          className="w-full px-4 py-2 rounded-xl
                  border border-gray-200 dark:border-gray-700
                  bg-white dark:bg-gray-800 
                  text-gray-900 dark:text-gray-100
                  focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600 
                  focus:border-transparent transition-all duration-200"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 
                    dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
          时间格式
        </h2>
        <div className="grid gap-3">
          {timeFormats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="p-4 rounded-xl bg-white dark:bg-gray-800 
                      border border-gray-200 dark:border-gray-700
                      hover:border-violet-200 dark:hover:border-violet-800
                      transition-all duration-200"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-violet-500 dark:text-violet-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(value)}
                  className="p-1.5 rounded-lg
                         hover:bg-violet-50 dark:hover:bg-violet-900/20 
                         transition-colors group"
                  title="复制"
                >
                  <Copy className="h-4 w-4 text-gray-400 
                               group-hover:text-violet-500 dark:group-hover:text-violet-400" />
                </button>
              </div>
              <div className="font-mono text-sm text-gray-900 dark:text-gray-100 break-all">
                {value}
              </div>
              {showCopied === value && (
                <div className="mt-2 text-xs text-violet-500 dark:text-violet-400">
                  已复制到剪贴板
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeConverter;
