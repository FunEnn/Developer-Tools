import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { OpenAI } from "openai";
import axios from "axios";
import CryptoJS from 'crypto-js';
// 定义类型
export type PromptTemplate = "social" | "ad" | "article" | "slogan";

export interface TypedRequestBody<T> extends express.Request {
  body: T;
}

// 添加 RichTextChild 类型定义
export interface RichTextChild {
  text?: string;
  children?: RichTextChild[];
  [key: string]: any;
}

export interface ChatRequest {
  message: string;
}

export interface ImageRequest {
  prompt: string;
}

export interface CodeRequest {
  prompt: string;
}

export interface TextRequest {
  template: PromptTemplate;
  keywords: string;
}

export interface TranslateRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface PixivRequest {
  r18?: number;
  num?: number;
  uid?: number[];
  keyword?: string;
  tag?: string[];
  size?: string[];
  proxy?: string;
  dateAfter?: number;
  dateBefore?: number;
  dsc?: boolean;
  excludeAI?: boolean;
  aspectRatio?: string;
}

export interface PixivResponse {
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

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  baseURL: "http://api.aihao123.cn/luomacode-api/open-api/",
  timeout: 10000,
});

// 腾讯云翻译API密钥
const TENCENT_SECRET_ID = process.env.TENCENT_SECRET_ID;
const TENCENT_SECRET_KEY = process.env.TENCENT_SECRET_KEY;

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

    console.log('Pixiv API response:', response.data);

    if (response.data.error) {
      throw new Error(response.data.error);
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

// 腾讯云翻译接口
app.post(
  "/api/translate",
  async (req: TypedRequestBody<TranslateRequest>, res: express.Response) => {
    try {
      const { text, sourceLanguage, targetLanguage } = req.body;
      
      // 计算签名
      const endpoint = "tmt.tencentcloudapi.com";
      const region = "ap-guangzhou";
      const action = "TextTranslate";
      const version = "2018-03-21";
      const timestamp = Math.round(new Date().getTime() / 1000);
      const date = new Date(timestamp * 1000).toISOString().split('T')[0];
      
      // 请求数据
      const payload = {
        SourceText: text,
        Source: sourceLanguage,
        Target: targetLanguage,
        ProjectId: 0
      };
      
      // 准备签名
      const service = "tmt";
      const algorithm = "TC3-HMAC-SHA256";
      const payloadJson = JSON.stringify(payload);
      const hashedRequestPayload = CryptoJS.SHA256(payloadJson).toString(CryptoJS.enc.Hex);
      
      // 规范请求串
      const httpRequestMethod = "POST";
      const canonicalUri = "/";
      const canonicalQueryString = "";
      const canonicalHeaders = "content-type:application/json\n" + `host:${endpoint}\n`;
      const signedHeaders = "content-type;host";
      const canonicalRequest = httpRequestMethod + "\n" +
                               canonicalUri + "\n" +
                               canonicalQueryString + "\n" +
                               canonicalHeaders + "\n" +
                               signedHeaders + "\n" +
                               hashedRequestPayload;
      
      // 步骤2：拼接待签名字符串
      const credentialScope = date + "/" + service + "/" + "tc3_request";
      const hashedCanonicalRequest = CryptoJS.SHA256(canonicalRequest).toString(CryptoJS.enc.Hex);
      const stringToSign = algorithm + "\n" +
                          timestamp + "\n" +
                          credentialScope + "\n" +
                          hashedCanonicalRequest;
      
      // 步骤3：计算签名
      const secretDate = CryptoJS.HmacSHA256(date, "TC3" + TENCENT_SECRET_KEY);
      const secretService = CryptoJS.HmacSHA256(service, secretDate);
      const secretSigning = CryptoJS.HmacSHA256("tc3_request", secretService);
      const signature = CryptoJS.HmacSHA256(stringToSign, secretSigning).toString(CryptoJS.enc.Hex);
      
      // 步骤4：拼接Authorization
      const authorization = algorithm + " " +
                           "Credential=" + TENCENT_SECRET_ID + "/" + credentialScope + ", " +
                           "SignedHeaders=" + signedHeaders + ", " +
                           "Signature=" + signature;
      
      // 发送请求
      const response = await axios.post(
        `https://${endpoint}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": authorization,
            "Host": endpoint,
            "X-TC-Action": action,
            "X-TC-Region": region,
            "X-TC-Timestamp": timestamp.toString(),
            "X-TC-Version": version
          }
        }
      );

      if (response.data.Response.Error) {
        throw new Error(response.data.Response.Error.Message);
      }

      res.json({ 
        translatedText: response.data.Response.TargetText 
      });
    } catch (error: any) {
      console.error("Translation error:", error.response?.data || error.message);
      res.status(500).json({
        error: "翻译服务出错",
        details: error.response?.data?.Response?.Error?.Message || error.message,
      });
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
