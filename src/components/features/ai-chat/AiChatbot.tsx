import { useState } from "react";
import { Bot, Send, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const AiChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ message: input })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || '服务暂时不可用');
      }

      const data = await response.json();
      const content = typeof data.message === 'string' ? data.message : 
                     typeof data.message === 'object' ? JSON.stringify(data.message) : 
                     '收到无效响应';
                     
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content }
      ]);
    } catch (error: any) {
      console.error("Error:", error);
      setError(error.message || '服务暂时不可用，请稍后再试');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '抱歉，我遇到了一些问题。请稍后再试。' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-end gap-3 ${
              message.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div className={`relative w-10 h-10 rounded-2xl flex items-center justify-center shadow-md
                          ${message.role === "user" 
                            ? "bg-gradient-to-br from-pink-400 via-purple-400 to-violet-400 hover:from-pink-500 hover:via-purple-500 hover:to-violet-500" 
                            : "bg-gradient-to-br from-violet-400 via-indigo-400 to-blue-400 hover:from-violet-500 hover:via-indigo-500 hover:to-blue-500"}`}>
              {message.role === "user" ? (
                <User className="w-6 h-6 text-white drop-shadow-md" />
              ) : (
                <Bot className="w-6 h-6 text-white drop-shadow-md" />
              )}
              <div className="absolute -bottom-1 w-6 h-6 bg-inherit transform rotate-45 -z-10 rounded-sm" />
            </div>
            <div
              className={`p-4 rounded-2xl max-w-[80%] shadow-md backdrop-blur-sm
                         ${message.role === "user"
                           ? "bg-gradient-to-br from-pink-400 via-purple-400 to-violet-400 hover:from-pink-500 hover:via-purple-500 hover:to-violet-500 text-white"
                           : "bg-white/80 dark:bg-gray-800/80 border border-gray-100/50 dark:border-gray-700/50 hover:border-violet-200 dark:hover:border-violet-700"}`}
            >
              <ReactMarkdown
                className="prose dark:prose-invert max-w-none
                          prose-p:leading-relaxed prose-p:my-0
                          prose-pre:my-0
                          prose-code:text-pink-500 dark:prose-code:text-pink-400
                          prose-headings:my-2
                          prose-ul:my-2 prose-ol:my-2
                          prose-li:my-0"
                components={{
                  code({className, children, ...props}: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-xl !my-3 !bg-gray-900/90 border border-gray-700/50 shadow-lg"
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={`${className} px-2 py-0.5 rounded-md 
                                     bg-gray-100/80 dark:bg-gray-700/80 
                                     border border-gray-200/50 dark:border-gray-600/50`} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-400 via-indigo-400 to-blue-400 
                          shadow-md flex items-center justify-center">
              <Bot className="w-6 h-6 text-white drop-shadow-md animate-pulse" />
            </div>
            <div className="text-gray-600 dark:text-gray-300 animate-pulse font-medium">
              AI正在思考...
            </div>
          </div>
        )}
        {error && (
          <div className="text-red-500 dark:text-red-400 text-sm mt-2 font-medium">
            {error}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm bg-white/50 dark:bg-gray-800/50">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入你的问题..."
            className="flex-1 px-5 py-3 rounded-2xl
                     border border-gray-200 dark:border-gray-700
                     bg-white dark:bg-gray-800
                     text-gray-900 dark:text-gray-100
                     placeholder-gray-400 dark:placeholder-gray-500
                     focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600 focus:border-transparent
                     shadow-md
                     transition-all duration-200"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-400 via-purple-400 to-violet-400 
                     text-white disabled:opacity-50 disabled:cursor-not-allowed
                     hover:from-pink-500 hover:via-purple-500 hover:to-violet-500
                     shadow-md
                     transition-all duration-300 ease-out"
          >
            <Send className="w-6 h-6 drop-shadow-md" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AiChatbot;
