export default function Footer() {
  return (
    <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 mb-4">
          <button className="hover:text-primary transition-colors">개인정보처리방침</button>
          <span className="text-gray-300">|</span>
          <button className="hover:text-primary transition-colors">이용약관</button>
          <span className="text-gray-300">|</span>
          <a href="mailto:contact@mbtilab.com" className="hover:text-primary transition-colors">
            문의하기
          </a>
        </div>
        <p className="text-xs text-gray-400">© 2025 MBTI Lab. All rights reserved.</p>
      </div>
    </footer>
  );
}
