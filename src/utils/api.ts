const API_BASE_URL = 'https://api.aihao123.cn/luomacode-api/open-api/v1';

export const api = {
  chat: async (message: string, systemPrompt?: string) => {
    const messages = [
      ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
      { role: 'user', content: message }
    ];

    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error('API 请求失败');
    }

    const data = await response.json();
    return data;
  }
}; 