import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { OpenAI } from "openai";
import axios from "axios";

dotenv.config();

const app = express();

// CORS 配置
app.use(cors({
  origin: ['https://developer-tools-jet.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'http://api.aihao123.cn/luomacode-api/open-api/',
  timeout: 10000,
});

// 导出处理函数
export default app;

// 如果不是在 Vercel 环境，则启动本地服务器
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} 