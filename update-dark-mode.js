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
    } else if (file.endsWith('.tsx') && !file.includes('theme-toggle') && !file.includes('theme-provider')) {
      results.push(file);
    }
  });
  return results;
};

const files = walk('./src/app');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Add TopHeader import if not present and there is a main tag
  if (content.includes('<main') && !content.includes('TopHeader')) {
      content = content.replace(/import \{([^\}]+)\} from "lucide-react";/, 'import { $1 } from "lucide-react";\nimport { TopHeader } from "@/components/header";');
      
      const titleMatches = {
          'dashboard/page.tsx': 'Patient Dashboard',
          'analysis/page.tsx': 'Evidence Console',
          'files/page.tsx': 'Archive Registry',
          'test-cases/page.tsx': 'Validation Suite',
          'faqs/page.tsx': 'Platform FAQs'
      };
      
      let title = "PharmaGuard";
      for (const [key, val] of Object.entries(titleMatches)) {
          if (file.includes(key)) title = val;
      }

      content = content.replace(/(<main[^>]*>)/, `$1\n        <TopHeader title="${title}" />`);
  }

  // Basic styling
  const mapping = {
    'bg-slate-50': 'bg-slate-50 dark:bg-slate-950',
    'bg-white': 'bg-white dark:bg-slate-900',
    'border-slate-200': 'border-slate-200 dark:border-slate-800',
    'border-slate-100': 'border-slate-100 dark:border-slate-800/50',
    'border-slate-50': 'border-slate-50 dark:border-slate-900',
    'text-slate-900': 'text-slate-900 dark:text-slate-100',
    'text-slate-800': 'text-slate-800 dark:text-slate-200',
    'text-slate-700': 'text-slate-700 dark:text-slate-300',
    'text-slate-600': 'text-slate-600 dark:text-slate-400',
    'text-slate-500': 'text-slate-500 dark:text-slate-400',
    'bg-slate-900': 'bg-slate-900 dark:bg-slate-800',
  };

  for (const [key, val] of Object.entries(mapping)) {
    // Only replace if not already replaced
    const regex = new RegExp(`(?<!dark:)(?<!-)${key}(?![\\w-])`, 'g');
    content = content.replace(regex, val);
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
