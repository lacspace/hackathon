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
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
};

const files = walk('./src/app');

const replacements = [
  // Backgrounds
  { from: /bg-slate-50/g, to: 'bg-background' },
  { from: /bg-white/g, to: 'bg-card' },
  { from: /dark:bg-slate-900/g, to: 'dark:bg-card' },
  { from: /dark:bg-slate-950/g, to: 'dark:bg-background' },
  
  // Text Colors - Primary
  { from: /text-slate-900/g, to: 'text-foreground' },
  { from: /text-slate-800/g, to: 'text-foreground' },
  { from: /dark:text-slate-100/g, to: 'dark:text-foreground' },
  { from: /dark:text-slate-200/g, to: 'dark:text-foreground' },
  { from: /dark:text-white/g, to: 'dark:text-foreground' },
  
  // Text Colors - Muted
  { from: /text-slate-500/g, to: 'text-muted-foreground' },
  { from: /text-slate-400/g, to: 'text-muted-foreground' },
  { from: /dark:text-slate-400/g, to: 'dark:text-muted-foreground' },
  { from: /dark:text-slate-500/g, to: 'dark:text-muted-foreground' },
  
  // Border
  { from: /border-slate-200/g, to: 'border-border' },
  { from: /dark:border-slate-800/g, to: 'dark:border-border' },
  { from: /border-slate-100/g, to: 'border-border/50' },
  
  // Cleanup duplicate dark classes
  { from: /dark:bg-background\s+dark:bg-background/g, to: 'dark:bg-background' },
  { from: /dark:text-foreground\s+dark:text-foreground/g, to: 'dark:text-foreground' },
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated theme classes in ${file}`);
  }
});
