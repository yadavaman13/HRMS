import { useState } from 'react';
import AdvancedTable from '@/components/Shared/DataDisplay/AdvancedTable/AdvancedTable';
import ViewToggle from '@/components/Shared/Buttons/ViewToggle/ViewToggle';
import './DataView.scss';

/**
 * DataView — Table / Grid view switcher component.
 *
 * Integrates AdvancedTable with GridView while maintaining search, filter,
 * tabs, pagination, and dynamic "Cards per page" vs "Rows per page" controls.
 * Places the ViewToggle in the top right corner of AdvancedTable.
 */
function DataView({
    // ── Header & View ──────────────────────────────────────────────────────
    defaultView = 'table',
    viewToggleSize = 'sm',

    // ── Grid-specific ───────────────────────────────────────────────────────
    gridColumns = 4,
    cardTitleKey,
    cardSubtitleKey,
    cardImageKey,
    cardStatusKey,
    cardBodyKeys = [],
    statusVariantMap = {},
    onCardClick,
    renderCard,
    gridSkeletonCount = 8,

    // ── AdvancedTable pass-through ──────────────────────────────────────────
    columns = [],
    data = [],
    tabs = [],
    tabFilterKey = 'status',
    searchable = true,
    searchPlaceholder,
    searchPlaceholderPrefix,
    searchOptions,
    searchPlaceholderInterval,
    initialRowsPerPage = 5,
    selectable = true,
    selectedRows = [],
    onSelectedRowsChange,
    onDataChange,
    onBulkAction,
    headerActions,
    loading = false,
    skeletonRows,
    serverSide = false,
    totalCount,
    onTableChange,
    onRefresh,
    showRefresh = true,
    filterConfig,
    className = '',
}) {
    const [activeView, setActiveView] = useState(defaultView);

    const viewToggleAction = (
        <ViewToggle view={activeView} onViewChange={setActiveView} size={viewToggleSize} />
    );

    const combinedHeaderActions = headerActions ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {headerActions}
            {viewToggleAction}
        </div>
    ) : (
        viewToggleAction
    );

    return (
        <div className={`data-view-component ${className}`}>
            {/* ── Main Data Pane (AdvancedTable handles Table & Grid modes) ──── */}
            <div className="data-view-pane">
                <AdvancedTable
                    viewMode={activeView}
                    gridColumns={gridColumns}
                    cardTitleKey={cardTitleKey}
                    cardSubtitleKey={cardSubtitleKey}
                    cardImageKey={cardImageKey}
                    cardStatusKey={cardStatusKey}
                    cardBodyKeys={cardBodyKeys}
                    statusVariantMap={statusVariantMap}
                    onCardClick={onCardClick}
                    renderCard={renderCard}
                    gridSkeletonCount={gridSkeletonCount}
                    columns={columns}
                    data={data}
                    tabs={tabs}
                    tabFilterKey={tabFilterKey}
                    searchable={searchable}
                    searchPlaceholder={searchPlaceholder}
                    searchPlaceholderPrefix={searchPlaceholderPrefix}
                    searchOptions={searchOptions}
                    searchPlaceholderInterval={searchPlaceholderInterval}
                    initialRowsPerPage={initialRowsPerPage}
                    selectable={selectable}
                    selectedRows={selectedRows}
                    onSelectedRowsChange={onSelectedRowsChange}
                    onDataChange={onDataChange}
                    onBulkAction={onBulkAction}
                    headerActions={combinedHeaderActions}
                    loading={loading}
                    skeletonRows={skeletonRows}
                    serverSide={serverSide}
                    totalCount={totalCount}
                    onTableChange={onTableChange}
                    onRefresh={onRefresh}
                    showRefresh={showRefresh}
                    filterConfig={filterConfig}
                />
            </div>
        </div>
    );
}

export default DataView;
