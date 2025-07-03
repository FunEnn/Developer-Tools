import React, { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import { Copy, Clock, Calendar } from "lucide-react";

// 注册插件
dayjs.extend(utc);
dayjs.extend(relativeTime); // 用于 fromNow() 方法

export const TimeConverter = () => {
  // 初始为当前时间
  const [dateTime, setDateTime] = useState(dayjs().format("YYYY-MM-DDTHH:mm:ss"));
  // 时间戳（毫秒）
  const [timestamp, setTimestamp] = useState(dayjs().valueOf().toString());
  const [showCopied, setShowCopied] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);

  // 日期时间选择器变动
  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateTime(value);
    const d = dayjs(value);
    if (d.isValid()) {
      setTimestamp(d.valueOf().toString());
      setInputError(null);
    } else {
      setInputError("日期时间格式错误");
    }
  };

  // 时间戳输入变动
  const handleTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, "");
    setTimestamp(value);
    let ts = value;
    if (ts.length === 10) ts = ts + "000";
    const d = dayjs(Number(ts));
    if (d.isValid() && (value.length === 13 || value.length === 10)) {
      setDateTime(d.format("YYYY-MM-DDTHH:mm:ss"));
      setInputError(null);
    } else {
      setInputError("时间戳格式错误");
    }
  };

  // 解析当前时间
  let parsedTime: dayjs.Dayjs = dayjs(dateTime);
  if (!parsedTime.isValid()) {
    // 尝试用时间戳解析
    let ts = timestamp;
    if (ts.length === 10) ts = ts + "000";
    parsedTime = dayjs(Number(ts));
  }

  const timeFormats = parsedTime.isValid()
    ? [
        {
          label: "时间戳（毫秒）",
          value: parsedTime.valueOf().toString(),
          icon: Clock,
        },
        {
          label: "时间戳（秒）",
          value: Math.floor(parsedTime.valueOf() / 1000).toString(),
          icon: Clock,
        },
        {
          label: "ISO 8601",
          value: parsedTime.toISOString(),
          icon: Calendar,
        },
        {
          label: "UTC 时间",
          value: parsedTime.utc().format("YYYY-MM-DD HH:mm:ss"),
          icon: Calendar,
        },
        {
          label: "本地时间",
          value: parsedTime.format("YYYY-MM-DD HH:mm:ss"),
          icon: Calendar,
        },
        {
          label: "相对时间",
          value: parsedTime.fromNow(),
          icon: Clock,
        },
      ]
    : [];

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
    <div className="space-y-8">
      {/* 日期时间选择器部分 */}
      <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          选择日期时间
        </label>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={handleDateTimeChange}
          className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600 focus:border-transparent transition-all duration-200"
        />
      </div>
      {/* 时间戳输入部分 */}
      <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          输入时间戳（10位或13位）
        </label>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={timestamp}
          onChange={handleTimestampChange}
          placeholder="如 1714545600000 或 1714545600"
          className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600 focus:border-transparent transition-all duration-200"
        />
      </div>
      {/* 错误提示 */}
      {inputError && (
        <div className="text-xs text-red-500">{inputError}</div>
      )}
      {/* 结果展示区 */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
          时间格式
        </h2>
        <div className="grid gap-3">
          {timeFormats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-200"
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
                  className="p-1.5 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors group"
                  title="复制"
                >
                  <Copy className="h-4 w-4 text-gray-400 group-hover:text-violet-500 dark:group-hover:text-violet-400" />
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
