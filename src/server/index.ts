import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import axios from "axios";

// 定义类型
type PromptTemplate = "social" | "ad" | "article" | "slogan";


interface PixivResponse {
  error: string;
  data: {
    pid: number;
    p: number;
    uid: number;
    title: string;
    author: string;
    r18: boolean;
    width: number;
    height: number;
    tags: string[];
    ext: string;
    aiType: number;
    uploadDate: number;
    urls: Record<string, string>;
  }[];
}

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      'https://developer-tools-jet.vercel.app', 
      'http://localhost:5173',
      'https://developer-tools-git-main-luomacode.vercel.app',
      /\.vercel\.app$/
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);
app.use(express.json());

// 健康检查接口
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV });
});

// Pixiv 图片接口
app.post("/api/pixiv", async (req, res) => {
  try {
    const response = await axios.post<PixivResponse>(
      "https://api.lolicon.app/setu/v2",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    console.log('Pixiv API response:', response?.data);

    if (!response || !response.data || response.data.error) {
      throw new Error(response?.data?.error || "未知错误");
    }

    res.json(response.data);
  } catch (error: any) {
    console.error("Pixiv API error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });
    
    res.status(error.response?.status || 500).json({
      error: "获取 Pixiv 图片失败",
      details: error.response?.data?.error || error.message,
    });
  }
});

// 导出处理函数
export default app;

// 启动服务器
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
