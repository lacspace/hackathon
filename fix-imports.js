const fs = require('fs');

const filesToFix = [
  'src/app/dashboard/page.tsx',
  'src/app/analysis/page.tsx',
  'src/app/faqs/page.tsx',
  'src/app/files/page.tsx',
  'src/app/test-cases/page.tsx'
];

filesToFix.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/@\/components\/header/g, '../../components/header');
  fs.writeFileSync(file, content);
  console.log(`Fixed import in ${file}`);
});
