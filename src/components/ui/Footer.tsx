export default function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto text-center">
        <div className="flex flex-wrap justify-center gap-8 text-sm mb-6">
          <button className="text-muted hover:text-foreground transition-colors duration-smooth">개인정보처리방침</button>
          <button className="text-muted hover:text-foreground transition-colors duration-smooth">이용약관</button>
          <a href="mailto:contact@mbtilab.com" className="text-muted hover:text-foreground transition-colors duration-smooth">
            문의하기
          </a>
        </div>
        <p className="text-xs text-muted">© 2025 MBTI Lab. All rights reserved.</p>
      </div>
    </footer>
  );
}
