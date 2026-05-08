import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Đường dẫn tới thư mục dự án
const projectRoot = process.cwd();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get('name');

  if (!fileName) {
    return new NextResponse('Missing file name', { status: 400 });
  }

  // Hàm đệ quy để tìm file trong thư mục public/attachments
  const findFile = (dir: string, targetName: string): string | null => {
    if (!fs.existsSync(dir)) return null;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        const found = findFile(fullPath, targetName);
        if (found) return found;
      } else if (file === targetName) {
        return fullPath;
      }
    }
    return null;
  };

  try {
    const filePath = findFile(path.join(projectRoot, 'public/attachments'), fileName);

    if (!filePath) {
      return new NextResponse('File not found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const extension = path.extname(filePath).toLowerCase();
    
    let contentType = 'image/png';
    if (extension === '.jpg' || extension === '.jpeg') contentType = 'image/jpeg';
    if (extension === '.gif') contentType = 'image/gif';
    if (extension === '.svg') contentType = 'image/svg+xml';
    if (extension === '.webp') contentType = 'image/webp';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return new NextResponse('Error fetching file', { status: 500 });
  }
}
