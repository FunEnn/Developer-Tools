// 定义类型
export type PromptTemplate = "social" | "ad" | "article" | "slogan";

import express from "express";

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