import express, { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import Profile from '../models/Profile';
import { parseVCFContent } from '../utils/vcfParser';

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
    destination(req, file, cb) {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(vcf|txt)$/)) {
            return cb(new Error('Please upload a VCF or TXT file'));
        }
        cb(null, true);
    }
});

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a VCF file for genomic analysis
 *     tags: [Upload]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               vcf:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File processed successfully
 *       400:
 *         description: Bad Request
 */
router.post('/', upload.single('vcf'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log(`📂 Processing VCF: ${req.file.originalname}`);

        const filePath = req.file.path;
        const fileContent = fs.readFileSync(filePath, 'utf8');

        // Parse Logic
        const geneticData = parseVCFContent(fileContent);

        // Create Profile in DB
        const newProfile = await Profile.create({
            name: `Patient ${new Date().toLocaleDateString()}`, 
            genes: geneticData
        });

        // Cleanup
        fs.unlinkSync(filePath);

        res.status(201).json({
            message: 'Genomic analysis complete',
            profileId: newProfile._id,
            genes: geneticData
        });
    } catch (error: any) {
        console.error('❌ Upload Error:', error.message);
        res.status(500).json({ error: 'Server error processing file' });
    }
});

export default router;
