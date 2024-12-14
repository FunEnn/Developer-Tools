import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { DevTools } from "@/pages/DevTools";
import { ErrorPage } from "@/pages/ErrorPage";
import { ToolLayout } from "@/components/layout/ToolLayout";
export const JsonEditor = React.lazy(
  () => import("../components/features/json-editor/JsonEditor")
);
export const RegexTester = React.lazy(
  () => import("../components/features/regex-tester/RegexTester")
);
export const ColorPicker = React.lazy(
  () => import("../components/features/color-picker/ColorPicker")
);
export const Base64Tool = React.lazy(
  () => import("../components/features/base64-tool/Base64Tool")
);
export const TimeConverter = React.lazy(
  () => import("../components/features/time-converter/TimeConverter")
);
export const JwtTool = React.lazy(
  () => import("../components/features/jwt-tool/JwtTool")
);
export const HashTool = React.lazy(
  () => import("../components/features/hash-tool/HashTool")
);
export const CodeFormatter = React.lazy(
  () => import("../components/features/code-formatter/CodeFormatter")
);
export const ImageConverter = React.lazy(
  () => import("../components/features/image-tools/ImageConverter")
);
export const ImageCompressor = React.lazy(
  () => import("../components/features/image-tools/ImageCompressor")
);
export const SvgEditor = React.lazy(
  () => import("../components/features/image-tools/SvgEditor")
);
export const QrCodeTool = React.lazy(
  () => import("../components/features/qrcode-tool/QrCodeTool")
);
export const MarkdownEditor = React.lazy(
  () => import("../components/features/markdown-editor/MarkdownEditor")
);
export const TypographyTool = React.lazy(
  () => import("../components/features/style-tools/TypographyTool")
);
export const EmojiPicker = React.lazy(
  () => import("../components/features/emoji-tools/EmojiPicker")
);
export const AiChatbot = React.lazy(
  () => import("../components/features/ai-chat/AiChatbot")
);
import {
  Code2,
  FileJson,
  Regex,
  Palette,
  KeyRound,
  Hash,
  Timer,
  Binary,
  Image,
  QrCode,
  Type,
  FileText,
  Smile,
  Bot,
} from "lucide-react";

export const tools = [
  {
    category: "AI工具",
    items: [
      {
        id: "ai-chat",
        label: "AI助手",
        icon: Bot,
        component: AiChatbot,
      },
    ],
  },
  {
    category: "编码转换",
    items: [
      { id: "base64", label: "Base64", icon: Binary, component: Base64Tool },
      {
        id: "jwt",
        label: "JWT解析",
        icon: KeyRound,
        component: JwtTool,
      },
      {
        id: "hash",
        label: "哈希计算",
        icon: Hash,
        component: HashTool,
      },
    ],
  },
  {
    category: "开发工具",
    items: [
      { id: "json", label: "JSON工具", icon: FileJson, component: JsonEditor },
      { id: "regex", label: "正则测试", icon: Regex, component: RegexTester },
      {
        id: "format",
        label: "代码格式化",
        icon: Code2,
        component: CodeFormatter,
      },
      {
        id: "qrcode",
        label: "二维码工具",
        icon: QrCode,
        component: QrCodeTool,
      },
      {
        id: "markdown",
        label: "Markdown编辑器",
        icon: FileText,
        component: MarkdownEditor,
      },
    ],
  },
  {
    category: "样式工具",
    items: [
      { id: "color", label: "颜色工具", icon: Palette, component: ColorPicker },
      {
        id: "time",
        label: "时间转换",
        icon: Timer,
        component: TimeConverter,
      },
      {
        id: "typography",
        label: "字体工具",
        icon: Type,
        component: TypographyTool,
      },
      {
        id: "emoji",
        label: "表情工具",
        icon: Smile,
        component: EmojiPicker,
      },
    ],
  },
  {
    category: "图像工具",
    items: [
      {
        id: "image-convert",
        label: "图片转换",
        icon: Image,
        component: ImageConverter,
      },
      {
        id: "image-compress",
        label: "图片压缩",
        icon: Image,
        component: ImageCompressor,
      },
      { id: "svg-editor", label: "SVG编辑", icon: Image, component: SvgEditor },
    ],
  },
];

// 创建路由配置
export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ToolLayout>
        <DevTools tools={tools} />
      </ToolLayout>
    ),
    errorElement: <ErrorPage />,
  },
  ...tools.flatMap((category) =>
    category.items.map((tool) => ({
      path: `/tools/${tool.id}`,
      element: (
        <ToolLayout>
          <tool.component />
        </ToolLayout>
      ),
      errorElement: <ErrorPage />,
    }))
  ),
]);
