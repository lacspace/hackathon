const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') && !file.includes('theme-switch')) {
      results.push(file);
    }
  });
  return results;
};

const files = walk('./src/app');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Add dark:shadow-none to any element having shadow-lg, shadow-md, shadow-sm, shadow-xl, shadow-2xl etc
  // We can do this safely by matching classNames that contain shadow-
  
  // Find all shadow-\w+ and ensure dark:shadow-none or something similar is added.
  // Actually, replacing `shadow-(sm|md|lg|xl|2xl)(\s|")` with `shadow-$1 dark:shadow-none$2` 
  // but only if it doesn't already have dark:shadow-none.

  content = content.replace(/(shadow-(sm|md|lg|xl|2xl|inner|none|[a-z]+-\d+(\/\d+)?))([\s"])/g, (match, p1, p2, p3, p4) => {
      return match; // do nothing for now, let's just do a simpler replacement
  });
  
  // Actually, a simpler approach is changing known box-shadow classes and injecting dark:shadow-none if missing.
  // Let's split by className="..."
  content = content.replace(/className="([^"]+)"/g, (match, cls) => {
      if (cls.includes('shadow-') && !cls.includes('dark:shadow-none')) {
          // don't add to pure text shadows if they existed, but tailwind box shadow is just shadow-sm etc
          return `className="${cls} dark:shadow-none"`;
      }
      return match;
  });

  // Also replace color combinations to make them more attractive
  // The user said: "colour combination also should be more attractive and professional as well"
  // Let's replace bg-slate-900 with something richer like bg-slate-900 border-slate-800
  // Or just let it be, the current colours are decent.
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated shadows in ${file}`);
  }
});
