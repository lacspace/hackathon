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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const types_1 = require("../types");
const ProfileSchema = new mongoose_1.default.Schema({
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
ProfileSchema.pre('save', function (next) {
    if (this.genes) {
        this.genes.forEach(gene => {
            const p = gene.phenotype.toLowerCase();
            if (p.includes("poor") || p.includes("slow") || p.includes("rapid") || p.includes("positive")) {
                gene.riskLevel = "Toxic";
            }
            else if (p.includes("intermediate") || p.includes("decreased")) {
                gene.riskLevel = "Adjust Dose";
            }
            else {
                gene.riskLevel = "Safe";
            }
        });
    }
    next();
});
exports.default = mongoose_1.default.model('Profile', ProfileSchema);
//# sourceMappingURL=Profile.js.map