import {
    validatePasswordStrength,
    generateTemporaryPassword,
    splitFullName,
    getBaseCompanyCode,
} from '../../utils/auth.utils.js';
import jwt from 'jsonwebtoken';

describe('Auth & Security Utilities (Unit Tests)', () => {
    describe('splitFullName', () => {
        it('should split single name into firstName and empty lastName', () => {
            const result = splitFullName('Aman');
            expect(result).toEqual({ firstName: 'Aman', lastName: '' });
        });

        it('should split multi-part names into firstName and lastName', () => {
            const result = splitFullName('John Ronald Reuel Tolkien');
            expect(result).toEqual({ firstName: 'John', lastName: 'Ronald Reuel Tolkien' });
        });

        it('should handle empty or non-string inputs safely', () => {
            expect(splitFullName('')).toEqual({ firstName: '', lastName: '' });
            expect(splitFullName(null)).toEqual({ firstName: '', lastName: '' });
            expect(splitFullName(undefined)).toEqual({ firstName: '', lastName: '' });
        });
    });

    describe('getBaseCompanyCode', () => {
        it('should extract alphanumeric uppercase prefix of length up to 5', () => {
            expect(getBaseCompanyCode('Odoo Tech')).toBe('ODOOT');
            expect(getBaseCompanyCode('ACME Corp')).toBe('ACMEC');
        });

        it('should pad short names to at least 3 characters', () => {
            expect(getBaseCompanyCode('HR')).toBe('HRX');
            expect(getBaseCompanyCode('A')).toBe('AXX');
        });

        it('should fallback to ORG for invalid inputs', () => {
            expect(getBaseCompanyCode(null)).toBe('ORG');
            expect(getBaseCompanyCode('')).toBe('ORG');
        });
    });

    describe('validatePasswordStrength', () => {
        it('should reject passwords shorter than 6 characters or containing spaces', () => {
            expect(validatePasswordStrength('Ab1!')).toBe(false);
            expect(validatePasswordStrength('Abc 123!@#')).toBe(false);
        });

        it('should reject common weak passwords and dictionaries', () => {
            expect(validatePasswordStrength('password123')).toBe(false);
            expect(validatePasswordStrength('12345678')).toBe(false);
            expect(validatePasswordStrength('admin123')).toBe(false);
        });

        it('should reject passwords that match user email username', () => {
            expect(validatePasswordStrength('john123!A', 'john123!a@example.com')).toBe(false);
        });

        it('should reject repetitive or sequential patterns', () => {
            expect(validatePasswordStrength('AAAA123!a')).toBe(false);
            expect(validatePasswordStrength('abcdEFG1!@')).toBe(false);
        });

        it('should accept strong, complex passwords meeting all criteria', () => {
            expect(validatePasswordStrength('Secure#Pass987')).toBe(true);
            expect(validatePasswordStrength('Odoo@Dev2026!')).toBe(true);
        });
    });

    describe('generateTemporaryPassword', () => {
        it('should generate valid passwords passing strength checks', () => {
            for (let i = 0; i < 5; i++) {
                const tempPass = generateTemporaryPassword('user@example.com');
                expect(tempPass.length).toBeGreaterThanOrEqual(8);
                expect(validatePasswordStrength(tempPass, 'user@example.com')).toBe(true);
            }
        });
    });

    describe('JWT Token Creation and Verification', () => {
        const secret = 'test-jwt-secret-key-12345';

        it('should successfully sign and verify token payload', () => {
            const payload = { id: 'usr-123', email: 'test@example.com', role: 'admin' };
            const token = jwt.sign(payload, secret, { expiresIn: '1h' });

            expect(typeof token).toBe('string');
            const decoded = jwt.verify(token, secret);
            expect(decoded.id).toBe(payload.id);
            expect(decoded.email).toBe(payload.email);
            expect(decoded.role).toBe(payload.role);
        });

        it('should reject expired tokens or wrong secret', () => {
            const token = jwt.sign({ id: '1' }, secret, { expiresIn: '0s' });
            expect(() => jwt.verify(token, secret)).toThrow();
            expect(() => jwt.verify(token, 'wrong-secret')).toThrow();
        });
    });
});
