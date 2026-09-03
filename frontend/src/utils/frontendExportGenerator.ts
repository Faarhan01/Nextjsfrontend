export interface ExportFile {
  path: string;
  code: string;
}

export function generateFrontendExportFiles(storeName: string = 'Mrbulk', templateCode: string = ''): ExportFile[] {
  return [
    {
      path: 'index.html',
      code: templateCode || `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${storeName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-900 font-sans">
  <div class="min-h-screen flex items-center justify-center">
    <h1 class="text-3xl font-bold">${storeName}</h1>
  </div>
</body>
</html>`
    },
    {
      path: 'README.md',
      code: `# ${storeName} Frontend Export\n\nStandalone HTML storefront ready for deployment.`
    }
  ];
}
