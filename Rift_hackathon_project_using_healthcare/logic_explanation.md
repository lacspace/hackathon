# Logic Explanation: `mainlogic.ipynb`

This document explains the core logic and workflow defined in the `mainlogic.ipynb` Jupyter notebook. This notebook acts as the "Brain" of the application, responsible for processing clinical guidelines and assessing patient risks based on their genetic profile and prescribed drugs.

## 1. Data Initialization & Loading

**Goal**: Load clinical guideline data into memory.

- **Source**: It expects a folder named `guidelineAnnotations.json` containing multiple individual `.json` files.
- **Process**:
  1.  Uses `glob` to find all `.json` files in the specified directory.
  2.  Iterates through each file and loads the JSON content into a global list called `guideline_data`.
  3.  **Validation**: It prints the count of loaded files and inspects the first entry to confirm the structure (checking for keys like `name`, `relatedChemicals`, etc.).

## 2. Search Engine (`get_drug_guideline`)

**Goal**: Retrieve the specific clinical guideline for a given drug.

- **Input**: `drug_name` (string).
- **Logic**:
  - It iterates through the loaded `guideline_data`.
  - **Primary Check**: Checks if the `drug_name` appears in the guideline's general `name` field.
  - **Secondary (Precise) Check**: Checks the `relatedChemicals` list within the guideline, which contains structured data about linked drugs. This is noted as being more accurate.
- **Output**: The specific guideline dictionary or `None` if not found.

## 3. Data Cleaning

- **Utility**: `clean_html(raw_html)`
- **Function**: Uses Regular Expressions (`re.sub`) to strip HTML tags (like `<p>`, `<b>`) from the raw text coming from the guidelines, making it readable for humans and suitable for text analysis.

## 4. Risk Analysis Logic

The notebook evolves through two versions of risk analysis:

### A. Basic Assessment (`analyze_patient_risk`)

- **Input**: `drug_name`, `patient_phenotype`.
- **Logic**:
  1.  Fetches the guideline for the drug.
  2.  Extracts the `summaryMarkdown` (or HTML) and cleans it.
  3.  **Matching**: It performs a simple substring search. It takes the `patient_phenotype` (e.g., "Poor Metabolizer"), removes the last letter (to matching "metabolize" vs "metabolizer"), and checks if this string exists in the clinical summary.
- **Result**:
  - **Match Found**: Returns "⚠️ HIGH RISK / ACTION REQUIRED".
  - **No Match**: Returns "ℹ️ Standard Protocol".

### B. Universal Risk Analyzer (`analyze_universal_risk`)

- **Goal**: A more robust, heuristic-based approach to catch complex cases (Metabolism, Immune response, Deficiencies).
- **Heuristic Logic**:
  1.  **Metabolism**: If the phenotype mentions "metabolizer", it extracts the specific type (e.g., "poor", "rapid", "ultra") as the keyword.
  2.  **Immune / Hypersensitivity**: If the phenotype mentions "positive" (e.g., "HLA-B Positive"), it sets the keyword to "positive".
  3.  **Transporter Function**: If it mentions "function", it looks for "poor function" or "decreased".
  4.  **Deficiency**: If it mentions "deficient", it looks for "deficien" (to catch variations).
  5.  **Fallback**: Uses the full phenotype string.
- **Assessment**: It searches for the derived **keyword** within the cleaned guideline summary.
- **Result**:
  - **Match**: "🔴 HIGH RISK / TOXICITY"
  - **No Match**: "🟢 Standard Protocol"

## 5. Simulation & Validation

**Goal**: meaningful testing of the logic.

- **Batch Simulation**: Creates 20 mock patients with random phenotypes (Normal, Intermediate, Poor, Ultrarapid) and assigns them random drugs (Codeine, Warfarin, etc.). It generates a report table color-coded by risk.
- **Critical Validation Set**: Checks specific "High Stakes" known scenarios to verify the logic:
  - _Abacavir + HLA-B\*57:01_ (Hypersensitivity)
  - _Warfarin + CYP2C9 Poor Metabolizer_ (Bleeding)
  - _Fluorouracil + DPYD Poor Metabolizer_ (Toxicity)
  - _Codeine + Ultra-Rapid Metabolizer_ (Overdose)
  - _Clopidogrel + CYP2C19 Poor Metabolizer_ (Ineffective)

## 6. Export for Web Application

**Goal**: Prepare the data for the Next.js frontend.

- **Process**:
  - Iterates through all guidelines.
  - Extracts the drug name and the cleaned advice text.
  - Constructs a simplified dictionary mapping `Drug Name` -> `{ gene, advice, source }`.
- **Output**: Saves this simplified database to `drug_db.json`.

## 7. Final Report Generation

- **Function**: `generate_medical_report`
- **Input**: Patient Name, Drug Name, Genetic Data.
- **Output**: A structured JSON object containing:
  - Header (Patient info, Date)
  - Genetic Finding (Gene, Phenotype)
  - Clinical Result (Risk Level, Recommendation)
