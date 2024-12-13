import express, { Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { OpenAI } from "openai";
import axios from "axios";

type PromptTemplate = 'social' | 'ad' | 'article' | 'slogan';

interface RichTextChild {
  text?: string;
  [key: string]: any;
}

dotenv.config();

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
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

// AI 聊天接口
app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    
    // 系统提示词
    const systemPrompt = "请对下面的内容进行分类，并且描述出对应分类的理由。你只需要根据用户的内容输出下面几种类型：bug类型,用户体验问题，用户吐槽。输出格式:[类型]-[问题:{content}]-[分析的理由]";

    const response = await axios.post('https://api.aihao123.cn/luomacode-api/open-api/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      stream: false
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Raw API Response:', JSON.stringify(response.data, null, 2));

    const data = response.data;
    if (!data.message?.content?.richText?.[0]) {
      console.error('Invalid response structure:', data);
      throw new Error('无法获取有效回复');
    }

    const richText = data.message.content.richText[0];
    const content = richText.children
      .map((child: RichTextChild) => typeof child === 'string' ? child : child.text || '')
      .join('');
    res.json({ message: content });

  } catch (error: any) {
    console.error("Chat error:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "聊天服务出错",
      details: error.response?.data?.error || error.message
    });
  }
});

// 图片生成接口
app.post("/api/generate-image", async (req: Request, res: Response) => {
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
});

// 代码生成接口
app.post("/api/generate-code", async (req: Request, res: Response) => {
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
});

// 文案生成接口
app.post("/api/generate-text", async (req: Request, res: Response) => {
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
        { role: "user", content: prompts[template as PromptTemplate] }
      ],
    });

    res.json({ text: completion.choices[0].message.content });
  } catch (error) {
    console.error("Text generation error:", error);
    res.status(500).json({ error: "文案生成出错" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
