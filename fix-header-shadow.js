const fs = require('fs');

let file = './src/components/header.tsx';
let content = fs.readFileSync(file, 'utf8');
let original = content;

content = content.replace(/className="([^"]*shadow-[a-z0-9]+[^"]*)"/g, (match, cls) => {
    if (!cls.includes('dark:shadow-none')) {
        return `className="${cls} dark:shadow-none"`;
    }
    return match;
});

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
  console.log('Fixed header shadows & colors.');
}
