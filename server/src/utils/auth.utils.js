/**
 * Utility functions for authentication and registration
 */

/**
 * Splits a full name into first name and last name.
 * @param {string} name
 * @returns {object} { firstName, lastName }
 */
export function splitFullName(name) {
    if (typeof name !== 'string') return { firstName: '', lastName: '' };
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    return { firstName, lastName };
}

/**
 * Normalizes a company name into a base code prefix for code generation.
 * @param {string} companyName
 * @returns {string} Cleaned uppercase code prefix
 */
export function getBaseCompanyCode(companyName) {
    if (typeof companyName !== 'string') return 'ORG';
    let baseCode = companyName
        .replace(/[^a-zA-Z0-9]/g, '')
        .toUpperCase()
        .slice(0, 5);
    if (baseCode.length < 3) {
        baseCode = baseCode.padEnd(3, 'X');
    }
    return baseCode;
}

/**
 * Validates a password against comprehensive security rules (copied/adapted from client/src/utils/passwordValidation.js).
 * @param {string} password
 * @param {string} email
 * @returns {boolean}
 */
export function validatePasswordStrength(password, email = '') {
    if (!password) return false;
    if (/\s/.test(password)) return false;
    if (password.length < 6 || password.length > 128) return false;

    if (email && password.toLowerCase() === email.trim().toLowerCase()) return false;
    if (email) {
        const atIndex = email.indexOf('@');
        const emailUsername = atIndex > -1 ? email.slice(0, atIndex).trim().toLowerCase() : '';
        if (emailUsername && password.toLowerCase() === emailUsername) return false;
    }

    const commonPasswords = [
        '123456',
        '1234567',
        '12345678',
        '123456789',
        '1234567890',
        '12345',
        '123123',
        '111111',
        '000000',
        '654321',
        'password',
        'password1',
        'password123',
        'pass123',
        'passw0rd',
        'admin',
        'admin123',
        'administrator',
        'root',
        'toor',
        'letmein',
        'letmein123',
        'login',
        'welcome',
        'welcome1',
        'secret',
        'monkey',
        'dragon',
        'master',
        'abc123',
        'iloveyou',
        'sunshine',
        'princess',
        'shadow',
        'superman',
        'batman',
        'trustno1',
        'qwerty',
        'qwerty123',
        'qwertyuiop',
        'asdfgh',
        'zxcvbn',
        '1q2w3e',
        '1q2w3e4r',
        'aaaaaa',
        '111111',
        'aaaa1234',
        'test1234',
        'user1234',
        'changeme',
        'newpass',
        'temp123',
        'guest123',
    ];
    if (commonPasswords.includes(password.toLowerCase())) return false;

    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/\d/.test(password)) return false;
    if (!/[^A-Za-z0-9]/.test(password)) return false;

    if (/(.)\1{3,}/.test(password)) return false;

    const SEQUENCES = [
        'abcdefghijklmnopqrstuvwxyz', // alphabet
        '0123456789', // digits
        'qwertyuiop', // keyboard row 1
        'asdfghjkl', // keyboard row 2
        'zxcvbnm', // keyboard row 3
    ];
    const lowerPwd = password.toLowerCase();
    for (const seq of SEQUENCES) {
        for (let i = 0; i <= seq.length - 4; i++) {
            const forward = seq.slice(i, i + 4);
            const backward = forward.split('').reverse().join('');
            if (lowerPwd.includes(forward) || lowerPwd.includes(backward)) {
                return false;
            }
        }
    }

    return true;
}

/**
 * Generates a random secure temporary password that fully passes password validation rules.
 * @param {string} email
 * @returns {string}
 */
export function generateTemporaryPassword(email = '') {
    const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lowercase = 'abcdefghijkmnopqrstuvwxyz';
    const numbers = '23456789';
    const special = '!@#$%^&*()';
    const all = uppercase + lowercase + numbers + special;

    let attempts = 0;
    while (attempts < 100) {
        let password = '';

        // Ensure at least one of each character class is present
        password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
        password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
        password += numbers.charAt(Math.floor(Math.random() * numbers.length));
        password += special.charAt(Math.floor(Math.random() * special.length));

        // Fill remaining to length 12
        for (let i = 4; i < 12; i++) {
            password += all.charAt(Math.floor(Math.random() * all.length));
        }

        // Shuffle characters
        password = password
            .split('')
            .sort(() => 0.5 - Math.random())
            .join('');

        if (validatePasswordStrength(password, email)) {
            return password;
        }
        attempts++;
    }

    return 'Tmp@P4ssw0rd99';
}
