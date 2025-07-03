import React, { useState } from "react";

interface JwtParts {
  header: any;
  payload: any;
  signature: string;
}

export const JwtTool = () => {
  const [jwt, setJwt] = useState("");
  const [decoded, setDecoded] = useState<JwtParts | null>(null);
  const [error, setError] = useState<string | null>(null);

  const decodeJwt = () => {
    try {
      const parts = jwt.split(".");
      if (parts.length !== 3) {
        throw new Error("无效的 JWT 格式");
      }

      const decoded: JwtParts = {
        header: JSON.parse(atob(parts[0])),
        payload: JSON.parse(atob(parts[1])),
        signature: parts[2],
      };

      setDecoded(decoded);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "解析失败");
      setDecoded(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          JWT Token
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={jwt}
            onChange={(e) => setJwt(e.target.value)}
            className="flex-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            placeholder="输入 JWT token..."
          />
          <button
            onClick={decodeJwt}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            解析
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      {decoded && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium mb-3 text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Header
              </h3>
              <pre className="text-sm bg-gray-50 dark:bg-gray-900/50 rounded-md p-4 overflow-auto max-h-[300px]">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium mb-3 text-green-600 dark:text-green-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Payload
              </h3>
              <pre className="text-sm bg-gray-50 dark:bg-gray-900/50 rounded-md p-4 overflow-auto max-h-[300px]">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium mb-3 text-purple-600 dark:text-purple-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Signature
              </h3>
              <pre className="text-sm bg-gray-50 dark:bg-gray-900/50 rounded-md p-4 overflow-auto max-h-[300px] break-all">
                {decoded.signature}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JwtTool;
