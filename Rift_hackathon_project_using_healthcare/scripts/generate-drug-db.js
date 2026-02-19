const fs = require('fs');
const path = require('path');
// const glob = require('glob'); // Removed dependency

const GUIDELINE_FOLDER = path.join(__dirname, '../guidelineAnnotations.json');
const OUTPUT_FILE = path.join(__dirname, '../src/data/drug_db.json');

console.log(`📂 Searching for guidelines in: ${GUIDELINE_FOLDER}`);

// Helper to clean HTML
function cleanHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}

// Main logic
try {
  // Find all JSON files - simple readdir since glob might not be installed in devDependencies yet
  // actually, let's use fs.readdirSync
  const files = fs.readdirSync(GUIDELINE_FOLDER).filter(f => f.endsWith('.json'));
  
  console.log(`📂 Found ${files.length} guideline files. Processing...`);

  const drugDb = {};

  files.forEach(file => {
    try {
      const filePath = path.join(GUIDELINE_FOLDER, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      
      const guideline = data.guideline;
      if (!guideline) return;

      // Extract Drug Name from relatedChemicals
      if (guideline.relatedChemicals) {
        guideline.relatedChemicals.forEach(chemical => {
            const drugName = chemical.name;
            if (drugName) {
                // Get summary
                let summaryHtml = '';
                if (guideline.summaryMarkdown) {
                    summaryHtml = typeof guideline.summaryMarkdown === 'string' 
                        ? guideline.summaryMarkdown 
                        : guideline.summaryMarkdown.html;
                }
                
                const cleanAdvice = cleanHtml(summaryHtml);
                
                // Store in DB
                // We might have multiple guidelines for the same drug, preserving the last one or merging?
                // The python notebook just overwrites. We will do the same for now.
                drugDb[drugName] = {
                    gene: "See CPIC", // Placeholder as per notebook
                    advice: cleanAdvice,
                    source: "CPIC Guidelines",
                    guidelineName: guideline.name,
                    url: guideline.url || ""
                };
            }
        });
      }
    } catch (err) {
      console.error(`Error processing ${file}: ${err.message}`);
    }
  });

  // Ensure output dir exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(drugDb, null, 2));
  console.log(`✅ SUCCESS! Saved ${Object.keys(drugDb).length} drugs to 'src/data/drug_db.json'.`);

} catch (err) {
  console.error('❌ Error generating DB:', err);
  process.exit(1);
}
