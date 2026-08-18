import { useState, useEffect, useRef } from 'react';

export function useScrollDrag({ getScrollElement, scrollState }) {
    const [isDraggingV, setIsDraggingV] = useState(false);
    const [isDraggingH, setIsDraggingH] = useState(false);
    const dragStartRef = useRef({ startY: 0, startX: 0, startScrollTop: 0, startScrollLeft: 0 });

    const handleThumbMouseDownV = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const el = getScrollElement();
        if (!el) return;
        setIsDraggingV(true);
        dragStartRef.current = { startY: e.clientY, startScrollTop: el.scrollTop };
        document.body.style.userSelect = 'none';
    };

    const handleThumbMouseDownH = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const el = getScrollElement();
        if (!el) return;
        setIsDraggingH(true);
        dragStartRef.current = { startX: e.clientX, startScrollLeft: el.scrollLeft };
        document.body.style.userSelect = 'none';
    };

    const handleTrackClickV = (e) => {
        if (e.target.classList.contains('advanced-scrollbar-thumb')) return;
        const el = getScrollElement();
        if (!el) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientY - rect.top) / rect.height;
        el.scrollTop = ratio * (scrollState.scrollHeight - scrollState.clientHeight);
    };

    const handleTrackClickH = (e) => {
        if (e.target.classList.contains('advanced-scrollbar-thumb')) return;
        const el = getScrollElement();
        if (!el) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        el.scrollLeft = ratio * (scrollState.scrollWidth - scrollState.clientWidth);
    };

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
                    el.scrollTop =
                        dragStartRef.current.startScrollTop + (deltaY / trackAvailable) * maxScroll;
                }
            }

            if (isDraggingH) {
                const deltaX = e.clientX - dragStartRef.current.startX;
                const { scrollWidth, clientWidth } = scrollState;
                const maxScroll = scrollWidth - clientWidth;
                const thumbWidth = Math.max(28, (clientWidth / scrollWidth) * clientWidth);
                const trackAvailable = clientWidth - thumbWidth;
                if (trackAvailable > 0) {
                    el.scrollLeft =
                        dragStartRef.current.startScrollLeft +
                        (deltaX / trackAvailable) * maxScroll;
                }
            }
        };

        const handleMouseUp = () => {
            setIsDraggingV(false);
            setIsDraggingH(false);
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

    return {
        isDraggingV,
        isDraggingH,
        handleThumbMouseDownV,
        handleThumbMouseDownH,
        handleTrackClickV,
        handleTrackClickH,
    };
}
