import React, { useState, useEffect, useCallback, useRef } from "react";

interface PaginationProps {
    items: any[];
    setCurrentItems: React.Dispatch<React.SetStateAction<any[]>>;
    tableRowRef: React.RefObject<HTMLTableRowElement>;
    paginationTag?: string;
    hideUI?: boolean; // New prop to hide the UI but keep the logic
    containerMargin?: string; // CSS margin value (e.g. "0 0 20px 0")
    itemsPerPageOverride?: number; // Override the calculated items per page
    viewportPercentage?: number; // Add the missing prop
}

function Pagination({
    items,
    setCurrentItems,
    tableRowRef,
    paginationTag,
    hideUI = false,
    containerMargin,
    itemsPerPageOverride,
    viewportPercentage = 60 // Set a default value
}: PaginationProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(1);
    const initialCalculationDone = useRef(false);
    // Remove the unused state variable
    // const [customViewportPercentage, setCustomViewportPercentage] = useState(viewportPercentage);

    // Add a debug visualization mode that can be toggled from console
    // window.showPaginationDebug = true;
    const [showDebug, setShowDebug] = useState(false);

    // Check for debug flag
    useEffect(() => {
        const checkDebugMode = () => {
            setShowDebug(!!window.showPaginationDebug);
        };

        checkDebugMode();
        window.addEventListener('storage', checkDebugMode);

        return () => window.removeEventListener('storage', checkDebugMode);
    }, []);

    const calculateItemsPerPage = useCallback(() => {
        // If an override is provided, use it
        if (itemsPerPageOverride !== undefined) {
            setItemsPerPage(itemsPerPageOverride);
            return;
        }

        const tableRow = tableRowRef.current;
        if (tableRow) {
            // Get accurate viewport dimensions
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            const rowHeight = tableRow.clientHeight || 50; // Fallback height

            // Get accurate context information
            const isDatesPagination = paginationTag?.includes('date');
            const isMobile = viewportWidth < 768;

            // ADAPTIVE CALCULATION APPROACH
            // Calculate space consumed by fixed UI elements
            const fixedUIHeight = (() => {
                if (isDatesPagination) {
                    // For dates navigation - account for the header and improved mobile calculation
                    const headerElement = document.getElementById('datesnavbackground')?.querySelector('div');
                    const headerHeight = headerElement?.offsetHeight || 100;

                    // Add extra space for pagination controls and prevent overflow on small screens
                    return headerHeight + (isMobile ? 180 : 150);
                } else {
                    // For clips view - adjusted for better mobile experience
                    const appHeader = 0; // Adjust if you have a fixed header
                    const paginationControls = isMobile ? 80 : 60;
                    const margins = isMobile ? 100 : 80;
                    return appHeader + paginationControls + margins;
                }
            })();

            // Calculate truly available height for content - using the actual viewport percentage
            const availableHeight = viewportHeight - fixedUIHeight;

            // Use viewport percentage from props
            const effectivePercentage = isMobile ?
                Math.min(viewportPercentage + 10, 98) : // Slightly increased for mobile
                viewportPercentage;

            const usableHeight = (availableHeight * effectivePercentage) / 100;

            // Calculate ideal number of rows with better small screen handling
            let numRows = Math.floor(usableHeight / rowHeight);

            // Apply context-specific minimums with improved mobile defaults
            numRows = Math.max(
                numRows,
                isDatesPagination
                    ? (isMobile ? 4 : 6)  // Reduced min rows for dates on mobile
                    : (isMobile ? 3 : 5)  // Reduced min rows for clips on mobile
            );

            // Ensure we don't exceed available items
            numRows = Math.min(numRows, items.length);

            // Always show at least one row
            numRows = Math.max(1, numRows);

            console.log(`[Pagination] ${paginationTag}: Calculated ${numRows} rows (viewport: ${viewportHeight}px, row: ${rowHeight}px)`);
            setItemsPerPage(numRows);
        }
    }, [tableRowRef, items.length, itemsPerPageOverride, paginationTag, viewportPercentage]);

    // Remove the unused effect for optimal viewport percentage
    // useEffect(() => {
    //     // Dynamically adjust viewport percentage based on screen size
    //     if (!viewportPercentage && window) {
    //         const screenHeight = window.innerHeight;
    //         const screenWidth = window.innerWidth;
    //         
    //         // Define optimal percentages based on screen size
    //         let optimalPercentage;
    //         
    //         if (screenHeight < 700) {
    //             // Small height screens - use more space
    //             optimalPercentage = 85;
    //         } else if (screenHeight > 1200) {
    //             // Very tall screens - use less percentage but still get more rows
    //             optimalPercentage = 70;
    //         } else {
    //             // Standard screens
    //             optimalPercentage = 80;
    //         }
    //         
    //         // Adjust for wide screens
    //         if (screenWidth > 1440) {
    //             optimalPercentage = Math.min(optimalPercentage + 5, 90);
    //         }
    //         
    //         // Update state if needed
    //         if (optimalPercentage) {
    //             setCustomViewportPercentage(optimalPercentage);
    //         }
    //     }
    // }, [viewportPercentage]);

    // Rest of component remains unchanged
    // ...

    // Add this useEffect to listen for custom pagination adjustments
    useEffect(() => {
        const handlePaginationOverride = (event: CustomEvent) => {
            const { tag, itemsPerPage } = event.detail;
            if (tag === paginationTag && typeof itemsPerPage === 'number') {
                setItemsPerPage(itemsPerPage);
            }
        };

        // Add event listener
        document.addEventListener('paginationOverride', handlePaginationOverride as EventListener);

        // Cleanup
        return () => {
            document.removeEventListener('paginationOverride', handlePaginationOverride as EventListener);
        };
    }, [paginationTag]);

    // Run initial calculation
    useEffect(() => {
        calculateItemsPerPage();

        // Add a delayed calculation to get more accurate measurements after DOM rendering
        const timer = setTimeout(() => {
            calculateItemsPerPage();
        }, 100);

        return () => clearTimeout(timer);
    }, [calculateItemsPerPage]);

    // Add resize event listener with debounce
    useEffect(() => {
        let resizeTimeout: NodeJS.Timeout;

        const handleResizeWithDebounce = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(calculateItemsPerPage, 100);
        };

        window.addEventListener('resize', handleResizeWithDebounce);

        return () => {
            clearTimeout(resizeTimeout);
            window.removeEventListener('resize', handleResizeWithDebounce);
        };
    }, [calculateItemsPerPage]);

    useEffect(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        setCurrentItems(items.slice(indexOfFirstItem, indexOfLastItem));
    }, [currentPage, items, setCurrentItems, itemsPerPage]);

    const maxPageNumbersToShow = 3;
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        setCurrentPage(Number(event.currentTarget.id));
    };

    const handleFirstClick = () => {
        setCurrentPage(1);
    };

    const handleLastClick = () => {
        setCurrentPage(totalPages);
    };

    const goToNextPage = useCallback(() => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
            return true;
        }
        return false;
    }, [currentPage]);

    useEffect(() => {
        if (paginationTag) {
            window.vmoPagination = window.vmoPagination || {};
            window.vmoPagination[paginationTag] = {
                goToNextPage,
                currentPage,
                totalPages
            };
        }

        return () => {
            if (paginationTag && window.vmoPagination) {
                delete window.vmoPagination[paginationTag];
            }
        };
    }, [paginationTag, goToNextPage, currentPage, totalPages]);

    const renderPageNumbers = pageNumbers.map(number => (
        <li key={number} className="inline-block ml-1 mt-1">
            <a
                href="#1"
                id={number.toString()}
                x-vmo-ptag={paginationTag}
                onClick={handleClick}
                className={`p-2 rounded-md text-xs md:text-sm font-medium ${currentPage === number
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                    }`}
            >
                {number}
            </a>
        </li>
    ));

    const containerStyle = containerMargin ? { margin: containerMargin } : {};

    const renderDebugInfo = () => {
        if (!showDebug) return null;

        const tableRow = tableRowRef.current;
        const rowHeight = tableRow?.clientHeight || 0;
        const viewportHeight = window.innerHeight;

        return (
            <div className="fixed top-0 right-0 bg-black/80 text-white p-2 text-xs z-50 w-64">
                <div className="font-bold">{paginationTag} Pagination Debug</div>
                <div>Viewport: {viewportHeight}px</div>
                <div>Row Height: {rowHeight}px</div>
                <div>Items Per Page: {itemsPerPage}</div>
                <div>Current/Total: {currentPage}/{totalPages}</div>
                <div>% Used: {((itemsPerPage * rowHeight) / viewportHeight * 100).toFixed(1)}%</div>
                <button
                    className="mt-1 bg-blue-500 text-white px-2 py-1 text-xs rounded"
                    onClick={() => {
                        initialCalculationDone.current = false;
                        calculateItemsPerPage();
                    }}
                >
                    Recalculate
                </button>
            </div>
        );
    };

    if (hideUI) {
        return null;
    }

    return (
        <div
            className="flex flex-col sm:flex-row justify-between items-center py-1 px-2 md:px-3 mb-1"
            style={containerStyle}
        >
            {items.length > 0 ? (
                <>
                    <div className="text-xs md:text-sm text-gray-400 whitespace-nowrap">
                        {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, items.length)}/{items.length}
                    </div>
                    <ul className="flex mt-1 md:mt-0">
                        {/* Compact pagination controls */}
                        <li className="mr-0.5">
                            <button onClick={handleFirstClick} hidden={currentPage === 1}
                                className="p-1 rounded-md text-xs md:text-sm font-medium text-white hover:bg-blue-500">
                                {"<<"}
                            </button>
                        </li>
                        {renderPageNumbers}
                        <li className="ml-0.5">
                            <button onClick={handleLastClick} hidden={currentPage === totalPages}
                                className="p-1 rounded-md text-xs md:text-sm font-medium text-white hover:bg-blue-500">
                                {">>"}
                            </button>
                        </li>
                        <li className="ml-1">
                            <span id="x-vmo-pagination" x-vmo-ptag={paginationTag} x-vmo-itemsperpage={itemsPerPage}
                                className="pl-1 text-xs md:text-sm text-gray-400 whitespace-nowrap">
                                {currentPage}/{totalPages}
                            </span>
                        </li>
                    </ul>
                </>
            ) : (
                <div className="text-sm">No items</div>
            )}
            {renderDebugInfo()}
        </div>
    );
}

// Add TypeScript declaration for window object extension
declare global {
    interface Window {
        vmoPagination?: {
            [key: string]: {
                goToNextPage: () => boolean;
                currentPage: number;
                totalPages: number;
            }
        };
        showPaginationDebug?: boolean;
    }
}

export default Pagination;