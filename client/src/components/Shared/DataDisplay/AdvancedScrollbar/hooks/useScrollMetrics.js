import { useState, useEffect, useCallback } from 'react';

export function useScrollMetrics({
    targetRef,
    containerRef,
    vertical,
    horizontal,
    verticalHeaderOffset,
}) {
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

    const getScrollElement = useCallback(() => {
        return targetRef?.current || containerRef.current;
    }, [targetRef, containerRef]);

    const updateMetrics = useCallback(() => {
        const el = getScrollElement();
        if (!el) return;

        const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = el;
        const headerEl = el.querySelector('thead');
        const headerHeight =
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
            headerHeight,
            hasVerticalScroll: hasV,
            hasHorizontalScroll: hasH,
        });
    }, [getScrollElement, vertical, horizontal, verticalHeaderOffset]);

    useEffect(() => {
        const el = getScrollElement();
        if (!el) return;

        updateMetrics();
        el.addEventListener('scroll', updateMetrics, { passive: true });
        window.addEventListener('resize', updateMetrics);

        let observer = null;
        if (typeof ResizeObserver !== 'undefined') {
            observer = new ResizeObserver(updateMetrics);
            observer.observe(el);
            if (el.firstElementChild) observer.observe(el.firstElementChild);
        }

        return () => {
            el.removeEventListener('scroll', updateMetrics);
            window.removeEventListener('resize', updateMetrics);
            if (observer) observer.disconnect();
        };
    }, [getScrollElement, updateMetrics]);

    return { scrollState, getScrollElement, updateMetrics };
}
