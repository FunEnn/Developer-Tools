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
} from "lucide-react";

export const tools = [
  {
    category: "编码转换",
    items: [
      { id: "base64", label: "Base64", icon: Binary, component: Base64Tool },
      {
        id: "jwt",
        label: "JWT解析",
        icon: KeyRound,
        component: () => <div>开发中...</div>,
      },
      {
        id: "hash",
        label: "哈希计算",
        icon: Hash,
        component: () => <div>开发中...</div>,
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
        component: () => <div>开发中...</div>,
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
        component: () => <div>开发中...</div>,
      },
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
