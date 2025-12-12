'use client';

import { MbtiTypeInfo } from '@/lib/types';
import { useCallback, useState, useEffect } from 'react';

declare global {
  interface Window {
    Kakao?: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: KakaoShareOptions) => void;
      };
    };
  }
}

interface KakaoShareOptions {
  objectType: 'feed';
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  buttons: Array<{
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }>;
}

interface ShareButtonsProps {
  typeInfo: MbtiTypeInfo;
  onGenerateImage: () => Promise<void>;
}

export default function ShareButtons({ typeInfo, onGenerateImage }: ShareButtonsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  // kakaoLoaded state is used to track SDK loading (even if not directly referenced in JSX)
  const [, setKakaoLoaded] = useState(false);

  // Load Kakao SDK
  useEffect(() => {
    const kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;

    // Check if already loaded
    if (window.Kakao?.isInitialized()) {
      setKakaoLoaded(true);
      return;
    }

    // Load Kakao SDK script
    const script = document.createElement('script');
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.6.0/kakao.min.js';
    script.async = true;
    script.onload = () => {
      if (window.Kakao && kakaoAppKey) {
        window.Kakao.init(kakaoAppKey);
        setKakaoLoaded(true);
      }
    };
    document.head.appendChild(script);

    return () => {
      // Clean up script if component unmounts before load
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handleImageDownload = async () => {
    setIsGenerating(true);
    try {
      await onGenerateImage();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = useCallback(async () => {
    const url = window.location.origin;
    try {
      await navigator.clipboard.writeText(url);
      alert('링크가 복사되었습니다!');
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('링크가 복사되었습니다!');
    }
  }, []);

  const handleKakaoShare = useCallback(() => {
    if (!window.Kakao?.isInitialized()) {
      // Fallback to regular share if Kakao SDK is not available
      handleCopyLink();
      return;
    }

    const siteUrl = window.location.origin;

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `나는 ${typeInfo.code} - ${typeInfo.name}`,
        description: `당신의 MBTI는 무엇인가요? 3분 만에 확인해보세요!`,
        imageUrl: `${siteUrl}/og-image.png`, // You can create OG images per type
        link: {
          mobileWebUrl: `${siteUrl}?utm_source=kakao`,
          webUrl: `${siteUrl}?utm_source=kakao`,
        },
      },
      buttons: [
        {
          title: '나도 테스트하기',
          link: {
            mobileWebUrl: siteUrl,
            webUrl: siteUrl,
          },
        },
      ],
    });
  }, [typeInfo, handleCopyLink]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `나는 ${typeInfo.code} - ${typeInfo.name}`,
          text: `내 MBTI는 ${typeInfo.code} (${typeInfo.name})입니다! 당신의 MBTI는?`,
          url: window.location.origin,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      handleCopyLink();
    }
  }, [typeInfo, handleCopyLink]);

  return (
    <div className="mt-8 space-y-4">
      {/* Primary Action - Image Download */}
      <button
        onClick={handleImageDownload}
        disabled={isGenerating}
        className="w-full btn-primary flex items-center justify-center gap-2 py-4"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>이미지 생성 중...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>이미지로 저장하기</span>
          </>
        )}
      </button>

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleKakaoShare}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 bg-[#FEE500] text-[#191919] hover:bg-[#FAE100] active:scale-95"
        >
          {/* Kakao icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.728 1.758 5.132 4.43 6.526-.161.582-.533 2.109-.61 2.44-.095.407.152.401.32.292.131-.085 2.085-1.39 2.935-1.955.612.091 1.244.139 1.89.139 5.523 0 10-3.582 10-8s-4.477-8-10-8z"/>
          </svg>
          카카오톡
        </button>

        <button
          onClick={handleShare}
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          공유하기
        </button>
      </div>

      {/* Link Copy */}
      <button
        onClick={handleCopyLink}
        className="w-full py-3 text-center text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm"
      >
        링크 복사하기
      </button>
    </div>
  );
}
