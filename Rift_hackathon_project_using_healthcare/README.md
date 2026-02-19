# 🧬 PharmaGuard AI

### Genomic Intelligence for Safer Dosing

**PharmaGuard AI** is a professional-grade pharmacogenomics (PGx) platform designed to bridge the gap between raw genomic data and clinical decision-making. By cross-referencing patient VCF files against high-confidence clinical datasets (PharmGKB, CPIC, ClinPGx), the system provides immediate, actionable insights to prevent Adverse Drug Reactions (ADRs) and optimize medication efficacy.

---

## 🚀 Key Features

### 1. High-Fidelity VCF Ingestion

A robust parser that accepts standard `.vcf` and `.txt` genomic files. It automatically identifies clinically relevant variants across major metabolic pathways including **CYP2D6, CYP2C19, TPMT, DPYD,** and more.

### 2. Precision Risk Assessment

Powered by a dynamic knowledge base of over **1,480+ unique medications**. The platform calculates risk scores based on the patient's individual phenotype—identifying poor, intermediate, and ultra-rapid metabolizers with high clinical accuracy.

### 3. AI-Narrated Clinical Reports

Generates structured patient reports that translate complex genetic markers into human-readable narratives. Reports include:

- **Biological Explanations**: Scientific reasoning behind the risk findings.
- **Clinical Interpretations**: Actionable medical advice derived from CPIC/DPWG guidelines.
- **Quality Metrics**: Database certainty and evidence levels (e.g., Level 1A).

### 4. Interactive Evidence Console

A dedicated workspace where clinicians can search any medication to perform a real-time cross-reference against the patient's genetic profile, identifying safer alternatives for high-risk profiles.

### 5. Archive Registry & Portability

A comprehensive database of all historical patient reports, allowing for long-term audits and bulk data export in structured JSON format for research and integration.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Lucide React icons.
- **Backend**: Node.js (ESM), Express.js, TypeScript.
- **Database**: Supabase (PostgreSQL) with JSONB support for clinical profiles.
- **Intelligence**: Integrated with PharmGKB Clinical Variant and Guideline datasets.

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- Supabase Project (URL and Anon Key)

### Installation

1. **Clone the repository**
2. **Setup Backend Environment**:
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5001
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. **Database Migration**:
   Run the following SQL in your Supabase SQL Editor:
   ```sql
   create table profiles (
     id          uuid primary key default gen_random_uuid(),
     name        text not null,
     genes       jsonb not null default '[]'::jsonb,
     file_path   text,
     file_name   text,
     created_at  timestamptz default now(),
     updated_at  timestamptz default now()
   );
   ```
4. **Start Development Servers**:

   **Terminal 1 (Backend)**:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

   **Terminal 2 (Frontend)**:

   ```bash
   npm install
   npm run dev
   ```

---

## 📜 Credits & Acknowledgments

Developed with ❤️ for the **Advanced Health-Tech Hackathon**.

**Special Credits**:

- **Lacspace**: For foundational support and architectural guidance.
- **PharmGKB & CPIC**: For the authoritative genomic datasets that power this platform's intelligence.

---

## ⚖️ Disclaimer

_This platform is a clinical decision-support tool meant for educational and research purposes during the hackathon. It is not intended for diagnostic use without supervision from certified medical genetics professional._
