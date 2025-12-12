import { MbtiTypeInfo } from './types';

export async function generateResultImage(typeInfo: MbtiTypeInfo): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  // Instagram Story size
  canvas.width = 1080;
  canvas.height = 1920;

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, typeInfo.color);
  gradient.addColorStop(1, adjustColor(typeInfo.color, -30));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add some decorative circles
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(200, 300, 200, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(900, 1600, 250, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // White card in the center
  const cardX = 90;
  const cardY = 500;
  const cardWidth = 900;
  const cardHeight = 900;
  const radius = 40;

  ctx.fillStyle = '#ffffff';
  roundRect(ctx, cardX, cardY, cardWidth, cardHeight, radius);
  ctx.fill();

  // Emoji
  ctx.font = '120px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(typeInfo.emoji, canvas.width / 2, cardY + 180);

  // MBTI Type
  ctx.fillStyle = typeInfo.color;
  ctx.font = 'bold 140px Pretendard, sans-serif';
  ctx.fillText(typeInfo.code, canvas.width / 2, cardY + 380);

  // Type Name
  ctx.fillStyle = '#212529';
  ctx.font = 'bold 60px Pretendard, sans-serif';
  ctx.fillText(typeInfo.name, canvas.width / 2, cardY + 500);

  // Keywords
  ctx.fillStyle = '#6b7280';
  ctx.font = '36px Pretendard, sans-serif';
  const keywordsText = typeInfo.keywords.slice(0, 3).map((k) => `#${k}`).join('  ');
  ctx.fillText(keywordsText, canvas.width / 2, cardY + 600);

  // Summary
  ctx.fillStyle = '#4b5563';
  ctx.font = '32px Pretendard, sans-serif';
  const words = typeInfo.summary.split(' ');
  let line = '';
  let y = cardY + 720;
  const maxWidth = cardWidth - 100;

  for (const word of words) {
    const testLine = line + word + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line !== '') {
      ctx.fillText(line.trim(), canvas.width / 2, y);
      line = word + ' ';
      y += 50;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), canvas.width / 2, y);

  // Logo and URL at bottom
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px Pretendard, sans-serif';
  ctx.fillText('🧪 MBTI Lab', canvas.width / 2, 1700);

  ctx.font = '32px Pretendard, sans-serif';
  ctx.globalAlpha = 0.8;
  ctx.fillText('나도 테스트 해보기!', canvas.width / 2, 1780);
  ctx.globalAlpha = 1;

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!);
    }, 'image/png');
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + amount));
  return `rgb(${r}, ${g}, ${b})`;
}

export function downloadImage(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
