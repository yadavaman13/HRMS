/**
 * Helper to compute pagination metadata
 */
export function paginate({ totalCount, page = 1, limit = 10 }) {
    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const totalPages = Math.ceil(totalCount / safeLimit) || 1;
    const offset = (safePage - 1) * safeLimit;

    return {
        currentPage: safePage,
        limit: safeLimit,
        totalCount,
        totalPages,
        offset,
        hasNextPage: safePage < totalPages,
        hasPrevPage: safePage > 1,
    };
}

describe('Pagination Utilities (Unit Tests)', () => {
    it('should calculate offset and totalPages for first page', () => {
        const result = paginate({ totalCount: 45, page: 1, limit: 10 });
        expect(result.currentPage).toBe(1);
        expect(result.offset).toBe(0);
        expect(result.totalPages).toBe(5);
        expect(result.hasNextPage).toBe(true);
        expect(result.hasPrevPage).toBe(false);
    });

    it('should calculate offset for subsequent pages', () => {
        const result = paginate({ totalCount: 45, page: 3, limit: 10 });
        expect(result.currentPage).toBe(3);
        expect(result.offset).toBe(20);
        expect(result.hasNextPage).toBe(true);
        expect(result.hasPrevPage).toBe(true);
    });

    it('should clamp invalid or negative page numbers to page 1', () => {
        const result = paginate({ totalCount: 15, page: -5, limit: 10 });
        expect(result.currentPage).toBe(1);
        expect(result.offset).toBe(0);
    });

    it('should clamp excessive limit values to max threshold 100', () => {
        const result = paginate({ totalCount: 200, page: 1, limit: 500 });
        expect(result.limit).toBe(100);
    });
});
