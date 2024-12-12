import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Copy,
  Download,
  Upload,
  Bold,
  Italic,
  Link as LinkIcon,
  Image,
  List,
  ListOrdered,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Table,
  CheckSquare,
  AlertTriangle,
} from "lucide-react";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState(
    "# Hello Markdown\n\n开始编写你的文档..."
  );
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  const toolbarButtons = [
    { icon: Heading1, text: "# ", title: "一级标题" },
    { icon: Heading2, text: "## ", title: "二级标题" },
    { icon: Heading3, text: "### ", title: "三级标题" },
    { icon: Bold, text: "**粗体**", title: "粗体" },
    { icon: Italic, text: "*斜体*", title: "斜体" },
    { icon: Code, text: "`代码`", title: "行内代码" },
    { icon: Quote, text: "> 引用\n", title: "引用" },
    { icon: LinkIcon, text: "[链接](url)", title: "链接" },
    { icon: Image, text: "![图片](url)", title: "图片" },
    { icon: List, text: "- 列表项\n", title: "无序列表" },
    { icon: ListOrdered, text: "1. 列表项\n", title: "有序列表" },
    { icon: CheckSquare, text: "- [ ] 任务\n", title: "任务列表" },
    {
      icon: Table,
      text: "| 列1 | 列2 |\n|------|------|\n| 内容1 | 内容2 |",
      title: "表格",
    },
    { icon: AlertTriangle, text: "```\n代码块\n```", title: "代码块" },
  ];

  const insertText = (template: string) => {
    const textarea = document.querySelector("textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end);
    const selectedText = text.substring(start, end);

    let newText = template;
    if (selectedText) {
      if (template === "**粗体**") {
        newText = `**${selectedText}**`;
      } else if (template === "*斜体*") {
        newText = `*${selectedText}*`;
      } else if (template === "[链接](url)") {
        newText = `[${selectedText}](url)`;
      } else if (template === "`代码`") {
        newText = `\`${selectedText}\``;
      } else if (template.startsWith("```")) {
        newText = `\`\`\`\n${selectedText}\n\`\`\``;
      }
    }

    setMarkdown(`${before}${newText}${after}`);
    textarea.focus();

    const newCursorPos = template.includes("url")
      ? start + newText.indexOf("url")
      : start + newText.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setMarkdown(e.target?.result as string);
    };
    reader.readAsText(file);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "b":
          e.preventDefault();
          insertText("**粗体**");
          break;
        case "i":
          e.preventDefault();
          insertText("*斜体*");
          break;
        case "k":
          e.preventDefault();
          insertText("[链接](url)");
          break;
      }
    }
  };

  React.useEffect(() => {
    const savedContent = localStorage.getItem("markdown-content");
    if (savedContent) {
      setMarkdown(savedContent);
    }

    const autoSave = setInterval(() => {
      localStorage.setItem("markdown-content", markdown);
    }, 30000);

    return () => clearInterval(autoSave);
  }, [markdown]);

  const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    for (const file of imageFiles) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        insertText(`![${file.name}](${imageUrl})`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = Array.from(e.clipboardData.items);
    const imageItems = items.filter((item) => item.type.startsWith("image/"));

    for (const item of imageItems) {
      const file = item.getAsFile();
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const imageUrl = reader.result as string;
          insertText(`![粘贴的图片](${imageUrl})`);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">Markdown 编辑器</h2>
        <div className="flex gap-2">
          <label className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer">
            <Upload className="w-5 h-5" />
            <input
              type="file"
              accept=".md,.markdown"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <button
            onClick={downloadMarkdown}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            title="下载 Markdown"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={copyToClipboard}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            title="复制内容"
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b dark:border-gray-700">
        {(["write", "preview"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab
                ? "border-blue-500 text-blue-500"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {tab === "write" ? "编辑" : "预览"}
          </button>
        ))}
      </div>

      {activeTab === "write" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-t-lg border-b dark:border-gray-700">
            {toolbarButtons.map(({ icon: Icon, text, title }) => (
              <button
                key={text}
                onClick={() => insertText(text)}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded tooltip"
                title={title}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            onKeyDown={handleKeyDown}
            onDrop={handleDrop}
            onPaste={handlePaste}
            className="w-full h-[600px] p-4 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100 font-mono"
            placeholder="输入 Markdown 内容..."
          />
        </div>
      )}

      {activeTab === "preview" && (
        <div className="prose dark:prose-invert max-w-none p-4 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg min-h-[600px]">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;
