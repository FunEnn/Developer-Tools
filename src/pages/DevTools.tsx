import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import React from "react";
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
  Binary
} from "lucide-react";

export const DevTools = () => {
  const tools = [
    { id: "json", label: "JSON工具", icon: FileJson, component: JsonEditor },
    { id: "regex", label: "正则测试", icon: Regex, component: RegexTester },
    { id: "color", label: "颜色工具", icon: Palette, component: ColorPicker },
    { id: "base64", label: "编码转换", icon: Binary, component: Base64Tool },
    // 新增工具占位
    { id: "jwt", label: "JWT解析", icon: KeyRound, component: () => <div>开发中...</div> },
    { id: "hash", label: "哈希计算", icon: Hash, component: () => <div>开发中...</div> },
    { id: "time", label: "时间转换", icon: Timer, component: () => <div>开发中...</div> },
    { id: "format", label: "代码格式化", icon: Code2, component: () => <div>开发��...</div> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            开发者工具箱
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            常用开发工具集合
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <Tabs defaultValue="json" className="w-full">
            <TabsList className="grid w-full grid-cols-4 md:grid-cols-8 gap-4 rounded-lg dark:bg-gray-800/50 backdrop-blur-sm p-2">
              {tools.map(({ id, label, icon: Icon }) => (
                <TabsTrigger
                  key={id}
                  value={id}
                  className="rounded-md transition-all hover:bg-white/80 dark:hover:bg-gray-700/80 data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm"
                >
                  <div className="flex flex-col items-center gap-1">
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{label}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-6">
              {tools.map(({ id, component: Component }) => (
                <TabsContent key={id} value={id} className="focus-visible:outline-none">
                  <Component />
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Made with ❤️ by Funenn
        </div>
      </div>
    </div>
  );
};

export default DevTools;
