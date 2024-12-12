import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { DevTools } from "@/pages/DevTools";
import { ErrorPage } from "@/pages/ErrorPage";
import { ToolLayout } from "@/components/layout/ToolLayout";
import {
  JsonEditor,
  RegexTester,
  ColorPicker,
  Base64Tool,
  TimeConverter,
  JwtTool,
  HashTool,
  CodeFormatter,
  ImageConverter,
  ImageCompressor,
  SvgEditor,
  QrCodeTool,
} from "@/components/features";
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
  Grid,
  Box,
  Layout,
  Type,
} from "lucide-react";
import { TypographyTool } from "../components/features";

export const tools = [
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
export const router = createBrowserRouter(
  [
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
  ],
  {
    basename: "/Developer-Tools",
  }
);
