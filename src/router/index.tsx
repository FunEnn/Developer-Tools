import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { DevTools } from "@/pages/DevTools";
import { ErrorPage } from "@/pages/ErrorPage";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Skeleton } from '@/components/ui/Skeleton';
import PixivPage from "@/pages/PixivPage";

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
export const DataVisualization = React.lazy(
  () => import("../components/features/data-visualization/DataVisualization")
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
  BarChart,
} from "lucide-react";

export const tools = [
  {
    category: "编码转换",
    items: [
      {
        id: "base64",
        label: "Base64",
        icon: Binary,
        component: Base64Tool,
        description: "快速进行Base64编码和解码转换",
      },
      {
        id: "jwt",
        label: "JWT解析",
        icon: KeyRound,
        component: JwtTool,
        description: "解析和验证JWT令牌，查看Payload内容",
      },
      {
        id: "hash",
        label: "哈希计算",
        icon: Hash,
        component: HashTool,
        description: "计算文本的MD5、SHA1、SHA256等哈希值",
      },
    ],
  },
  {
    category: "开发工具",
    items: [
      {
        id: "json",
        label: "JSON工具",
        icon: FileJson,
        component: JsonEditor,
        description: "JSON格式化、压缩、验证和转换",
      },
      {
        id: "regex",
        label: "正则测试",
        icon: Regex,
        component: RegexTester,
        description: "正则表达式在线测试和验证工具",
      },
      {
        id: "format",
        label: "代码格式化",
        icon: Code2,
        component: CodeFormatter,
        description: "支持多种语言的代码格式化工具",
      },
      {
        id: "qrcode",
        label: "二维码工具",
        icon: QrCode,
        component: QrCodeTool,
        description: "生成和解析二维码，支持自定义样式",
      },
      {
        id: "markdown",
        label: "Markdown编辑器",
        icon: FileText,
        component: MarkdownEditor,
        description: "所见即所得的Markdown编辑和预览",
      },
      {
        id: "data-visualization",
        label: "数据可视化",
        icon: BarChart,
        component: DataVisualization,
        description: "数据图表生成工具",
      },
    ],
  },
  {
    category: "样式工具",
    items: [
      {
        id: "color",
        label: "颜色工具",
        icon: Palette,
        component: ColorPicker,
        description: "颜色选择、转换和调色板生成",
      },
      {
        id: "time",
        label: "时间转换",
        icon: Timer,
        component:TimeConverter,
        description: "时间戳转换、格式化和时区转换",
      },
      {
        id: "typography",
        label: "字体工具",
        icon: Type,
        component: TypographyTool,
        description: "字体预览、单位转换和文本处理",
      },
      {
        id: "emoji",
        label: "表情工具",
        icon: Smile,
        component: EmojiPicker,
        description: "表情符号搜索和复制工具",
      },
    ],
  },
  {
    category: "图像工具",
    items: [
      {
        id: "pixiv",
        label: "Pixiv图片",
        icon: Image,
        component: PixivPage,
        description: "随机获取 Pixiv 图片，支持多种筛选条件",
      },
      {
        id: "image-convert",
        label: "图片转换",
        icon: Image,
        component: ImageConverter,
        description: "图片格式转换，支持常见图片格式",
      },
      {
        id: "image-compress",
        label: "图片压缩",
        icon: Image,
        component: ImageCompressor,
        description: "在线图片压缩，保持最佳质量",
      },
      {
        id: "svg-editor",
        label: "SVG编辑",
        icon: Image,
        component: SvgEditor,
        description: "SVG在线编辑和优化工具",
      },
    ],
  },
];

// 创建路由配置
export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Skeleton />}>
        <ToolLayout>
          <DevTools tools={tools} />
        </ToolLayout>
      </Suspense>
    ),
    errorElement: <ErrorPage />,
  },
  ...tools.flatMap((category) =>
    category.items.map((tool) => ({
      path: `/tools/${tool.id}`,
      element: (
        <Suspense fallback={<Skeleton />}>
          <ToolLayout>
            <tool.component />
          </ToolLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    }))
  ),
]);
