// @ts-nocheck
// This is required because pdfjs-dist is not typed for browser usage via CDN
declare const pdfjsLib: any;

export async function readFileContent(file: File): Promise<{ name: string, content: string }> {
  const name = file.name;
  switch (file.type) {
    case 'application/pdf':
      return { name, content: await parsePdf(file) };
    case 'text/plain':
    case 'text/markdown':
      return { name, content: await file.text() };
    default:
      // Try reading as text as a fallback for unknown types like .md
      if (file.name.endsWith('.md')) {
        return { name, content: await file.text() };
      }
      throw new Error(`Unsupported file type: ${file.type || 'unknown'}`);
  }
}

async function parsePdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  const numPages = pdf.numPages;
  let fullText = '';

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n\n';
  }

  return fullText;
}

export async function parseGoogleDriveFile(file: { name: string; content: ArrayBuffer; mimeType: string; }): Promise<{ name: string, content: string }> {
    const { name, content, mimeType } = file;
    switch (mimeType) {
        case 'application/pdf':
            const pdf = await pdfjsLib.getDocument(content).promise;
            const numPages = pdf.numPages;
            let fullText = '';
            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                fullText += pageText + '\n\n';
            }
            return { name, content: fullText };
        case 'text/plain':
        case 'text/markdown':
            return { name, content: new TextDecoder().decode(content) };
        default:
            throw new Error(`Unsupported file type from Google Drive: ${mimeType}`);
    }
}
