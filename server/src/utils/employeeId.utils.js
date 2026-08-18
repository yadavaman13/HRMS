/**
 * Utility module for generating, validating, and parsing Employee Login IDs.
 * Format: [CompanyPrefix][FirstTwoOfFirstName][FirstTwoOfLastName][YearOfJoining][PaddedSerialNumber]
 * Example: OIJODO20220001 (Odoo India, John Doe, 2022, Serial 1)
 */

/**
 * Normalizes a name string by removing accents, spaces, and non-alphabetic characters.
 * @param {string} name - The name to clean
 * @returns {string} Cleaned uppercase letters
 */
function cleanName(name) {
    if (typeof name !== 'string') return '';
    return name
        .normalize('NFD') // Decompose accents (e.g. René -> Rene)
        .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
        .replace(/[^a-zA-Z]/g, '') // Remove spaces, numbers, and special characters
        .toUpperCase();
}

/**
 * Generates an employee ID based on the employee details and joining parameters.
 * 
 * @param {Object} details - Details of the employee
 * @param {string} details.firstName - First name of the employee
 * @param {string} details.lastName - Last name of the employee
 * @param {Date|number|string} [details.joiningYear] - Year of joining (defaults to current year)
 * @param {number|string} details.serialNumber - Serial number of joining for that year
 * @param {Object} [options] - Configuration options
 * @param {string} [options.companyPrefix='OI'] - Company prefix (defaults to 'OI' for Odoo India)
 * @param {string} [options.padChar='X'] - Padding character for short names (defaults to 'X')
 * @param {number} [options.serialLength=4] - Padding length for serial number (defaults to 4)
 * @returns {string} The generated employee ID
 * @throws {Error} If input validation fails
 */
export function generateEmployeeId({ firstName, lastName, joiningYear, serialNumber}, options = {}) {
    const companyPrefix = (options.companyPrefix || 'OI').trim().toUpperCase();
    const padChar = (options.padChar || 'X').trim().toUpperCase().charAt(0);
    const serialLength = parseInt(options.serialLength, 10) || 4;

    // 1. Process Names
    const cleanFirst = cleanName(firstName);
    const cleanLast = cleanName(lastName);

    // Take first 2 letters of first name, pad if shorter
    let firstPart = cleanFirst.slice(0, 2);
    if (firstPart.length < 2) {
        firstPart = firstPart.padEnd(2, padChar);
    }

    // Take first 2 letters of last name, pad if shorter
    let lastPart = cleanLast.slice(0, 2);
    if (lastPart.length < 2) {
        lastPart = lastPart.padEnd(2, padChar);
    }

    const initials = firstPart + lastPart;

    // 2. Process Year of Joining
    let year = new Date().getFullYear();
    if (joiningYear !== undefined && joiningYear !== null) {
        if (joiningYear instanceof Date) {
            year = joiningYear.getFullYear();
        } else {
            const parsedYear = parseInt(joiningYear, 10);
            if (!isNaN(parsedYear) && parsedYear > 0) {
                year = parsedYear;
            } else {
                throw new Error('Invalid joiningYear: must be a Date object or a valid year number.');
            }
        }
    }

    // 3. Process Serial Number
    const numSerial = parseInt(serialNumber, 10);
    if (isNaN(numSerial) || numSerial < 0) {
        throw new Error('Invalid serialNumber: must be a non-negative number.');
    }
    const paddedSerial = String(numSerial).padStart(serialLength, '0');

    // 4. Combine parts
    return `${companyPrefix}${initials}${year}${paddedSerial}`;
}

/**
 * Validates whether an employee ID conforms to the generated pattern.
 * 
 * @param {string} employeeId - The employee ID to validate
 * @param {Object} [options] - Configuration options matching the generator
 * @param {string} [options.companyPrefix='OI'] - Expected company prefix
 * @param {number} [options.serialLength=4] - Expected minimum length of the serial number
 * @returns {boolean} True if the ID is valid, false otherwise
 */
export function validateEmployeeId(employeeId, options = {}) {
    if (typeof employeeId !== 'string') return false;
    
    const companyPrefix = (options.companyPrefix || 'OI').trim().toUpperCase();
    const serialLength = parseInt(options.serialLength, 10) || 4;

    const regex = new RegExp(`^${companyPrefix}[A-Z]{4}\\d{4}\\d{${serialLength},}$`);
    return regex.test(employeeId.toUpperCase());
}

/**
 * Parses an employee ID into its constituent components.
 * 
 * @param {string} employeeId - The employee ID to parse
 * @param {Object} [options] - Configuration options matching the generator
 * @returns {Object|null} Parsed components, or null if ID format is invalid
 */
export function parseEmployeeId(employeeId, options = {}) {
    if (!validateEmployeeId(employeeId, options)) return null;

    const companyPrefix = (options.companyPrefix || 'OI').trim().toUpperCase();
    const cleanId = employeeId.toUpperCase();
    
    const prefixLen = companyPrefix.length;
    const initials = cleanId.substring(prefixLen, prefixLen + 4);
    const year = parseInt(cleanId.substring(prefixLen + 4, prefixLen + 8), 10);
    const serialNumber = parseInt(cleanId.substring(prefixLen + 8), 10);

    return {
        companyPrefix,
        initials,
        firstNameInitials: initials.substring(0, 2),
        lastNameInitials: initials.substring(2, 4),
        joiningYear: year,
        serialNumber
    };
}
