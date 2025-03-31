import { useState } from 'react';
import axios from 'axios';
import { Loader2, RefreshCw, Image as ImageIcon, Search, X, Tag, Filter, AlertCircle, Download } from 'lucide-react';

interface PixivImage {
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
}

interface PixivResponse {
  error: string;
  data: PixivImage[];
}

interface ImageLoadingState {
  [key: string]: boolean;
}

interface ImageErrorState {
  [key: string]: boolean;
}

export default function PixivPage() {
  const [images, setImages] = useState<PixivImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<ImageLoadingState>({});
  const [imageError, setImageError] = useState<ImageErrorState>({});
  const [settings, setSettings] = useState({
    r18: 0,
    num: 1,
    size: ['regular'],
    excludeAI: false,
    tag: [] as string[],
    keyword: '',
  });

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 将标签数组转换为二维数组格式
      const requestData = {
        ...settings,
        tag: settings.tag.map(tag => tag.split('|'))
      };
      
      const response = await axios.post<PixivResponse>('/api/pixiv', requestData);
      setImages(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || '获取图片失败');
    } finally {
      setLoading(false);
    }
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.type === 'click') && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      
      // 检查是否已达到最大组数
      if (settings.tag.length >= 3) {
        setError('最多只能添加3组标签');
        return;
      }

      // 检查每组标签数量
      const tags = newTag.split('|');
      if (tags.length > 20) {
        setError('每组最多只能添加20个标签');
        return;
      }

      // 检查标签是否已存在
      if (!settings.tag.includes(newTag)) {
        setSettings(prev => ({
          ...prev,
          tag: [...prev.tag, newTag]
        }));
        setError(null);
      }
      e.currentTarget.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSettings(prev => ({
      ...prev,
      tag: prev.tag.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageLoad = (imageId: string) => {
    setImageLoading(prev => ({ ...prev, [imageId]: false }));
  };

  const handleImageError = (imageId: string) => {
    setImageLoading(prev => ({ ...prev, [imageId]: false }));
    setImageError(prev => ({ ...prev, [imageId]: true }));
  };

  const handleDownload = async (image: PixivImage) => {
    try {
      const link = document.createElement('a');
      link.href = image.urls[settings.size[0]];
      link.download = `${image.title}_${image.author}_${image.pid}.${image.ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('下载失败，请稍后重试');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-blue-800">
                本页面使用 <a href="https://github.com/Tsuk1ko/lolicon-api-docs/blob/main/setu.md" target="_blank" rel="noopener noreferrer" className="font-medium underline hover:text-blue-900">lolicon API</a> 获取 Pixiv 图片
              </p>
              <p className="mt-1 text-xs text-blue-600">
                所有图片均来自 Pixiv，版权归作品的作者所有。API 仅储存了作品的基本信息，不提供图片的代理或储存服务。
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              随机 Pixiv 图片
            </h1>
            <p className="mt-2 text-sm text-gray-500">支持多种筛选条件，轻松找到心仪的图片</p>
          </div>
          <button
            onClick={fetchImages}
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                加载中...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                获取随机图片
              </>
            )}
          </button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Filter className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">筛选条件</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  R18 设置
                </label>
                <select
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-300"
                  value={settings.r18}
                  onChange={(e) => setSettings({ ...settings, r18: Number(e.target.value) })}
                >
                  <option value={0}>非 R18</option>
                  <option value={1}>R18</option>
                  <option value={2}>混合</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  图片数量
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-300"
                  value={settings.num}
                  onChange={(e) => setSettings({ ...settings, num: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  图片尺寸
                </label>
                <select
                  className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-300"
                  value={settings.size[0]}
                  onChange={(e) => setSettings({ ...settings, size: [e.target.value] })}
                >
                  <option value="original">原始尺寸</option>
                  <option value="regular">常规尺寸</option>
                  <option value="small">小尺寸</option>
                  <option value="thumb">缩略图</option>
                  <option value="mini">迷你尺寸</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="excludeAI"
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                  checked={settings.excludeAI}
                  onChange={(e) => setSettings({ ...settings, excludeAI: e.target.checked })}
                />
                <label htmlFor="excludeAI" className="ml-3 block text-sm text-gray-700">
                  排除 AI 作品
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  关键词搜索
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="输入关键词搜索"
                    className="w-full h-11 pl-11 pr-4 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-300"
                    value={settings.keyword}
                    onChange={(e) => setSettings({ ...settings, keyword: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  标签搜索
                </label>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">支持 AND/OR 规则</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1.5 text-xs text-gray-600">
                    <li>每行输入一组标签，组内标签用 | 分隔（OR 关系）</li>
                    <li>不同组之间是 AND 关系</li>
                    <li>最多支持 3 组 AND 关系，每组最多 20 个标签</li>
                    <li className="mt-2 text-gray-500">示例：</li>
                    <li className="ml-4">萝莉|少女（查找包含"萝莉"或"少女"的图片）</li>
                    <li className="ml-4">萝莉|少女 白丝|黑丝（查找同时包含"萝莉或少女"和"白丝或黑丝"的图片）</li>
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {settings.tag.map((tag, index) => (
                    <div key={index} className="flex items-center gap-1.5 bg-blue-50 rounded-full px-3 py-1.5">
                      <span className="text-sm text-blue-700 font-medium">{tag}</span>
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="输入标签，用 | 分隔（例如：萝莉|少女）"
                    className="flex-1 h-11 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-300"
                    onKeyDown={handleTagInput}
                  />
                  <button
                    onClick={() => {
                      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                      if (input && input.value.trim()) {
                        handleTagInput({ key: 'Enter', currentTarget: input } as any);
                      }
                    }}
                    className="h-11 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    添加
                  </button>
                </div>
                {settings.tag.length >= 3 && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                    已达到最大标签组数（3组）
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative mb-8 flex items-center gap-2" role="alert">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {images.length === 0 && !loading && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">暂无图片</h3>
            <p className="mt-2 text-sm text-gray-500">点击上方按钮获取随机图片</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => {
            const imageId = `${image.pid}-${image.p}`;
            return (
              <div key={imageId} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 border border-gray-100">
                <div className="relative aspect-square group">
                  {imageLoading[imageId] && (
                    <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    </div>
                  )}
                  {imageError[imageId] ? (
                    <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center p-4">
                      <AlertCircle className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 text-center">图片加载失败</p>
                      <button
                        onClick={() => {
                          setImageError(prev => ({ ...prev, [imageId]: false }));
                          setImageLoading(prev => ({ ...prev, [imageId]: true }));
                        }}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        重试
                      </button>
                    </div>
                  ) : (
                    <>
                      <img
                        src={image.urls[settings.size[0]]}
                        alt={image.title}
                        className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                          imageLoading[imageId] ? 'opacity-0' : 'opacity-100'
                        }`}
                        loading="lazy"
                        onLoad={() => handleImageLoad(imageId)}
                        onError={() => handleImageError(imageId)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <button
                        onClick={() => handleDownload(image)}
                        className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                        title="下载图片"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-gray-900">{image.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">作者：{image.author}</p>
                  <div className="flex flex-wrap gap-2">
                    {image.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-gray-50 text-gray-600 text-sm rounded-full border border-gray-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 