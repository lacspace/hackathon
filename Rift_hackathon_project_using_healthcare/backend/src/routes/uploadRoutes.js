"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Profile_1 = __importDefault(require("../models/Profile"));
const vcfParser_1 = require("../utils/vcfParser");
const router = express_1.default.Router();
// Multer Config
const storage = multer_1.default.diskStorage({
    destination(req, file, cb) {
        const uploadPath = 'uploads/';
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = (0, multer_1.default)({
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
router.post('/', upload.single('vcf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        console.log(`📂 Processing VCF: ${req.file.originalname}`);
        const filePath = req.file.path;
        const fileContent = fs_1.default.readFileSync(filePath, 'utf8');
        // Parse Logic
        const geneticData = (0, vcfParser_1.parseVCFContent)(fileContent);
        // Create Profile in DB
        const newProfile = await Profile_1.default.create({
            name: `Patient ${new Date().toLocaleDateString()}`,
            genes: geneticData
        });
        // Cleanup
        fs_1.default.unlinkSync(filePath);
        res.status(201).json({
            message: 'Genomic analysis complete',
            profileId: newProfile._id,
            genes: geneticData
        });
    }
    catch (error) {
        console.error('❌ Upload Error:', error.message);
        res.status(500).json({ error: 'Server error processing file' });
    }
});
exports.default = router;
//# sourceMappingURL=uploadRoutes.js.map