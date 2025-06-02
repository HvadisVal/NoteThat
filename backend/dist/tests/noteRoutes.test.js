"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const note_routes_1 = __importDefault(require("../routes/note.routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config({ path: '.env.test.ci' });
// ✅ Create a minimal Express app instance for isolated testing
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/notes', note_routes_1.default);
let token;
console.log('🔍 TEST_USER_TOKEN in CI:', process.env.TEST_USER_TOKEN || 'undefined');
describe('Notes API', () => {
    // ✅ Load token once before tests
    beforeAll(() => {
        const payload = {
            id: '67e7eb090f54a67cb1707b6c',
            name: 'Valion',
            email: 'valion@example.com'
        };
        const jwtSecret = process.env.JWT_SECRET || 'fallback';
        token = jsonwebtoken_1.default.sign(payload, jwtSecret, { expiresIn: '2h' });
    });
    // ✅ Test 1: GET request without a token should return 401
    it('should return 401 if user is not authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get('/api/notes');
        expect(res.statusCode).toBe(401);
    }));
    // ✅ Test 2: POST request without token should return 401
    it('should fail to create note without token', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post('/api/notes').send({
            title: 'Test Note',
            content: 'This is a test note',
        });
        expect(res.statusCode).toBe(401);
    }));
    // ✅ Test 3: GET request with a valid token should return 200 or 204
    it('should return 200 or 204 when authenticated', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get('/api/notes')
            .set('Authorization', `Bearer ${token}`);
        expect([200, 204]).toContain(res.statusCode);
    }));
});
