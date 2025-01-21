import React, { useState, useEffect } from "react";
import { Smile, Copy, History, Star, Search, X } from "lucide-react";
import {
  EmojiCategory,
  emojiData,
  searchEmojis,
  getEmojisByCategory,
} from "./emojiData";

export const EmojiPicker = () => {
  const [selectedCategory, setSelectedCategory] = useState(emojiData[0].name);
  const [searchTerm, setSearchTerm] = useState("");
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const [favoriteEmojis, setFavoriteEmojis] = useState<string[]>([]);
  const [copiedEmoji, setCopiedEmoji] = useState<string | null>(null);

  useEffect(() => {
    const savedRecent = localStorage.getItem("recent-emojis");
    if (savedRecent) setRecentEmojis(JSON.parse(savedRecent));

    const savedFavorites = localStorage.getItem("favorite-emojis");
    if (savedFavorites) setFavoriteEmojis(JSON.parse(savedFavorites));
  }, []);

  const handleEmojiClick = async (emoji: string) => {
    await navigator.clipboard.writeText(emoji);
    setCopiedEmoji(emoji);
    setTimeout(() => setCopiedEmoji(null), 2000);

    // 更新最近使用
    const newRecent = [emoji, ...recentEmojis.filter((e) => e !== emoji)].slice(
      0,
      16
    );
    setRecentEmojis(newRecent);
    localStorage.setItem("recent-emojis", JSON.stringify(newRecent));
  };

  const toggleFavorite = (emoji: string) => {
    const newFavorites = favoriteEmojis.includes(emoji)
      ? favoriteEmojis.filter((e) => e !== emoji)
      : [...favoriteEmojis, emoji];
    setFavoriteEmojis(newFavorites);
    localStorage.setItem("favorite-emojis", JSON.stringify(newFavorites));
  };

  const filteredEmojis = searchTerm
    ? emojiData
        .flatMap((category) => category.emojis)
        .filter(
          (emoji) =>
            emoji.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            emoji.char.includes(searchTerm)
        )
    : emojiData.find((category) => category.name === selectedCategory)
        ?.emojis || [];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 
                    dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent 
                    flex items-center gap-2">
          <Smile className="w-6 h-6" />
          表情工具
        </h2>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索表情..."
            className="w-64 pl-10 pr-4 py-2 rounded-xl
                    border border-gray-200 dark:border-gray-700
                    bg-white dark:bg-gray-800 
                    text-gray-900 dark:text-gray-100
                    focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600 
                    focus:border-transparent transition-all duration-200"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 
                      text-gray-400 hover:text-violet-500 dark:hover:text-violet-400 
                      transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {emojiData.map((category) => (
            <button
              key={category.name}
              onClick={() => {
                setSelectedCategory(category.name);
                setSearchTerm("");
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors
                ${
                  selectedCategory === category.name
                    ? "bg-gradient-to-r from-violet-400 to-indigo-400 text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {recentEmojis.length > 0 && !searchTerm && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm space-y-3">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <History className="w-4 h-4 text-violet-500 dark:text-violet-400" />
            最近使用
          </h3>
          <div className="grid grid-cols-8 sm:grid-cols-12 gap-2">
            {recentEmojis.slice(0, 12).map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                className="aspect-square flex items-center justify-center text-2xl 
                        hover:bg-violet-50 dark:hover:bg-violet-900/20 
                        rounded-xl transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {favoriteEmojis.length > 0 && !searchTerm && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm space-y-3">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            收藏表情
          </h3>
          <div className="grid grid-cols-8 sm:grid-cols-12 gap-2">
            {favoriteEmojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                className="aspect-square flex items-center justify-center text-2xl 
                        hover:bg-violet-50 dark:hover:bg-violet-900/20 
                        rounded-xl transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm space-y-3">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {searchTerm ? "搜索结果" : selectedCategory}
        </h3>
        <div className="grid grid-cols-8 sm:grid-cols-12 gap-2">
          {filteredEmojis.map((emoji, index) => (
            <div key={index} className="relative group">
              <button
                onClick={() => handleEmojiClick(emoji.char)}
                className="w-full aspect-square flex items-center justify-center text-2xl 
                        hover:bg-violet-50 dark:hover:bg-violet-900/20 
                        rounded-xl transition-colors"
                title={emoji.description}
              >
                {emoji.char}
              </button>
              <button
                onClick={() => toggleFavorite(emoji.char)}
                className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 
                        transition-opacity bg-white dark:bg-gray-800 rounded-full 
                        p-1 shadow-sm hover:shadow-md"
              >
                <Star
                  className={`w-3 h-3 ${
                    favoriteEmojis.includes(emoji.char)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-400 hover:text-yellow-500"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {copiedEmoji && (
        <div className="fixed bottom-4 right-4 bg-gradient-to-r from-violet-500 to-indigo-500 
                     text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 
                     animate-fade-in-up">
          <Copy className="w-4 h-4" />
          已复制: {copiedEmoji}
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
