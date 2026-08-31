export function toolSuccess(data) {
    return JSON.stringify({ success: true, data });
}

export function toolError(code, message) {
    return JSON.stringify({ success: false, error: { code, message } });
}
