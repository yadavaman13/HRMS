import { useState } from 'react';
import Tooltip from '@/components/Shared/DataDisplay/Tooltip/Tooltip';

function VerticalScrollbarTrack({
    scrollState,
    isDraggingV,
    onMouseDown,
    onTrackClick,
    showTooltip,
    tooltipText,
}) {
    const [isHovered, setIsHovered] = useState(false);
    const { scrollTop, scrollHeight, clientHeight, headerHeight, hasVerticalScroll } = scrollState;

    if (!hasVerticalScroll) return null;

    const effectiveClientHeight = Math.max(1, clientHeight - headerHeight);
    const maxScrollV = Math.max(1, scrollHeight - clientHeight);
    const thumbHeight =
        effectiveClientHeight > 0
            ? Math.max(28, (effectiveClientHeight / scrollHeight) * effectiveClientHeight)
            : 0;
    const availableTrackV = Math.max(0, effectiveClientHeight - thumbHeight);
    const thumbTop = (scrollTop / maxScrollV) * availableTrackV;

    const thumbElement = (
        <div
            className={`advanced-scrollbar-thumb ${isDraggingV ? 'is-dragging' : ''}`}
            onMouseDown={onMouseDown}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        />
    );

    return (
        <div
            className={`advanced-scrollbar-track vertical ${isDraggingV ? 'is-dragging' : ''}`}
            style={{ top: `${headerHeight}px`, height: `calc(100% - ${headerHeight}px)` }}
            onClick={onTrackClick}
        >
            <div
                className="advanced-scrollbar-thumb-container"
                style={{ height: `${thumbHeight}px`, transform: `translateY(${thumbTop}px)` }}
            >
                {showTooltip ? (
                    <Tooltip
                        content={tooltipText}
                        position="left"
                        visible={isDraggingV || isHovered}
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

export default VerticalScrollbarTrack;
