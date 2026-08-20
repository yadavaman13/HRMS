import { useState, useEffect, useRef, useCallback } from 'react';
import Tooltip from '@/components/Shared/DataDisplay/Tooltip/Tooltip';
import './AdvancedScrollbar.scss';

/**
 * AdvancedScrollbar component
 * Replaces native browser scrollbars with custom interactive scrollbars.
 * Vertical scrollbar features dynamic number tooltips and auto-offsets to start
 * from the first row (below column headers).
 */
function AdvancedScrollbar({
    targetRef,
    children,
    vertical = true,
    horizontal = true,
    totalRows,
    totalCols,
    showVerticalTooltip = true,
    showHorizontalTooltip = false,
    verticalHeaderOffset,
    formatVerticalTooltip,
    formatHorizontalTooltip,
    className = '',
    style = {},
}) {
    const containerRef = useRef(null);
    const [scrollState, setScrollState] = useState({
        scrollTop: 0,
        scrollLeft: 0,
        scrollHeight: 0,
        scrollWidth: 0,
        clientHeight: 0,
        clientWidth: 0,
        headerHeight: 0,
        hasVerticalScroll: false,
        hasHorizontalScroll: false,
    });

    const [isDraggingV, setIsDraggingV] = useState(false);
    const [isDraggingH, setIsDraggingH] = useState(false);
    const [isHoveredV, setIsHoveredV] = useState(false);
    const [isHoveredH, setIsHoveredH] = useState(false);

    const dragStartRef = useRef({ startY: 0, startX: 0, startScrollTop: 0, startScrollLeft: 0 });

    const getScrollElement = useCallback(() => {
        return targetRef?.current || containerRef.current;
    }, [targetRef]);

    const updateMetrics = useCallback(() => {
        const el = getScrollElement();
        if (!el) return;

        const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = el;
        const headerEl = el.querySelector('thead');
        const measuredHeaderHeight =
            verticalHeaderOffset !== undefined
                ? verticalHeaderOffset
                : headerEl
                  ? headerEl.offsetHeight
                  : 0;

        const hasV = vertical && scrollHeight > clientHeight + 2;
        const hasH = horizontal && scrollWidth > clientWidth + 2;

        setScrollState({
            scrollTop,
            scrollLeft,
            scrollHeight,
            scrollWidth,
            clientHeight,
            clientWidth,
            headerHeight: measuredHeaderHeight,
            hasVerticalScroll: hasV,
            hasHorizontalScroll: hasH,
        });
    }, [getScrollElement, vertical, horizontal, verticalHeaderOffset]);

    useEffect(() => {
        const el = getScrollElement();
        if (!el) return;

        const handleScroll = () => {
            updateMetrics();
        };

        const handleResize = () => {
            updateMetrics();
        };

        el.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);

        let resizeObserver = null;
        let rafId = null;
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(() => updateMetrics());
            resizeObserver.observe(el);
            if (el.firstElementChild) {
                resizeObserver.observe(el.firstElementChild);
            }
        } else {
            rafId = requestAnimationFrame(() => updateMetrics());
        }

        return () => {
            el.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            if (resizeObserver) resizeObserver.disconnect();
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [getScrollElement, updateMetrics]);

    // Vertical drag handlers
    const handleThumbMouseDownV = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const el = getScrollElement();
        if (!el) return;

        setIsDraggingV(true);
        dragStartRef.current = {
            startY: e.clientY,
            startScrollTop: el.scrollTop,
        };
        document.body.style.userSelect = 'none';
    };

    // Horizontal drag handlers
    const handleThumbMouseDownH = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const el = getScrollElement();
        if (!el) return;

        setIsDraggingH(true);
        dragStartRef.current = {
            startX: e.clientX,
            startScrollLeft: el.scrollLeft,
        };
        document.body.style.userSelect = 'none';
    };

    // Global mousemove and mouseup listeners for dragging
    useEffect(() => {
        const handleMouseMove = (e) => {
            const el = getScrollElement();
            if (!el) return;

            if (isDraggingV) {
                const deltaY = e.clientY - dragStartRef.current.startY;
                const { scrollHeight, clientHeight, headerHeight } = scrollState;
                const effectiveClientHeight = Math.max(1, clientHeight - headerHeight);
                const maxScroll = scrollHeight - clientHeight;
                const thumbHeight = Math.max(
                    28,
                    (effectiveClientHeight / scrollHeight) * effectiveClientHeight,
                );
                const trackAvailable = effectiveClientHeight - thumbHeight;

                if (trackAvailable > 0) {
                    const scrollDelta = (deltaY / trackAvailable) * maxScroll;
                    el.scrollTop = dragStartRef.current.startScrollTop + scrollDelta;
                }
            }

            if (isDraggingH) {
                const deltaX = e.clientX - dragStartRef.current.startX;
                const { scrollWidth, clientWidth } = scrollState;
                const maxScroll = scrollWidth - clientWidth;
                const thumbWidth = Math.max(28, (clientWidth / scrollWidth) * clientWidth);
                const trackAvailable = clientWidth - thumbWidth;

                if (trackAvailable > 0) {
                    const scrollDelta = (deltaX / trackAvailable) * maxScroll;
                    el.scrollLeft = dragStartRef.current.startScrollLeft + scrollDelta;
                }
            }
        };

        const handleMouseUp = () => {
            if (isDraggingV) setIsDraggingV(false);
            if (isDraggingH) setIsDraggingH(false);
            document.body.style.userSelect = '';
        };

        if (isDraggingV || isDraggingH) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDraggingV, isDraggingH, getScrollElement, scrollState]);

    // Track click handlers
    const handleTrackClickV = (e) => {
        if (e.target.classList.contains('advanced-scrollbar-thumb')) return;
        const el = getScrollElement();
        if (!el) return;

        const trackRect = e.currentTarget.getBoundingClientRect();
        const clickY = e.clientY - trackRect.top;
        const ratio = clickY / trackRect.height;
        el.scrollTop = ratio * (scrollState.scrollHeight - scrollState.clientHeight);
    };

    const handleTrackClickH = (e) => {
        if (e.target.classList.contains('advanced-scrollbar-thumb')) return;
        const el = getScrollElement();
        if (!el) return;

        const trackRect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - trackRect.left;
        const ratio = clickX / trackRect.width;
        el.scrollLeft = ratio * (scrollState.scrollWidth - scrollState.clientWidth);
    };

    // Calculate thumb geometries
    const {
        scrollTop,
        scrollLeft,
        scrollHeight,
        scrollWidth,
        clientHeight,
        clientWidth,
        headerHeight,
        hasVerticalScroll,
        hasHorizontalScroll,
    } = scrollState;

    const effectiveClientHeight = Math.max(1, clientHeight - headerHeight);
    const maxScrollV = Math.max(1, scrollHeight - clientHeight);
    const thumbHeight =
        effectiveClientHeight > 0
            ? Math.max(28, (effectiveClientHeight / scrollHeight) * effectiveClientHeight)
            : 0;
    const availableTrackV = Math.max(0, effectiveClientHeight - thumbHeight);
    const thumbTop = (scrollTop / maxScrollV) * availableTrackV;

    const maxScrollH = Math.max(1, scrollWidth - clientWidth);
    const thumbWidth =
        clientWidth > 0 ? Math.max(28, (clientWidth / scrollWidth) * clientWidth) : 0;
    const thumbLeft = clientWidth > 0 ? (scrollLeft / maxScrollH) * (clientWidth - thumbWidth) : 0;

    // Formatted Tooltip text calculation for vertical scrollbar
    const vPercent = Math.min(100, Math.max(0, Math.round((scrollTop / maxScrollV) * 100)));
    let verticalTooltipText = '';
    if (formatVerticalTooltip) {
        verticalTooltipText = formatVerticalTooltip(
            totalRows
                ? Math.min(
                      totalRows,
                      Math.max(1, Math.round((scrollTop / maxScrollV) * (totalRows - 1)) + 1),
                  )
                : undefined,
            totalRows,
            vPercent,
        );
    } else if (totalRows) {
        const curRow = Math.min(
            totalRows,
            Math.max(1, Math.round((scrollTop / maxScrollV) * (totalRows - 1)) + 1),
        );
        verticalTooltipText = `${curRow} of ${totalRows}`;
    } else {
        verticalTooltipText = `${vPercent}%`;
    }

    const hPercent = Math.min(100, Math.max(0, Math.round((scrollLeft / maxScrollH) * 100)));
    let horizontalTooltipText = '';
    if (formatHorizontalTooltip) {
        horizontalTooltipText = formatHorizontalTooltip(
            totalCols
                ? Math.min(
                      totalCols,
                      Math.max(1, Math.round((scrollLeft / maxScrollH) * (totalCols - 1)) + 1),
                  )
                : undefined,
            totalCols,
            hPercent,
        );
    } else if (totalCols) {
        const curCol = Math.min(
            totalCols,
            Math.max(1, Math.round((scrollLeft / maxScrollH) * (totalCols - 1)) + 1),
        );
        horizontalTooltipText = `${curCol} of ${totalCols}`;
    } else {
        horizontalTooltipText = `${hPercent}%`;
    }

    const renderScrollbars = () => (
        <>
            {/* Vertical Scrollbar (Starts from first row below header) */}
            {hasVerticalScroll && (
                <div
                    className={`advanced-scrollbar-track vertical ${isDraggingV ? 'is-dragging' : ''}`}
                    style={{
                        top: `${headerHeight}px`,
                        height: `calc(100% - ${headerHeight}px)`,
                    }}
                    onClick={handleTrackClickV}
                >
                    <div
                        className="advanced-scrollbar-thumb-container"
                        style={{
                            height: `${thumbHeight}px`,
                            transform: `translateY(${thumbTop}px)`,
                        }}
                    >
                        {showVerticalTooltip ? (
                            <Tooltip
                                content={verticalTooltipText}
                                position="left"
                                visible={isDraggingV || isHoveredV}
                                className="advanced-scrollbar-tooltip"
                                variant="flat"
                            >
                                <div
                                    className={`advanced-scrollbar-thumb ${isDraggingV ? 'is-dragging' : ''}`}
                                    onMouseDown={handleThumbMouseDownV}
                                    onMouseEnter={() => setIsHoveredV(true)}
                                    onMouseLeave={() => setIsHoveredV(false)}
                                />
                            </Tooltip>
                        ) : (
                            <div
                                className={`advanced-scrollbar-thumb ${isDraggingV ? 'is-dragging' : ''}`}
                                onMouseDown={handleThumbMouseDownV}
                                onMouseEnter={() => setIsHoveredV(true)}
                                onMouseLeave={() => setIsHoveredV(false)}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Horizontal Scrollbar */}
            {hasHorizontalScroll && (
                <div
                    className={`advanced-scrollbar-track horizontal ${isDraggingH ? 'is-dragging' : ''}`}
                    onClick={handleTrackClickH}
                >
                    <div
                        className="advanced-scrollbar-thumb-container"
                        style={{
                            width: `${thumbWidth}px`,
                            transform: `translateX(${thumbLeft}px)`,
                        }}
                    >
                        {showHorizontalTooltip ? (
                            <Tooltip
                                content={horizontalTooltipText}
                                position="top"
                                visible={isDraggingH || isHoveredH}
                                className="advanced-scrollbar-tooltip"
                                variant="flat"
                            >
                                <div
                                    className={`advanced-scrollbar-thumb ${isDraggingH ? 'is-dragging' : ''}`}
                                    onMouseDown={handleThumbMouseDownH}
                                    onMouseEnter={() => setIsHoveredH(true)}
                                    onMouseLeave={() => setIsHoveredH(false)}
                                />
                            </Tooltip>
                        ) : (
                            <div
                                className={`advanced-scrollbar-thumb ${isDraggingH ? 'is-dragging' : ''}`}
                                onMouseDown={handleThumbMouseDownH}
                                onMouseEnter={() => setIsHoveredH(true)}
                                onMouseLeave={() => setIsHoveredH(false)}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );

    if (targetRef) {
        return renderScrollbars();
    }

    return (
        <div className={`advanced-scrollbar-wrapper ${className}`} style={style}>
            <div className="advanced-scrollbar-content" ref={containerRef}>
                {children}
            </div>
            {renderScrollbars()}
        </div>
    );
}

export default AdvancedScrollbar;
