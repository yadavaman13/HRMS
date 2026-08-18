import { useState } from 'react';
import Tooltip from '@/components/Shared/DataDisplay/Tooltip/Tooltip';

function HorizontalScrollbarTrack({
    scrollState,
    isDraggingH,
    onMouseDown,
    onTrackClick,
    showTooltip,
    tooltipText,
}) {
    const [isHovered, setIsHovered] = useState(false);
    const { scrollLeft, scrollWidth, clientWidth, hasHorizontalScroll } = scrollState;

    if (!hasHorizontalScroll) return null;

    const maxScrollH = Math.max(1, scrollWidth - clientWidth);
    const thumbWidth =
        clientWidth > 0 ? Math.max(28, (clientWidth / scrollWidth) * clientWidth) : 0;
    const thumbLeft = clientWidth > 0 ? (scrollLeft / maxScrollH) * (clientWidth - thumbWidth) : 0;

    const thumbElement = (
        <div
            className={`advanced-scrollbar-thumb ${isDraggingH ? 'is-dragging' : ''}`}
            onMouseDown={onMouseDown}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        />
    );

    return (
        <div
            className={`advanced-scrollbar-track horizontal ${isDraggingH ? 'is-dragging' : ''}`}
            onClick={onTrackClick}
        >
            <div
                className="advanced-scrollbar-thumb-container"
                style={{ width: `${thumbWidth}px`, transform: `translateX(${thumbLeft}px)` }}
            >
                {showTooltip ? (
                    <Tooltip
                        content={tooltipText}
                        position="top"
                        visible={isDraggingH || isHovered}
                        className="advanced-scrollbar-tooltip"
                    >
                        {thumbElement}
                    </Tooltip>
                ) : (
                    thumbElement
                )}
            </div>
        </div>
    );
}

export default HorizontalScrollbarTrack;
