// This file is a central repository for CPIC Gene Annotations
export const TARGET_VARIANTS = {
  // CYP2D6 (Metabolism) - Vital for Codeine, Tamoxifen
  "rs3892097": {
      gene: "CYP2D6",
      allele: "*4",
      impact: "loss_of_function",
      phenotypeMap: {
          "0/0": "Normal Metabolizer",
          "0/1": "Intermediate Metabolizer",
          "1/1": "Poor Metabolizer"
      }
  },
  "rs1065852": {
      gene: "CYP2D6",
      allele: "*10",
      impact: "decreased_function",
      phenotypeMap: {
          "0/0": "Normal Metabolizer",
          "0/1": "Intermediate Metabolizer",
          "1/1": "Intermediate Metabolizer"
      }
  },

  // CYP2C19 (Plavix, SSRIs)
  "rs12248560": {
      gene: "CYP2C19",
      allele: "*17",
      impact: "increased_function",
      phenotypeMap: {
          "0/0": "Normal Metabolizer",
          "0/1": "Rapid Metabolizer",
          "1/1": "Ultrarapid Metabolizer"
      }
  },
  "rs4244285": {
      gene: "CYP2C19",
      allele: "*2",
      impact: "loss_of_function",
      phenotypeMap: {
          "0/0": "Normal Metabolizer",
          "0/1": "Intermediate Metabolizer",
          "1/1": "Poor Metabolizer"
      }
  },

  // CYP2C9 (Warfarin)
  "rs1799853": {
      gene: "CYP2C9",
      allele: "*2",
      impact: "decreased_function",
      phenotypeMap: {
          "0/0": "Normal Metabolizer",
          "0/1": "Intermediate Metabolizer",
          "1/1": "Poor Metabolizer"
      }
  },

  // SLCO1B1 (Statins)
  "rs4149056": {
      gene: "SLCO1B1",
      allele: "*5",
      impact: "decreased_function",
      phenotypeMap: {
          "0/0": "Normal Function",
          "0/1": "Decreased Function",
          "1/1": "Poor Function"
      }
  },

  // DPYD (Chemotherapy - 5-FU)
  "rs3918290": {
      gene: "DPYD",
      allele: "*2A",
      impact: "loss_of_function",
      phenotypeMap: {
          "0/0": "Normal Metabolizer",
          "0/1": "Intermediate Metabolizer",
          "1/1": "Poor Metabolizer"
      }
  },

  // TPMT (Immunosuppressants)
  "rs1142345": {
      gene: "TPMT",
      allele: "*3A",
      impact: "loss_of_function",
      phenotypeMap: {
          "0/0": "Normal Metabolizer",
          "0/1": "Intermediate Metabolizer",
          "1/1": "Poor Metabolizer"
      }
  }
};

/**
* Parses raw VCF string content into structured genetic data
*/
export function parseVCFContent(vcfContent: string) {
  const lines = vcfContent.split(/\r?\n/);
  const foundVariants: any = {};

  for (const line of lines) {
      if (line.startsWith("#") || !line.trim()) continue;

      const cols = line.split("\t");
      // VCF Standard: CHROM POS ID REF ALT QUAL FILTER INFO FORMAT SAMPLE
      const rsID = cols[2];

      if ((TARGET_VARIANTS as any)[rsID]) {
          let genotype = "0/0"; // Default Wild Type
          if (cols[9]) {
              // Genotype is GT field in Sample column (index 9)
              // Format is usually GT:AD:DP:GQ... e.g. "0/1:..."
              const rawGT = cols[9].split(":")[0];
              genotype = rawGT.replace("|", "/"); // Normalize phased genotypes
          }
          foundVariants[rsID] = genotype;
      }
  }

  const results = [];
  const processedGenes = new Set();

  // Iterate definition map to build complete report
  for (const [rsID, info] of Object.entries(TARGET_VARIANTS)) {
      const userGT = foundVariants[rsID] || "0/0"; 
      const phenotype = (info.phenotypeMap as any)[userGT] || "Normal Metabolizer";

      // Formulate display genotype (e.g., *1/*17)
      let displayGT = "*1/*1"; 
      if (userGT === "0/1") displayGT = `*1/${info.allele}`;
      if (userGT === "1/1") displayGT = `${info.allele}/${info.allele}`;
      if (userGT === "1/2") displayGT = `${info.allele}/?`; 

      // Logic: If we already have an entry for this gene, overwrite ONLY if new finding is more significant?
      // For simplicity in this robust backend, let's include all significant findings but deduplicate by gene for the dashboard view.
      // We will employ a "Priority" system: Poor > Int > Rapid > Normal

      const existingIndex = results.findIndex(r => r.gene === info.gene);

      if (existingIndex === -1) {
          results.push({
              gene: info.gene,
              rsID: rsID,
              genotype: displayGT,
              phenotype: phenotype,
              rawGT: userGT
          });
      } else {
          // Compare significance
          const currentPheno = results[existingIndex].phenotype;
          const priority: any = {
              "Poor Metabolizer": 5,
              "Poor Function": 5,
              "Ultrarapid Metabolizer": 4,
              "Rapid Metabolizer": 4,
              "Intermediate Metabolizer": 3,
              "Decreased Function": 3,
              "Normal Metabolizer": 1,
              "Normal Function": 1
          };

          if ((priority[phenotype] || 0) > (priority[currentPheno] || 0)) {
               results[existingIndex] = {
                  gene: info.gene,
                  rsID: rsID,
                  genotype: displayGT,
                  phenotype: phenotype,
                  rawGT: userGT
              };
          }
      }
  }
  return results;
}
