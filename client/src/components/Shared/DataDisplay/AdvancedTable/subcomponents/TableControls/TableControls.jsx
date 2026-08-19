import SearchBar from '@/components/Shared/Form/SearchBar/SearchBar';
import Tooltip from '@/components/Shared/DataDisplay/Tooltip/Tooltip';
import Dropdown from '@/components/Shared/Form/Dropdown/Dropdown';
import { Filter as FilterIcon, RotateCw as RefreshCwIcon, X as XIcon } from 'lucide-react';
import TableFilterPanel from '../TableFilterPanel/TableFilterPanel';
import TableSelectionBar from '../TableSelectionBar/TableSelectionBar';
import TableColumnToggle from '../TableColumnToggle/TableColumnToggle';
import TableExportMenu from '../TableExportMenu/TableExportMenu';
import './TableControls.scss';

function TableControls({
    searchable = true,
    searchTerm,
    onSearchChange,
    searchPlaceholder,
    searchPlaceholderPrefix,
    autoSearchOptions,
    searchPlaceholderInterval,
    effectiveFilterConfig = [],
    filterToggleRef,
    filterPanelOpen,
    setFilterPanelOpen,
    hasActiveFilters,
    activeFilterCount,
    filterPanelRef,
    clearAllFilters,
    expandedFilterKey,
    toggleFilterAccordion,
    columnFilters,
    setColumnFilters,
    dateRangeFilters,
    setDateRangeFilters,
    numericFilters,
    setNumericFilters,
    columnUniqueValues,
    onFilterValueChange,
    showRefresh = true,
    showExport = true,
    exportData = [],
    onExport,
    isRefreshing = false,
    loading = false,
    handleRefreshClick,
    totalRows = 0,
    safeCurrentPage = 1,
    rowsPerPage = 5,
    showRowsPerPage = false,
    rowsOptions = [],
    handleRowsPerPageChange,
    itemsPerPageLabel = 'Rows per page',
    // Column Toggle props
    showColumnToggle = true,
    effectiveColumns = [],
    hiddenKeys,
    collapsedKeys,
    columnToggleOpen,
    setColumnToggleOpen,
    columnSearchTerm,
    setColumnSearchTerm,
    columnToggleRef,
    columnToggleBtnRef,
    toggleColumn,
    toggleCollapse,
    showAllColumns,
    expandAllColumns,
    resetColumns,
    // Selection Bar props
    selectedCount = 0,
    selectedData = [],
    isEditingSelected = false,
    onToggleEditSelected,
    onDeleteSelected,
    onSaveEdits,
}) {
    return (
        <div className="advanced-table-controls">
            {selectedCount > 0 ? (
                <TableSelectionBar
                    selectedCount={selectedCount}
                    selectedData={selectedData}
                    columns={effectiveColumns}
                    isEditingSelected={isEditingSelected}
                    onToggleEditSelected={onToggleEditSelected}
                    onDeleteSelected={onDeleteSelected}
                    onSaveEdits={onSaveEdits}
                    onExportSelected={onExport}
                />
            ) : (
                <div className="advanced-table-controls-left">
                    {searchable && (
                        <div className="advanced-table-search-box">
                            <SearchBar
                                value={searchTerm}
                                onChange={onSearchChange}
                                placeholder={searchPlaceholder}
                                placeholderPrefix={searchPlaceholderPrefix}
                                placeholderOptions={autoSearchOptions}
                                placeholderInterval={searchPlaceholderInterval}
                                showFilter={false}
                            />
                        </div>
                    )}

                    {/* Filter toggle button */}
                    {effectiveFilterConfig.length > 0 && (
                        <div className="at-filter-toggle-wrapper">
                            <button
                                ref={filterToggleRef}
                                type="button"
                                className={`at-filter-toggle-btn ${filterPanelOpen ? 'is-open' : ''} ${hasActiveFilters ? 'has-filters' : ''}`}
                                onClick={() => setFilterPanelOpen((prev) => !prev)}
                                aria-label="Toggle filters"
                            >
                                <FilterIcon size={14} />
                                <span>Filter</span>
                                {hasActiveFilters && (
                                    <span className="at-filter-badge">{activeFilterCount}</span>
                                )}
                            </button>

                            {/* Filter panel dropdown */}
                            {filterPanelOpen && (
                                <TableFilterPanel
                                    filterPanelRef={filterPanelRef}
                                    effectiveFilterConfig={effectiveFilterConfig}
                                    hasActiveFilters={hasActiveFilters}
                                    clearAllFilters={clearAllFilters}
                                    expandedFilterKey={expandedFilterKey}
                                    toggleFilterAccordion={toggleFilterAccordion}
                                    columnFilters={columnFilters}
                                    setColumnFilters={setColumnFilters}
                                    dateRangeFilters={dateRangeFilters}
                                    setDateRangeFilters={setDateRangeFilters}
                                    numericFilters={numericFilters}
                                    setNumericFilters={setNumericFilters}
                                    columnUniqueValues={columnUniqueValues}
                                    onFilterValueChange={onFilterValueChange}
                                />
                            )}
                        </div>
                    )}

                    {/* Column Toggle dropdown */}
                    {showColumnToggle && effectiveColumns.length > 0 && (
                        <TableColumnToggle
                            effectiveColumns={effectiveColumns}
                            collapsedKeys={collapsedKeys || hiddenKeys}
                            columnToggleOpen={columnToggleOpen}
                            setColumnToggleOpen={setColumnToggleOpen}
                            columnSearchTerm={columnSearchTerm}
                            setColumnSearchTerm={setColumnSearchTerm}
                            columnToggleRef={columnToggleRef}
                            columnToggleBtnRef={columnToggleBtnRef}
                            toggleCollapse={toggleCollapse || toggleColumn}
                            expandAllColumns={expandAllColumns || showAllColumns}
                            resetColumns={resetColumns}
                        />
                    )}

                    {/* Table Export Menu (PDF, CSV, Excel) */}
                    {showExport && effectiveColumns.length > 0 && (
                        <TableExportMenu
                            data={exportData}
                            columns={effectiveColumns}
                            buttonVariant="icon"
                            filenamePrefix="table-export"
                            reportTitle="Data Table Report"
                            onExport={onExport}
                        />
                    )}

                    {showRefresh && (
                        <Tooltip
                            content={
                                isRefreshing || loading ? 'Cancel refresh' : 'Refresh table data'
                            }
                            position="bottom"
                        >
                            <button
                                type="button"
                                className={`advanced-table-refresh-btn ${isRefreshing || loading ? 'is-loading' : ''}`}
                                onClick={handleRefreshClick}
                                aria-label={
                                    isRefreshing || loading
                                        ? 'Cancel refresh'
                                        : 'Refresh table data'
                                }
                            >
                                {isRefreshing || loading ? (
                                    <XIcon size={14} />
                                ) : (
                                    <RefreshCwIcon size={14} />
                                )}
                            </button>
                        </Tooltip>
                    )}
                </div>
            )}

            <div className="advanced-table-showing-results">
                <span className="showing-text">
                    {totalRows === 0 ? (
                        'Showing 0 results'
                    ) : (
                        <>
                            Showing {(safeCurrentPage - 1) * rowsPerPage + 1}–
                            {Math.min(safeCurrentPage * rowsPerPage, totalRows)} of{' '}
                            <strong className="showing-total-count">
                                {Number(totalRows).toLocaleString()}
                            </strong>{' '}
                            results
                        </>
                    )}
                </span>
                {showRowsPerPage && (
                    <>
                        <span className="showing-divider">|</span>
                        <div className="rows-select-wrapper">
                            <span className="showing-text">{itemsPerPageLabel}:</span>
                            <Dropdown
                                options={rowsOptions}
                                value={rowsPerPage}
                                onChange={handleRowsPerPageChange}
                                className="showing-select-dropdown"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default TableControls;
