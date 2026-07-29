const fs = require('fs');
const path = require('path');

const shortcuts = JSON.parse(fs.readFileSync('./shortcuts.json', 'utf8'));

// 1. Helper to generate raw javascript: bookmarklet string
function generateBookmarkletCode(item) {
  if (item.type === 'person') {
    return `javascript:(function(){Array.from(document.querySelectorAll('button')).find(b=>b.innerText.includes('Assigned to Group'))?.click();setTimeout(()=>{const input=document.getElementById('ug_filter');if(input){input.focus();input.click();input.value=${JSON.stringify(item.target)};input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));setTimeout(()=>{const th=Array.from(document.querySelectorAll('th')).find(th=>th.innerText.includes(${JSON.stringify(item.target)}));if(th){th.click();th.querySelector('span')?.click();}},300);}},500);})();`;
  } else {
    return `javascript:(function(){Array.from(document.querySelectorAll('button')).find(b=>b.innerText.includes('Assigned to Group'))?.click();setTimeout(()=>{const th=Array.from(document.querySelectorAll('th')).find(th=>th.innerText.includes(${JSON.stringify(item.target)}));if(th){th.click();th.querySelector('span')?.click();}},500);})();`;
  }
}

// 2. Helper to generate HTML redirect page
function generateShortcutHtml(item) {
  const code = generateBookmarkletCode(item);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${item.title}</title>
  <link rel="icon" href="https://fav.farm/${encodeURIComponent(item.icon)}">
</head>
<body>
  <script>${code.replace(/^javascript:/, '')}</script>
</body>
</html>`;
}

// 3. Generate individual folders/files for each shortcut
shortcuts.forEach(item => {
  const dir = path.join(__dirname, item.slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  
  fs.writeFileSync(path.join(dir, 'index.html'), generateShortcutHtml(item));
  console.log(`Generated: /${item.slug}/index.html`);
});

// 4. Generate central HTML dashboard
const dashboardHtml = `<!DOCTYPE html>
<html>
<head>
  <title>Assignment Shortcuts</title>
  <link rel="icon" href="https://fav.farm/⚡">
  <style>
    body { font-family: system-ui, sans-serif; padding: 2rem; max-width: 500px; margin: auto; }
    a { display: block; padding: 12px; margin: 8px 0; background: #f4f4f5; text-decoration: none; color: #18181b; border-radius: 6px; font-weight: 500; }
    a:hover { background: #e4e4e7; }
  </style>
</head>
<body>
  <h2>⚡ Quick Assign Shortcuts</h2>
  ${shortcuts.map(s => `<a href="./${s.slug}/">${s.icon} ${s.title}</a>`).join('\n  ')}
</body>
</html>`;

fs.writeFileSync('index.html', dashboardHtml);
console.log('Generated: index.html dashboard');

// 5. Generate README.md with copy-paste bookmarklet code blocks
const readmeContent = `# ⚡ Assignment Shortcuts

This repository automatically generates hosted shortcuts and raw bookmarklets based on \`shortcuts.json\`.

## 📌 Direct Bookmarklets (Copy & Paste)

If you want to paste the code directly into your browser's URL field for standard bookmarklets, copy the code blocks below:

${shortcuts.map(item => `
### ${item.icon} ${item.title}
* **Type:** \`${item.type}\`
* **Target:** \`${item.target}\`

\`\`\`javascript
${generateBookmarkletCode(item)}
\`\`\`
`).join('\n---\n')}
`;

fs.writeFileSync('README.md', readmeContent);
console.log('Generated: README.md with bookmarklet code');
