import React, { useState } from "react";
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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          选择哈希算法
        </label>
        <select
          value={selectedHash}
          onChange={(e) => setSelectedHash(e.target.value)}
          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        >
          {hashTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          输入文本
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          placeholder="输入要计算哈希值的文本..."
        />
      </div>

      <button
        onClick={calculateHash}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        计算哈希
      </button>

      {hash && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">
            {hashTypes.find((t) => t.value === selectedHash)?.label} 哈希值
          </h3>
          <pre className="p-3 bg-gray-50 rounded-md dark:bg-gray-700/50 overflow-auto break-all">
            {hash}
          </pre>
        </div>
      )}
    </div>
  );
};

export default HashTool;
