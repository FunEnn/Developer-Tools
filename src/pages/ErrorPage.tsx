import { useRouteError } from "react-router-dom";

interface RouterError {
  statusText?: string;
  message?: string;
  status?: number;
}

export const ErrorPage = () => {
  const error = useRouteError() as RouterError;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">Oops!</h1>
      <p className="text-xl mb-4">抱歉，发生了一些错误。</p>
      <p className="text-gray-600 mb-2">
        {error.statusText || error.message || "未知错误"}
      </p>
      {error.status && (
        <p className="text-sm text-gray-500">
          状态码: {error.status}
        </p>
      )}
    </div>
  );
};

export default ErrorPage;
