import express from "express";
import axios from "axios";

interface PixivRequest {
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

const router = express.Router();

// 随机 Pixiv 图片接口
router.post("/", async (req, res) => {
  try {
    const response = await axios.post<PixivResponse>(
      "https://api.lolicon.app/setu/v2",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // 设置超时时间为 10 秒
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

export default router; 