import drugDbData from '../data/drug_db.json';

// Define types for our data
interface DrugGuideline {
  gene: string;
  advice: string;
  source: string;
  guidelineName?: string;
  url?: string;
}

const drugDb: Record<string, DrugGuideline> = drugDbData as any;

export interface RiskAnalysisResult {
  drug: string;
  phenotype: string;
  assessment: string; // 'Safe', 'Adjust Dose', 'Toxic', 'Unknown'
  guidance: string;
  source: string;
}

/**
 * Heuristic-based risk analyzer ported from mainlogic.ipynb
 */
export function analyzeUniversalRisk(drugName: string, patientPhenotype: string): RiskAnalysisResult {
  const guideline = drugDb[drugName];

  if (!guideline) {
    return {
      drug: drugName,
      phenotype: patientPhenotype,
      assessment: 'Unknown',
      guidance: `No CPIC data found for ${drugName}`,
      source: 'N/A'
    };
  }

  const cleanSummary = guideline.advice.toLowerCase();
  const patientStatus = patientPhenotype.toLowerCase();
  let keyword = patientStatus;

  // Logic A: Metabolism
  if (patientStatus.includes("metabolizer")) {
     // Extract "poor", "rapid", "ultra", "intermediate"
     const parts = patientStatus.split(" ");
     keyword = parts[0]; 
  }
  // Logic B: Immune / Hypersensitivity
  else if (patientStatus.includes("positive")) {
      keyword = "positive";
  }
  // Logic C: Transporter Function
  else if (patientStatus.includes("function")) {
      if (patientStatus.includes("poor")) keyword = "poor function";
      else if (patientStatus.includes("decreased")) keyword = "decreased";
  }
  // Logic D: Deficiency
  else if (patientStatus.includes("deficient")) {
      keyword = "deficien"; // catch deficient/deficiency
  }

  // Check for match
  let riskLevel = "🟢 Safe";
  if (cleanSummary.includes(keyword)) {
      // If the keyword (e.g. "poor", "ultra") is found in the advice, it generally means there's a specific recommendation/warning
      // We can refine this based on the context, but following the notebook:
      // "Match Found" -> HIGH RISK
      riskLevel = "🔴 Toxic"; // Or "Adjust Dose" ? Notebook said "HIGH RISK / ACTION REQUIRED" or "TOXICITY"
      
      // Let's try to be a bit more granular if possible, but the notebook logic was binary (Match = High Risk)
      // We can add "Intermediate" check if we want
      if (patientStatus.includes("intermediate")) {
          riskLevel = "🟡 Adjust Dose";
      } else if (patientStatus.includes("poor") || patientStatus.includes("ultra") || patientStatus.includes("rapid")) {
          riskLevel = "🔴 Toxic"; 
      }
  } else {
      riskLevel = "🟢 Safe";
  }

  return {
    drug: drugName,
    phenotype: patientPhenotype,
    assessment: riskLevel,
    guidance: guideline.advice, // Return full advice or snippet? Frontend can truncate.
    source: guideline.source
  };
}

export function getDrugList(): string[] {
    return Object.keys(drugDb).sort();
}
