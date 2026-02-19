export interface FAQ {
  question: string;
  answer: string;
  category: string;
}

export const faqs: FAQ[] = [
  // General Platform
  {
    category: "General",
    question: "What is PharmaGuard AI?",
    answer: "PharmaGuard AI is a clinical-grade precision medicine platform that analyzes genomic data (VCF/TXT) to predict drug-gene interactions based on CPIC guidelines."
  },
  {
    category: "General",
    question: "Who is this platform for?",
    answer: "The platform is designed for clinicians, pharmacists, and medical researchers who need to cross-reference genetic profiles with drug metabolism pathways for precision dosing."
  },
  {
    category: "General",
    question: "Do I need special hardware to run the analyzer?",
    answer: "No, PharmaGuard is a cloud-native application. All heavy computational genomic mapping and AI synthesis are performed on our secure servers."
  },
  {
    category: "General",
    question: "Is PharmaGuard FDA approved?",
    answer: "PharmaGuard acts as a Clinical Decision Support (CDS) tool. It provides evidence-based suggestions based on FDA-labeled warnings and CPIC guidelines, but is not a replacement for professional clinical judgment."
  },
  {
    category: "General",
    question: "What is the primary goal of the system?",
    answer: "Our primary goal is to prevent Adverse Drug Reactions (ADRs) - specifically dose-related toxicity or therapeutic failure caused by genetic metabolic variations."
  },

  // Genetics & Biomarkers
  {
    category: "Genetics",
    question: "What genetic markers are supported?",
    answer: "We support critical biomarkers including CYP2D6, CYP2C19, DPYD, TPMT, SLCO1B1, and HLA-B, covering over 50+ high-risk clinical drugs."
  },
  {
    category: "Genetics",
    question: "Does the system support whole genome sequencing (WGS)?",
    answer: "Currently, we focus on targeted clinical variants (SNPs) found in VCF files. However, our parser is capable of extracting specific markers from WGS-originated VCF datasets."
  },
  {
    category: "Genetics",
    question: "How are phenotypes determined?",
    answer: "Phenotypes (e.g., Poor Metabolizer, Ultra-rapid Metabolizer) are assigned using standard star-allele nomenclature mapping provided by PharmVar and CPIC standards."
  },
  {
    category: "Genetics",
    question: "What is CYP2D6 and why is it important?",
    answer: "CYP2D6 is a key cytochrome P450 enzyme responsible for metabolizing approximately 25% of all clinical drugs, including antidepressants, antipsychotics, and prodrug opioids like codeine."
  },
  {
    category: "Genetics",
    question: "How does the system handle HLA genotypes?",
    answer: "HLA markers are critical for predicting hypersensitivity reactions. For example, HLA-B*57:01 status is assessed to determine Abacavir hypersensitivity risk."
  },
  {
    category: "Genetics",
    question: "What is the significance of the VKORC1 gene?",
    answer: "VKORC1 variants significantly impact sensitivity to Warfarin. The system uses this alongside CYP2C9 status to suggest personalized anticoagulation starting doses."
  },
  {
    category: "Genetics",
    question: "Can the system predict response to Statins?",
    answer: "Yes, specifically via the SLCO1B1 gene analysis, which determines the risk of statin-associated muscle symptoms (SAMS)."
  },
  {
    category: "Genetics",
    question: "What about oncology drugs?",
    answer: "We support TPMT and NUDT15 analysis for thiopurines, and DPYD analysis for fluoropyrimidines like 5-FU and Capecitabine."
  },
  {
    category: "Genetics",
    question: "What is a SNP?",
    answer: "A Single Nucleotide Polymorphism (SNP) is a variation in a single DNA base pair. These are the primary variants analyzed by the PharmaGuard engine."
  },
  {
    category: "Genetics",
    question: "How does the system handle 'unknown' variants?",
    answer: "If a variant is detected but not present in the current CPIC patch, it is marked as 'Unannotated' or 'Standard' to prevent false clinical positives."
  },

  // Clinical Practice
  {
    category: "Clinical",
    question: "How accurate is the AI Analysis?",
    answer: "Our AI (Gemini 2.0) acts as a synthesizer for clinical evidence. It maps variants to CPIC assigned phenotypes and extracts evidence-based dosage guidance with Level 1A/1B certainty."
  },
  {
    category: "Clinical",
    question: "Can I directly modify the dose in the dashboard?",
    answer: "The dashboard provides recommendations. Final dose adjustments must be performed within your primary EMR or e-prescribing system."
  },
  {
    category: "Clinical",
    question: "What is a 'Prodrug' risk?",
    answer: "Poor metabolizers for genes like CYP2D6 cannot effectively convert prodrugs (like Codeine) into their active form (Morphine), leading to therapeutic failure."
  },
  {
    category: "Clinical",
    question: "Explain Level 1A evidence.",
    answer: "Level 1A evidence implies the gene-drug interaction is widely supported by randomized clinical trials and has a published guideline with specific actionable dosing."
  },
  {
    category: "Clinical",
    question: "Does the system account for age or weight?",
    answer: "The current version focuses strictly on pharmacogenomics. Environmental factors like age or kidney function should be used in conjunction with our PGx insights."
  },
  {
    category: "Clinical",
    question: "How often are the clinical guidelines updated?",
    answer: "Guidelines are synchronized with the CPIC database monthly. New patches are automatically applied to the PharmaGuard evidence engine."
  },
  {
    category: "Clinical",
    question: "What is the Risk Index score?",
    answer: "The Risk Index (0-100) is a weighted calculation based on the number and severity of actionable PGx variants found in a patient's profile."
  },
  {
    category: "Clinical",
    question: "Can the reports be exported?",
    answer: "Yes, reports can be exported to PDF or structured JSON for integration into existing medical records."
  },
  {
    category: "Clinical",
    question: "How do I interpret 'Monitor Closely'?",
    answer: "This status indicates an intermediate risk where standard dosing may be used with increased clinical frequency of side-effect monitoring."
  },
  {
    category: "Clinical",
    question: "Can I search for specific drugs?",
    answer: "Yes, use the Evidence Console to search for any medication to see if it has a documented genetic interaction with the current patient."
  },

  // Security & Privacy
  {
    category: "Security",
    question: "Is data stored securely?",
    answer: "Yes, all genomic metadata is encrypted and stored in a secure Supabase instance. Personal identifying information is decoupled from genetic markers using Clinical UIDs."
  },
  {
    category: "Security",
    question: "Is the platform HIPAA compliant?",
    answer: "PharmaGuard is built with HIPAA-level security protocols, including end-to-end encryption, audit logs, and SOC2 compliant hosting."
  },
  {
    category: "Security",
    question: "Can I delete patient data?",
    answer: "Yes, our 'Purge Session' and individual 'Delete' functions ensure that genomic data is permanently removed from our active databases upon request."
  },
  {
    category: "Security",
    question: "Who has access to the uploaded VCF files?",
    answer: "Only the authenticated physician or researcher who uploaded the file has access to the clinical insights derived from it."
  },
  {
    category: "Security",
    question: "Is the AI trained on my patient data?",
    answer: "No. We use zero-retention AI processing. Your patient data is never used to train or refine underlying language models."
  },
  {
    category: "Security",
    question: "Where are the servers located?",
    answer: "Our primary infrastructure is hosted on AWS/Google Cloud regions that support medical-grade data residency requirements."
  },
  {
    category: "Security",
    question: "Does the system track my search history?",
    answer: "We log searches for clinical audit purposes (to show who accessed what record), but search queries are not sold or shared with third parties."
  },
  {
    category: "Security",
    question: "What encryption standards are used?",
    answer: "We use AES-256 for data at rest and TLS 1.3 for all data in transit between the client and our API."
  },
  {
    category: "Security",
    question: "Can I use the platform without an account?",
    answer: "No, a valid clinician or researcher account is required to ensure an encrypted audit trail for every patient analysis."
  },
  {
    category: "Security",
    question: "How do I reset my security key?",
    answer: "Security keys can be managed via the Physician Profile section after successful MFA verification."
  },

  // Technical & Integration
  {
    category: "Technical",
    question: "How do I use a VCF file?",
    answer: "Simply upload your .vcf or .txt genotype record on the landing page. Our parser will automatically extract the relevant SNPs and genotypes for analysis."
  },
  {
    category: "Technical",
    question: "Which VCF versions are supported?",
    answer: "We support VCF v4.0, v4.1, and v4.2 specifications. Minimal headers are required for successful parsing."
  },
  {
    category: "Technical",
    question: "Can I integrate PharmaGuard with Epic or Cerner?",
    answer: "Integration is possible via our REST API. We support FHIR (Fast Healthcare Interoperability Resources) for seamless EMR data exchange."
  },
  {
    category: "Technical",
    question: "What language is the analyzer written in?",
    answer: "The core PGx engine is written in TypeScript, leveraging React/Next.js for the interface and specialized Python scripts for heavy genomic parsing."
  },
  {
    category: "Technical",
    question: "Is there a public API?",
    answer: "Yes, we offer an API for research institutions. Access requires an Enterprise API Key and institutional vetting."
  },
  {
    category: "Technical",
    question: "How fast is the analysis?",
    answer: "Initial VCF parsing and marker identification typically take less than 3 seconds for a standard 10MB clinical VCF file."
  },
  {
    category: "Technical",
    question: "Does the platform support dark mode?",
    answer: "Yes, PharmaGuard features a premium dark mode designed with healthcare environments in mind to reduce eye strain during late-shift analysis."
  },
  {
    category: "Technical",
    question: "What if the VCF file is corrupted?",
    answer: "Our parser includes a robust error check. If a file is malformed, you will receive a 'VCF Syntax Alert' with the specific line number causing the issue."
  },
  {
    category: "Technical",
    question: "How are notifications triggered?",
    answer: "Notifications are triggered by clinical actions, such as successful VCF parsing, high-risk marker detection, or guideline updates."
  },
  {
    category: "Technical",
    question: "Can I use the platform on a tablet?",
    answer: "Yes, the interface is fully responsive and optimized for iPad and other high-resolution clinical tablets."
  },

  // AI & Automation
  {
    category: "AI",
    question: "What role does AI play in the system?",
    answer: "AI is used to synthesize complex genomic findings into plain-language clinical insights and to answer follow-up questions about rare variants."
  },
  {
    category: "AI",
    question: "Can I trust AI for medical dosing?",
    answer: "AI should be treated as a Research Assistant. All dosing data is pulled from the CPIC database; the AI simply helps summarize it for faster interpretation."
  },
  {
    category: "AI",
    question: "How does the 'Auto-Analyze' feature work?",
    answer: "It iterates the patient's entire genetic profile against our database of 200+ drugs simultaneously to find any potential risks you might have missed."
  },
  {
    category: "AI",
    question: "What AI model is being used?",
    answer: "We utilize Google's Gemini 2.0 Flash models via a secure, enterprise-grade clinical pipeline."
  },
  {
    category: "AI",
    question: "Can I ask the AI custom questions?",
    answer: "Yes, the AI Support Chat is available to answer specific queries about genotypes, phenotypes, and clinical pathways."
  },

  // Platform Roadmap
  {
    category: "Roadmap",
    question: "Will the system support Polygenic Risk Scores (PRS)?",
    answer: "PRS support for complex diseases like cardiovascular risk is currently in our development roadmap for Q4 2026."
  },
  {
    category: "Roadmap",
    question: "Are you adding more genes?",
    answer: "We are currently validating markers for CYP2B6, CYP3A5, and G6PD for inclusion in the next major patch."
  },
  {
    category: "Roadmap",
    question: "Is a mobile app coming?",
    answer: "A specialized 'Physician Alert' mobile app for iOS and Android is in the final testing phase."
  },
  {
    category: "Roadmap",
    question: "Will there be multi-user collaboration?",
    answer: "Yes, 'Team Workspaces' allowing multiple physicians to view the same patient report will be available in the next Pro update."
  },
  {
    category: "Roadmap",
    question: "Does PharmaGuard support multi-language reports?",
    answer: "Currently we support English and Spanish. German and French localizations are planned for late 2026."
  }
];
