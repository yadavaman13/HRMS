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
    let baseCode = companyName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 5);
    if (baseCode.length < 3) {
        baseCode = baseCode.padEnd(3, 'X');
    }
    return baseCode;
}
