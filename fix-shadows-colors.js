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

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Add dark:shadow-none to any element having shadow
  content = content.replace(/className="([^"]*shadow-[a-z0-9]+[^"]*)"/g, (match, cls) => {
      if (!cls.includes('dark:shadow-none')) {
          return `className="${cls} dark:shadow-none"`;
      }
      return match;
  });

  // Make colors more attractive and premium (deep navy, rich indigo for dark mode)
  // Instead of slate-950, let's use a very deep beautiful blue/slate.
  // Tailwind bg-slate-950 is good, but we can update accent colors.
  const mapping = {
    'bg-sky-600': 'bg-indigo-600 dark:bg-indigo-500',
    'text-sky-600': 'text-indigo-600 dark:text-indigo-400',
    'bg-sky-50': 'bg-indigo-50 dark:bg-indigo-900/20',
    'border-sky-200': 'border-indigo-200 dark:border-indigo-800',
    'shadow-sky-100': 'shadow-indigo-100',
    'shadow-sky-200': 'shadow-indigo-200',
  };

  for (const [key, val] of Object.entries(mapping)) {
      const regex = new RegExp(`(?<!dark:)(?<!-)${key}(?![\\w-])`, 'g');
      content = content.replace(regex, val);
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated shadows & colors in ${file}`);
  }
});
