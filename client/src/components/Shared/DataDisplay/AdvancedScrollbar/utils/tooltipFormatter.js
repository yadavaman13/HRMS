export function getVerticalTooltipText({
    scrollTop,
    scrollHeight,
    clientHeight,
    totalRows,
    formatVerticalTooltip,
}) {
    const maxScrollV = Math.max(1, scrollHeight - clientHeight);
    const vPercent = Math.min(100, Math.max(0, Math.round((scrollTop / maxScrollV) * 100)));

    if (formatVerticalTooltip) {
        return formatVerticalTooltip(
            totalRows
                ? Math.min(
                      totalRows,
                      Math.max(1, Math.round((scrollTop / maxScrollV) * (totalRows - 1)) + 1),
                  )
                : undefined,
            totalRows,
            vPercent,
        );
    }
    if (totalRows) {
        const curRow = Math.min(
            totalRows,
            Math.max(1, Math.round((scrollTop / maxScrollV) * (totalRows - 1)) + 1),
        );
        return `${curRow} of ${totalRows}`;
    }
    return `${vPercent}%`;
}

export function getHorizontalTooltipText({
    scrollLeft,
    scrollWidth,
    clientWidth,
    totalCols,
    formatHorizontalTooltip,
}) {
    const maxScrollH = Math.max(1, scrollWidth - clientWidth);
    const hPercent = Math.min(100, Math.max(0, Math.round((scrollLeft / maxScrollH) * 100)));

    if (formatHorizontalTooltip) {
        return formatHorizontalTooltip(
            totalCols
                ? Math.min(
                      totalCols,
                      Math.max(1, Math.round((scrollLeft / maxScrollH) * (totalCols - 1)) + 1),
                  )
                : undefined,
            totalCols,
            hPercent,
        );
    }
    if (totalCols) {
        const curCol = Math.min(
            totalCols,
            Math.max(1, Math.round((scrollLeft / maxScrollH) * (totalCols - 1)) + 1),
        );
        return `${curCol} of ${totalCols}`;
    }
    return `${hPercent}%`;
}
