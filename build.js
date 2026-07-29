const fs = require('fs');
const path = require('path');

const shortcuts = JSON.parse(fs.readFileSync('./shortcuts.json', 'utf8'));

function generateShortcutHtml(item) {
  let actionScript = '';

  if (item.type === 'person') {
    // Action for typing into search bar (e.g. for yourself)
    actionScript = `
        const searchInput = document.getElementById('ug_filter');
        if (searchInput) {
          searchInput.focus();
          searchInput.click();
          searchInput.value = ${JSON.stringify(item.target)};
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
          searchInput.dispatchEvent(new Event('change', { bubbles: true }));
          
          setTimeout(() => {
            const th = Array.from(document.querySelectorAll('th'))
              .find(th => th.innerText.includes(${JSON.stringify(item.target)}));
            if (th) {
              th.click();
              th.querySelector('span')?.click();
            }
          }, 300);
        }
    `;
  } else {
    // Action for direct group selection from the list
    actionScript = `
        const th = Array.from(document.querySelectorAll('th'))
          .find(th => th.innerText.includes(${JSON.stringify(item.target)}));
        if (th) {
          th.click();
          th.querySelector('span')?.click();
        }
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${item.title}</title>
  <link rel="icon" href="https://fav.farm/${encodeURIComponent(item.icon)}">
</head>
<body>
  <script>
    (function(){
      /* 1. Click "Assigned to Group" button */
      Array.from(document.querySelectorAll('button'))
        .find(b => b.innerText.includes('Assigned to Group'))
        ?.click();
      
      /* 2. Execute assignment logic */
      setTimeout(() => {
        ${actionScript}
      }, 500);
    })();
  </script>
</body>
</html>`;
}

// 1. Generate individual folders/files
shortcuts.forEach(item => {
  const dir = path.join(__dirname, item.slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  
  fs.writeFileSync(path.join(dir, 'index.html'), generateShortcutHtml(item));
  console.log(`Generated: /${item.slug}/index.html`);
});

// 2. Generate central dashboard
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
