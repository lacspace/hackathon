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
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = __importDefault(require("./config/db"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
// Import Routes
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const profileRoutes_1 = __importDefault(require("./routes/profileRoutes"));
// Load Env
dotenv_1.default.config();
// Connect DB
(0, db_1.default)();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
}));
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false, // For serving images/files if needed
}));
app.use((0, morgan_1.default)('dev'));
// Swagger Config
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'PharmaGuard API',
            version: '1.0.0',
            description: 'API Documentation for PharmaGuard Genomic Analysis Platform',
            contact: {
                name: "PharmaGuard Support",
                email: "support@pharmaguard.med"
            }
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5000}`,
                description: 'Local Development Server'
            }
        ]
    },
    apis: ["./src/routes/*.ts"],
};
const specs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
// Routes
app.use('/api/upload', uploadRoutes_1.default);
app.use('/api/profile', profileRoutes_1.default);
// Health Check
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'PharmaGuard API is Online 🧬',
        docs: `http://localhost:${process.env.PORT || 5000}/api-docs`
    });
});
// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(`❌ Server Error: ${err.message}`);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`📄 Documentation available at http://localhost:${PORT}/api-docs\n`);
});
//# sourceMappingURL=index.js.map