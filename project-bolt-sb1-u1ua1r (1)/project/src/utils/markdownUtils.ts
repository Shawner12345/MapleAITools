interface PdfContentItem {
  type: 'heading' | 'paragraph' | 'list-item';
  text: string;
  level?: number;
  height: number;
}

export function markdownToPdfContent(markdown: string): PdfContentItem[] {
  const lines = markdown.split('\n');
  const content: PdfContentItem[] = [];

  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    // Headers
    const headerMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      content.push({
        type: 'heading',
        text: headerMatch[2],
        level: headerMatch[1].length,
        height: 10 + headerMatch[1].length // Larger spacing for headers
      });
      return;
    }

    // List items
    if (trimmedLine.match(/^[-*+]\s+(.+)$/)) {
      content.push({
        type: 'list-item',
        text: '• ' + trimmedLine.replace(/^[-*+]\s+/, ''),
        height: 7
      });
      return;
    }

    // Regular paragraphs
    content.push({
      type: 'paragraph',
      text: trimmedLine,
      height: 7
    });
  });

  return content;
}