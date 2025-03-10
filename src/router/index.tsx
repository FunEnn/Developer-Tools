import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { DevTools } from "@/pages/DevTools";
import { ErrorPage } from "@/pages/ErrorPage";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Skeleton } from '@/components/ui/Skeleton';

// 基础路径配置
const FEATURE_PATH = "../components/features";

// 工具组件懒加载配置
const TOOL_COMPONENTS = {
  JsonEditor: () => import(/* @vite-ignore */ `${FEATURE_PATH}/json-editor/JsonEditor`),
  RegexTester: () => import(/* @vite-ignore */ `${FEATURE_PATH}/regex-tester/RegexTester`),
  ColorPicker: () => import(/* @vite-ignore */ `${FEATURE_PATH}/color-picker/ColorPicker`),
  Base64Tool: () => import(/* @vite-ignore */ `${FEATURE_PATH}/base64-tool/Base64Tool`),
  TimeConverter: () => import(/* @vite-ignore */ `${FEATURE_PATH}/time-converter/TimeConverter`),
  JwtTool: () => import(/* @vite-ignore */ `${FEATURE_PATH}/jwt-tool/JwtTool`),
  HashTool: () => import(/* @vite-ignore */ `${FEATURE_PATH}/hash-tool/HashTool`),
  CodeFormatter: () => import(/* @vite-ignore */ `${FEATURE_PATH}/code-formatter/CodeFormatter`),
  ImageConverter: () => import(/* @vite-ignore */ `${FEATURE_PATH}/image-tools/ImageConverter`),
  ImageCompressor: () => import(/* @vite-ignore */ `${FEATURE_PATH}/image-tools/ImageCompressor`),
  SvgEditor: () => import(/* @vite-ignore */ `${FEATURE_PATH}/image-tools/SvgEditor`),
  QrCodeTool: () => import(/* @vite-ignore */ `${FEATURE_PATH}/qrcode-tool/QrCodeTool`),
  MarkdownEditor: () => import(/* @vite-ignore */ `${FEATURE_PATH}/markdown-editor/MarkdownEditor`),
  TypographyTool: () => import(/* @vite-ignore */ `${FEATURE_PATH}/style-tools/TypographyTool`),
  EmojiPicker: () => import(/* @vite-ignore */ `${FEATURE_PATH}/emoji-tools/EmojiPicker`),
  AiChatbot: () => import(/* @vite-ignore */ `${FEATURE_PATH}/ai-chat/AiChatbot`),
  DataVisualization: () => import(/* @vite-ignore */ `${FEATURE_PATH}/data-visualization/DataVisualization`),
} as const;

// 创建懒加载组件
const lazyComponents = Object.entries(TOOL_COMPONENTS).reduce((acc, [key, importFn]) => {
  acc[key as keyof typeof TOOL_COMPONENTS] = React.lazy(importFn);
  return acc;
}, {} as Record<keyof typeof TOOL_COMPONENTS, React.LazyExoticComponent<any>>);

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
  BarChart,
} from "lucide-react";

export const tools = [
  {
    category: "AI工具",
    items: [
      {
        id: "ai-chat",
        label: "AI助手",
        icon: Bot,
        component: lazyComponents.AiChatbot,
        description: "智能对话助手，支持多种场景的问答和交互",
      },
    ],
  },
  {
    category: "编码转换",
    items: [
      {
        id: "base64",
        label: "Base64",
        icon: Binary,
        component: lazyComponents.Base64Tool,
        description: "快速进行Base64编码和解码转换",
      },
      {
        id: "jwt",
        label: "JWT解析",
        icon: KeyRound,
        component: lazyComponents.JwtTool,
        description: "解析和验证JWT令牌，查看Payload内容",
      },
      {
        id: "hash",
        label: "哈希计算",
        icon: Hash,
        component: lazyComponents.HashTool,
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
        component: lazyComponents.JsonEditor,
        description: "JSON格式化、压缩、验证和转换",
      },
      {
        id: "regex",
        label: "正则测试",
        icon: Regex,
        component: lazyComponents.RegexTester,
        description: "正则表达式在线测试和验证工具",
      },
      {
        id: "format",
        label: "代码格式化",
        icon: Code2,
        component: lazyComponents.CodeFormatter,
        description: "支持多种语言的代码格式化工具",
      },
      {
        id: "qrcode",
        label: "二维码工具",
        icon: QrCode,
        component: lazyComponents.QrCodeTool,
        description: "生成和解析二维码，支持自定义样式",
      },
      {
        id: "markdown",
        label: "Markdown编辑器",
        icon: FileText,
        component: lazyComponents.MarkdownEditor,
        description: "所见即所得的Markdown编辑和预览",
      },
      {
        id: "data-visualization",
        label: "数据可视化",
        icon: BarChart,
        component: lazyComponents.DataVisualization,
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
        component: lazyComponents.ColorPicker,
        description: "颜色选择、转换和调色板生成",
      },
      {
        id: "time",
        label: "时间转换",
        icon: Timer,
        component: lazyComponents.TimeConverter,
        description: "时间戳转换、格式化和时区转换",
      },
      {
        id: "typography",
        label: "字体工具",
        icon: Type,
        component: lazyComponents.TypographyTool,
        description: "字体预览、单位转换和文本处理",
      },
      {
        id: "emoji",
        label: "表情工具",
        icon: Smile,
        component: lazyComponents.EmojiPicker,
        description: "表情符号搜索和复制工具",
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
        component: lazyComponents.ImageConverter,
        description: "图片格式转换，支持常见图片格式",
      },
      {
        id: "image-compress",
        label: "图片压缩",
        icon: Image,
        component: lazyComponents.ImageCompressor,
        description: "在线图片压缩，保持最佳质量",
      },
      {
        id: "svg-editor",
        label: "SVG编辑",
        icon: Image,
        component: lazyComponents.SvgEditor,
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
