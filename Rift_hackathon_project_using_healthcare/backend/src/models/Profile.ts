import mongoose, { Schema, Document } from 'mongoose';
import { IProfile } from '../types';

export interface IProfileDocument extends IProfile, Document {}

const ProfileSchema: Schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a profile name'],
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    genes: [
        {
            gene: { type: String, required: true },
            rsID: { type: String, required: true },
            genotype: { type: String, required: true },
            phenotype: { type: String, required: true },
            rawGT: { type: String },
            riskLevel: { type: String },
        }
    ]
}, {
    timestamps: true
});

// Pre-save hook to determine risk level based on phenotype (simple heuristic for database)
ProfileSchema.pre<IProfileDocument>('save', function(next) {
    if (this.genes) {
        this.genes.forEach(gene => {
            const p = gene.phenotype.toLowerCase();
            if (p.includes("poor") || p.includes("slow") || p.includes("rapid") || p.includes("positive")) {
                gene.riskLevel = "Toxic"; 
            } else if (p.includes("intermediate") || p.includes("decreased")) {
                gene.riskLevel = "Adjust Dose";
            } else {
                gene.riskLevel = "Safe";
            }
        });
    }
    next();
});

export default mongoose.model<IProfileDocument>('Profile', ProfileSchema);
