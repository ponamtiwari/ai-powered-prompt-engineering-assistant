export interface DownloadOptions {
  filename: string;
  content: string;
  format: 'txt' | 'docx';
}

export function downloadAsText(content: string, filename: string = 'enhanced-prompt'): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = `${filename}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

export function downloadAsDocx(content: string, filename: string = 'enhanced-prompt'): void {
  // Create a simple HTML document that can be opened by Word
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${filename}</title>
      <style>
        body { 
          font-family: 'Times New Roman', serif; 
          font-size: 12pt; 
          line-height: 1.5; 
          margin: 1in; 
        }
        h1, h2, h3 { color: #2563eb; }
        pre { 
          background-color: #f8f9fa; 
          padding: 10px; 
          border-radius: 4px; 
          white-space: pre-wrap; 
          font-family: 'Courier New', monospace;
        }
      </style>
    </head>
    <body>
      <h1>Enhanced Prompt</h1>
      <div style="white-space: pre-wrap;">${content.replace(/\n/g, '<br>')}</div>
    </body>
    </html>
  `;
  
  const blob = new Blob([htmlContent], { 
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = `${filename}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

export function generateFilename(prompt: string): string {
  // Create a filename from the first few words of the prompt
  const words = prompt.trim().split(/\s+/).slice(0, 4);
  const filename = words
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .substring(0, 30);
  
  return filename || 'enhanced-prompt';
}