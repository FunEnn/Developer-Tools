import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { OpenAI } from "openai";
import axios from "axios";
import pixivRouter from "./pixiv";

// 定义类型
type PromptTemplate = "social" | "ad" | "article" | "slogan";

// 添加 RichTextChild 类型定义
interface RichTextChild {
  text?: string;
  children?: RichTextChild[];
  [key: string]: any;
}

interface TypedRequestBody<T> extends express.Request {
  body: T;
}

interface ChatRequest {
  message: string;
}

interface ImageRequest {
  prompt: string;
}

interface CodeRequest {
  prompt: string;
}

interface TextRequest {
  template: PromptTemplate;
  keywords: string;
}

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      'https://developer-tools-jet.vercel.app', 
      'http://localhost:5173',
      'https://developer-tools-git-main-luomacode.vercel.app', // 添加所有可能的域名
      /\.vercel\.app$/ // 允许所有 vercel.app 子域名
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);
app.use(express.json());

// 使用 Pixiv 路由
app.use("/api/pixiv", pixivRouter);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  baseURL: "http://api.aihao123.cn/luomacode-api/open-api/",
  timeout: 10000,
});

// 健康检查接口
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV });
});

// AI 聊天接口
app.post(
  "/api/chat",
  async (req: TypedRequestBody<ChatRequest>, res: express.Response) => {
    try {
      const { message } = req.body;

      const response = await axios.post(
        "https://api.aihao123.cn/luomacode-api/open-api/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "你是一个友好的助手，可以帮助用户解答各种问题。请用简洁、专业的方式回答。",
            },
            { role: "user", content: message },
          ],
          stream: false,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      if (!data.message?.content?.richText?.[0]) {
        throw new Error("无法获取有效回复");
      }

      const richText = data.message.content.richText[0];
      const content = richText.children
        .map((child: RichTextChild) =>
          typeof child === "string" ? child : child.text || ""
        )
        .join("");

      res.json({ message: content });
    } catch (error: any) {
      console.error("Chat error:", error.response?.data || error.message);
      res.status(500).json({
        error: "聊天服务出错",
        details: error.response?.data?.error || error.message,
      });
    }
  }
);

// 图片生成接口
app.post(
  "/api/generate-image",
  async (req: TypedRequestBody<ImageRequest>, res: express.Response) => {
    try {
      const { prompt } = req.body;
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
      });

      res.json({ imageUrl: response.data[0].url });
    } catch (error) {
      console.error("Image generation error:", error);
      res.status(500).json({ error: "图片生成出错" });
    }
  }
);

// 代码生成接口
app.post(
  "/api/generate-code",
  async (req: TypedRequestBody<CodeRequest>, res: express.Response) => {
    try {
      const { prompt } = req.body;
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful coding assistant. Provide code with explanations.",
          },
          { role: "user", content: prompt },
        ],
      });

      res.json({ code: completion.choices[0].message.content });
    } catch (error) {
      console.error("Code generation error:", error);
      res.status(500).json({ error: "代码生成出错" });
    }
  }
);

// 文案生成接口
app.post(
  "/api/generate-text",
  async (req: TypedRequestBody<TextRequest>, res: express.Response) => {
    try {
      const { template, keywords } = req.body;
      const prompts: Record<PromptTemplate, string> = {
        social: `为以下主题创建一个吸引人的社交媒体帖子：${keywords}`,
        ad: `为以下产品或服务创建一个广告文案：${keywords}`,
        article: `为以下主题生成一篇短文：${keywords}`,
        slogan: `为以下主题创建一个朗朗上口的标语：${keywords}`,
      };

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "你是一个专业的文案撰写专家。" },
          { role: "user", content: prompts[template] },
        ],
      });

      res.json({ text: completion.choices[0].message.content });
    } catch (error) {
      console.error("Text generation error:", error);
      res.status(500).json({ error: "文案生成出错" });
    }
  }
);

// 导出处理函数
export default app;

// 启动服务器
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
