# 🧬 PharmaGuard: Next-Gen Pharmacogenomic AI Platform

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://hackathon-lemon-nine.vercel.app)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black.svg)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-blue.svg)](https://nextjs.org)

**PharmaGuard** is a high-performance clinical decision support system that leverages Genetic Analysis and Generative AI (Gemini) to predict patient drug responses. By parsing standard genomic files (VCF), it provides real-time, personalized medical interpretations to prevent Adverse Drug Reactions (ADRs).

---

## 🚀 Submission Details

- **Project Title**: PharmaGuard
- **Live Demo Link**: [https://hackathon-lemon-nine.vercel.app](https://hackathon-lemon-nine.vercel.app)
- **Backend Repository**: [https://github.com/lacspace/hackathon-backend](https://github.com/lacspace/hackathon-backend)
- **LinkedIn Video Link**: _[Please Insert Your Video Link Here]_
- **Problem Statement**: AI in Healthcare - Pharmacogenomics Interpretation

---

## 🛠️ Tech Stack

### Frontend (User Interface)

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Premium Dark/Glassmorphism Design)
- **Icons**: Lucide React
- **State Management**: React Context (AuthProvider)

### Infrastructure

- **Hosting**: Vercel (Frontend) & AWS EC2 (Backend)
- **SSL**: Let's Encrypt (Certbot)
- **DNS**: sslip.io IP-to-Domain mapping

---

## 🏗️ Architecture Overview

PharmaGuard utilizes a **decoupled Hybrid Architecture** to handle intensive genomic processing:

1.  **Frontend (Vercel)**: A high-speed React layer optimized for clinical data visualization and file uploads.
2.  **Genomic Engine (AWS EC2)**: A dedicated Node.js/Express worker that handles heavy VCF parsing, local drug-database cross-referencing, and AI report generation.
3.  **Intelligence Layer**: Integrated with Google Gemini 1.5 Flash for professional medical interpretation of genetic variants.
4.  **Data Layer**: Supabase (PostgreSQL) for secure patient profiling and variant history.

---

## 📦 Installation & Setup

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/lacspace/hackathon.git
    cd hackathon
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Configure Environment**:
    Create a `.env.local` file:

    ```env
    NEXT_PUBLIC_API_URL=https://3.109.49.214.sslip.io/api
    ```

4.  **Run Development Server**:

    ```bash
    npm run dev
    ```

5.  **Build for Production**:
    ```bash
    npm run build
    ```

---

## 🧪 Usage Examples

### 1. Security Authentication

Authorized personnel only (Master Clinicians).

- **Email**: `admin@lacspace.com`
- **Password**: `Abcd@123.45`

### 2. Genomic Parsing

Upload any standard `.vcf` file (sample files included in root directory). The system will identify SNPs and cross-reference them against CPIC guidelines.

### 3. AI Medical Report

The "View Analysis" button triggers a Gemini AI interpretation and provides biological explanations of enzyme variations (e.g., CYP2D6 Poor Metabolizer).

---

## 👥 Team Members

- **Deep Naraya** (Lead Developer)
- **Abhishek jain** (Full-Stack Engineer)
- **Adarsh Kumar Rai** (Cloud Architect)

---

## 📄 License

This project is part of the **RIFT 2026 Hackathon** submission.
