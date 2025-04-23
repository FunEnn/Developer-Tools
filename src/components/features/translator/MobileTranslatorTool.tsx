import React, { useState } from 'react';
import axios from 'axios';
import { CopyIcon, ArrowRightLeftIcon, MicIcon, RefreshCwIcon, AlertCircle, CheckCircle, InfoIcon } from 'lucide-react';

const MobileTranslatorTool: React.FC = () => {
    const [sourceText, setSourceText] = useState<string>('');
    const [translatedText, setTranslatedText] = useState<string>('');
    const [sourceLanguage, setSourceLanguage] = useState<string>('auto');
    const [targetLanguage, setTargetLanguage] = useState<string>('zh');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [notification, setNotification] = useState<{
        type: 'success' | 'error' | 'info';
        message: string;
    } | null>(null);

    // 语言选项
    const languageOptions = [
        { value: 'auto', label: '检测语言' },
        { value: 'zh', label: '中文（简体）' },
        { value: 'zh-TW', label: '中文（繁体）' },
        { value: 'en', label: '英语' },
        { value: 'ja', label: '日语' },
        { value: 'ko', label: '韩语' },
        { value: 'de', label: '德语' },
    ];

    // 目标语言映射
    const targetLanguageMap: Record<string, string[]> = {
        'auto': ['zh', 'zh-TW', 'en', 'ja', 'ko', 'de'],
        'zh': ['zh-TW', 'en', 'ja', 'ko', 'de'],
        'zh-TW': ['zh', 'en', 'ja', 'ko', 'de'],
        'en': ['zh', 'zh-TW', 'ja', 'ko', 'de'],
        'ja': ['zh', 'zh-TW', 'en', 'ko', 'de'],
        'ko': ['zh', 'zh-TW', 'en', 'ja', 'de'],
        'de': ['zh', 'zh-TW', 'en', 'ja', 'ko'],
    };

    // 显示通知
    const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    // 获取当前源语言可用的目标语言
    const availableTargetLanguages = targetLanguageMap[sourceLanguage] || [];

    // 处理翻译
    const handleTranslate = async () => {
        if (!sourceText.trim()) {
            showNotification('error', '请输入要翻译的文本');
            return;
        }

        setIsLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const response = await axios.post(`${apiUrl}/api/translate`, {
                text: sourceText,
                sourceLanguage,
                targetLanguage,
            });

            setTranslatedText(response.data.translatedText);
            showNotification('success', '翻译成功');
        } catch (error: any) {
            console.error('翻译出错：', error);
            showNotification('error', error.response?.data?.error || '翻译失败，请稍后重试');
        } finally {
            setIsLoading(false);
        }
    };

    // 交换语言
    const swapLanguages = () => {
        // 只有当源语言不是自动检测，且目标语言在允许的源语言列表中时才能交换
        if (sourceLanguage !== 'auto' && targetLanguage !== 'auto') {
            const temp = sourceLanguage;
            setSourceLanguage(targetLanguage);
            setTargetLanguage(temp);

            // 同时交换文本
            const tempText = sourceText;
            setSourceText(translatedText);
            setTranslatedText(tempText);
        } else {
            showNotification('info', '自动检测语言无法交换');
        }
    };

    // 复制文本
    const copyText = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('success', '已复制到剪贴板');
        }).catch(() => {
            showNotification('error', '复制失败');
        });
    };

    // 清空文本
    const clearText = () => {
        setSourceText('');
        setTranslatedText('');
    };

    // 可见的语言选项(只显示少数常用选项)
    const visibleLangs = {
        source: ['auto', 'en', 'zh'],
        target: ['zh', 'en', 'ja']
    };

    return (
        <div className="w-full bg-white dark:bg-[#131620] dark:text-gray-100 transition-colors duration-200 border border-gray-200 dark:border-[#2c3142] rounded-lg overflow-hidden shadow-md">
            {/* 顶部语言选择区域 */}
            <div className="flex flex-col">
                {/* 源语言选择 */}
                <div className="flex items-center justify-between px-2 pt-2">
                    <div className="flex-1 overflow-x-auto scrollbar-hide">
                        <div className="flex border-b border-blue-500 dark:border-blue-700/60 min-w-[280px]">
                            {visibleLangs.source.map((lang) => {
                                const option = languageOptions.find(opt => opt.value === lang);
                                return (
                                    <button
                                        key={lang}
                                        className={`px-3 py-2 text-xs font-medium whitespace-nowrap ${sourceLanguage === lang
                                                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-blue-300'
                                            }`}
                                        onClick={() => setSourceLanguage(lang)}
                                    >
                                        {option?.label}
                                    </button>
                                );
                            })}
                            <button className="px-2 text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200">
                                <span className="sr-only">更多语言</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 输入区域 */}
            <div className="flex flex-col">
                <textarea
                    placeholder="请输入文本"
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    className="flex-grow p-3 min-h-[140px] resize-none w-full focus:outline-none bg-white text-gray-800 dark:bg-[#131620] dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                />
                <div className="px-3 py-2 flex justify-between items-center text-sm border-t border-gray-100 dark:border-[#2c3142] bg-white dark:bg-[#131620]">
                    <div className="flex items-center space-x-2">
                        <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#2c3142] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" title="语音输入">
                            <MicIcon className="h-3.5 w-3.5" />
                        </button>
                        <button
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#2c3142] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            onClick={clearText}
                            title="清空文本"
                        >
                            <RefreshCwIcon className="h-3.5 w-3.5" />
                        </button>
                    </div>
                    <div className="text-gray-400 dark:text-gray-500 text-xs">
                        {sourceText.length} / 5,000
                    </div>
                </div>
            </div>

            {/* 中间控制区 - 交换按钮和翻译按钮 */}
            <div className="p-2 flex justify-between items-center bg-gray-50 dark:bg-[#131620] border-t border-b border-gray-100 dark:border-[#2c3142]">

                {/* 目标语言选择 */}
                <div className="flex-1 overflow-x-auto scrollbar-hide">
                    <div className="flex border-b border-blue-500 dark:border-blue-700/60 min-w-[200px]">
                        {visibleLangs.target.map((lang) => {
                            const option = languageOptions.find(opt => opt.value === lang);
                            return (
                                <button
                                    key={lang}
                                    disabled={!availableTargetLanguages.includes(lang)}
                                    className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap ${targetLanguage === lang
                                            ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-blue-300'
                                        } ${!availableTargetLanguages.includes(lang) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => setTargetLanguage(lang)}
                                >
                                    {option?.label}
                                </button>
                            );
                        })}
                        <button className="px-2 text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200">
                            <span className="sr-only">更多语言</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>
                    </div>
                </div>
                {/* 语言交换按钮 */}
                <button
                    onClick={swapLanguages}
                    disabled={sourceLanguage === 'auto'}
                    className={`p-1.5 rounded-full ${sourceLanguage !== 'auto' ? 'text-blue-500 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20' : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'}`}
                    title={sourceLanguage === 'auto' ? '自动检测语言无法交换' : '交换语言'}
                >
                    <ArrowRightLeftIcon className="h-4 w-4" />
                </button>
                {/* 翻译按钮 */}
                <button
                    onClick={handleTranslate}
                    disabled={isLoading || !sourceText.trim()}
                    className="py-1.5 px-3 bg-blue-500 hover:bg-blue-600 dark:bg-[#4b5cd7] dark:hover:bg-[#3e4dbe] text-white rounded-full disabled:opacity-50 transition-colors duration-200 text-xs flex items-center justify-center"
                >
                    {isLoading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-0.5 mr-1.5 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>翻译中</span>
                        </span>
                    ) : (
                        <span>翻译</span>
                    )}
                </button>
            </div>

            {/* 翻译结果区域 */}
            <div className="flex flex-col">
                <div
                    className={`flex-grow p-3 min-h-[140px] w-full bg-gray-50 dark:bg-[#1C2333] text-gray-800 dark:text-gray-100 ${isLoading ? 'opacity-50' : ''}`}
                >
                    {translatedText ? (
                        <div className="whitespace-pre-wrap break-words">{translatedText}</div>
                    ) : (
                        <div className="text-gray-400 dark:text-gray-500 text-center mt-8 text-sm">
                            {isLoading ? '翻译中...' : '翻译结果将显示在这里'}
                        </div>
                    )}
                </div>
                <div className="px-3 py-2 flex justify-end items-center text-sm border-t border-gray-100 dark:border-[#2c3142] bg-gray-50 dark:bg-[#1C2333]">
                    {translatedText && (
                        <button
                            className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-[#2c3142] flex items-center space-x-1"
                            onClick={() => copyText(translatedText)}
                            title="复制翻译结果"
                        >
                            <CopyIcon className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">复制</span>
                        </button>
                    )}
                </div>
            </div>

            {/* 简约的服务说明 */}
            <div className="p-1.5 text-center text-xs text-gray-400 dark:text-gray-500 bg-white dark:bg-[#131620] border-t border-gray-200 dark:border-[#2c3142]">
                由腾讯云翻译服务提供技术支持
            </div>

            {/* 通知提示 */}
            {notification && (
                <div className={`fixed bottom-4 right-4 p-2 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 text-xs ${notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800/40' :
                        notification.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800/40' :
                            'bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800/40'
                    }`}>
                    {notification.type === 'success' && <CheckCircle className="w-3 h-3" />}
                    {notification.type === 'error' && <AlertCircle className="w-3 h-3" />}
                    {notification.type === 'info' && <InfoIcon className="w-3 h-3" />}
                    <span>{notification.message}</span>
                </div>
            )}
        </div>
    );
};

export default MobileTranslatorTool; 