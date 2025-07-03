import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Copy,
  Download,
  Upload,
  Eye,
  Edit3,
  EyeOff,
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

export const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "document.md";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === "string") {
        setMarkdown(content);
      }
    };
    reader.readAsText(file);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
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
        case "enter":
          e.preventDefault();
          setIsPreview(!isPreview);
          break;
        case "s":
          e.preventDefault();
          localStorage.setItem("markdown-content", markdown);
          // 可以添加保存成功提示
          break;
      }
    }
  };

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

  const shortcuts = [
    { key: "Ctrl + B", desc: "加粗" },
    { key: "Ctrl + I", desc: "斜体" },
    { key: "Ctrl + K", desc: "链接" },
    { key: "Ctrl + Enter", desc: "预览/编辑切换" },
    { key: "Ctrl + S", desc: "保存" },
  ];

  const toolbarGroups = [
    {
      title: "标题",
      buttons: toolbarButtons.slice(0, 3),
    },
    {
      title: "格式",
      buttons: toolbarButtons.slice(3, 6),
    },
    {
      title: "插入",
      buttons: toolbarButtons.slice(6, 9),
    },
    {
      title: "列表",
      buttons: toolbarButtons.slice(9, 12),
    },
    {
      title: "其他",
      buttons: toolbarButtons.slice(12),
    },
  ];


  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                   bg-white dark:bg-gray-800 
                   border border-gray-200 dark:border-gray-700
                   hover:border-violet-200 dark:hover:border-violet-800
                   text-sm font-medium text-gray-700 dark:text-gray-300
                   transition-all duration-200 group"
          >
            {isPreview ? (
              <>
                <Edit3 className="w-4 h-4 text-violet-500 dark:text-violet-400" />
                编辑模式
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-violet-500 dark:text-violet-400" />
                预览模式
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                        bg-white dark:bg-gray-800 
                        border border-gray-200 dark:border-gray-700
                        hover:border-violet-200 dark:hover:border-violet-800
                        text-sm font-medium text-gray-700 dark:text-gray-300
                        cursor-pointer transition-all duration-200 group">
            <Upload className="w-4 h-4 text-violet-500 dark:text-violet-400" />
            导入
            <input
              type="file"
              accept=".md,.markdown"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={downloadMarkdown}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                   bg-white dark:bg-gray-800 
                   border border-gray-200 dark:border-gray-700
                   hover:border-violet-200 dark:hover:border-violet-800
                   text-sm font-medium text-gray-700 dark:text-gray-300
                   transition-all duration-200 group"
            disabled={!markdown}
          >
            <Download className="w-4 h-4 text-violet-500 dark:text-violet-400" />
            导出
          </button>

          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                   bg-white dark:bg-gray-800 
                   border border-gray-200 dark:border-gray-700
                   hover:border-violet-200 dark:hover:border-violet-800
                   text-sm font-medium text-gray-700 dark:text-gray-300
                   transition-all duration-200 group"
            disabled={!markdown}
          >
            <Copy className="w-4 h-4 text-violet-500 dark:text-violet-400" />
            {showCopied ? "已复制" : "复制"}
          </button>
        </div>
      </div>

      {/* 格式工具栏 */}
      <div className="flex flex-wrap gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl
                   border border-gray-200 dark:border-gray-700">
        {toolbarGroups.map((group) => (
          <div key={group.title} className="space-y-2">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {group.title}
            </div>
            <div className="flex gap-1">
              {group.buttons.map(({ icon: Icon, text, title }) => (
                <button
                  key={title}
                  onClick={() => insertText(text)}
                  className="p-1.5 rounded-lg
                         hover:bg-violet-50 dark:hover:bg-violet-900/20
                         text-gray-600 dark:text-gray-400
                         hover:text-violet-500 dark:hover:text-violet-400
                         transition-colors group"
                  title={title}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 编辑器区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-16rem)]">
        {/* 编辑器 */}
        {!isPreview && (
          <div className="h-full">
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              onKeyDown={handleKeyDown}
              onDrop={handleDrop}
              onPaste={handlePaste}
              placeholder="在此输入 Markdown 文本..."
              className="w-full h-full p-4 rounded-xl
                      border border-gray-200 dark:border-gray-700
                      bg-white dark:bg-gray-800 
                      text-gray-900 dark:text-gray-100
                      focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600 
                      focus:border-transparent transition-all duration-200
                      font-mono text-sm resize-none"
            />
          </div>
        )}

        {/* 预览区域 */}
        {(isPreview || window.innerWidth >= 1024) && (
          <div
            className="h-full p-4 rounded-xl overflow-auto
                     border border-gray-200 dark:border-gray-700
                     bg-white dark:bg-gray-800"
          >
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{markdown || "预览区域"}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* 快捷键提示 */}
      <div className="fixed bottom-4 right-4 p-4 bg-white dark:bg-gray-800 
                   rounded-xl shadow-lg border border-gray-200 dark:border-gray-700
                   transform translate-y-full opacity-0 hover:translate-y-0 hover:opacity-100
                   transition-all duration-200">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          快捷键
        </div>
        <div className="space-y-1">
          {shortcuts.map(({ key, desc }) => (
            <div
              key={key}
              className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"
            >
              <kbd className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 font-mono">
                {key}
              </kbd>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
