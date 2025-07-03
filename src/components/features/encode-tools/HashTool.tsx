import { useState } from "react";
import CryptoJS from "crypto-js";

const hashTypes = [
  { label: "MD5", value: "md5" },
  { label: "SHA-1", value: "sha1" },
  { label: "SHA-256", value: "sha256" },
  { label: "SHA-512", value: "sha512" },
  { label: "SHA-3", value: "sha3" },
  { label: "RIPEMD160", value: "ripemd160" },
];

export const HashTool = () => {
  const [input, setInput] = useState("");
  const [selectedHash, setSelectedHash] = useState("md5");
  const [hash, setHash] = useState<String | null>(null);

  const calculateHash = () => {
    let hashValue = "";
    switch (selectedHash) {
      case "md5":
        hashValue = CryptoJS.MD5(input).toString();
        break;
      case "sha1":
        hashValue = CryptoJS.SHA1(input).toString();
        break;
      case "sha256":
        hashValue = CryptoJS.SHA256(input).toString();
        break;
      case "sha512":
        hashValue = CryptoJS.SHA512(input).toString();
        break;
      case "sha3":
        hashValue = CryptoJS.SHA3(input).toString();
        break;
      case "ripemd160":
        hashValue = CryptoJS.RIPEMD160(input).toString();
        break;
    }
    setHash(hashValue);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          选择哈希算法
        </label>
        <div className="flex flex-wrap gap-2">
          {hashTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedHash(type.value)}
              className={`px-4 py-2 rounded-xl transition-all duration-200 shadow-sm
                ${selectedHash === type.value
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          输入文本
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 p-3 rounded-xl
                   border border-gray-300 dark:border-gray-700
                   bg-white dark:bg-gray-800
                   text-gray-900 dark:text-gray-100
                   placeholder-gray-400 dark:placeholder-gray-500
                   focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-600
                   shadow-sm transition-all duration-200"
          placeholder="输入要计算哈希值的文本..."
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={calculateHash}
          className="px-6 py-2.5 rounded-xl bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-all duration-200"
        >
          计算哈希
        </button>
        <button
          onClick={async () => {
            if (hash) {
              await navigator.clipboard.writeText(hash.toString());
            }
          }}
          disabled={!hash}
          className="px-6 py-2.5 rounded-xl bg-blue-500 text-white shadow-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          复制结果
        </button>
      </div>

      {hash && (
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {hashTypes.find((t) => t.value === selectedHash)?.label} 哈希值
          </h3>
          <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-sm transition-all duration-200">
            <pre className="overflow-auto break-all text-sm text-gray-800 dark:text-gray-200">
              {hash}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default HashTool;
