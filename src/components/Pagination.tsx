import React, { useState, useEffect, useCallback } from "react";
import { PaginationProps } from "../lib/types";

function Pagination({ items, setCurrentItems, tableRowRef, paginationTag }: PaginationProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(1);

    const calculateItemsPerPage = useCallback(() => {
        const tableRow = tableRowRef.current;
        if (tableRow) {
            const containerHeight = window.innerHeight;
            const rowHeight = tableRow.clientHeight;
            let numRows = Math.floor(containerHeight / rowHeight) - 3; // Subtract 2 rows for a margin

            setItemsPerPage(numRows <= items.length ? numRows : items.length);
        }
    }, [tableRowRef, items.length]);

    useEffect(() => {
        calculateItemsPerPage();
        // Add resize event listener
        window.addEventListener('resize', calculateItemsPerPage);

        // Cleanup
        return () => {
            window.removeEventListener('resize', calculateItemsPerPage);
        };
    }); // Yeah removing the list of dependencies was all I really had to do :( 

    useEffect(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        setCurrentItems(items.slice(indexOfFirstItem, indexOfLastItem));
    }, [currentPage, items, setCurrentItems, itemsPerPage]);

    // Max number of page designations to show ie. page 1, 2, 3...
    const maxPageNumbersToShow = 3;
    // Calculate total number of pages
    const totalPages = Math.ceil(items.length / itemsPerPage);
    // Calculate the start and end page numbers to display
    const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
    // If the start page is less than the max number of pages to show, then set the end page to the max amount of page numbers to render
    const endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

    // Create an array of page numbers to render
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    // Handles a click on a page number
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        setCurrentPage(Number(event.currentTarget.id));
    };

    // Handles a click on the first page button
    const handleFirstClick = () => {
        setCurrentPage(1);
    };

    // Handles a click on the previous page button
    const handlePreviousClick = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    // Handles a click on the next page button
    const handleNextClick = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    // Handles a click on the last page button
    const handleLastClick = () => {
        setCurrentPage(totalPages);
    };

    // Renders the page numbers into the dom
    const renderPageNumbers = pageNumbers.map(number => (
        <li key={number} className="inline-block ml-1 mt-1">
            <a
                href="#1"
                id={number.toString()}
                x-vmo-ptag={paginationTag}
                onClick={handleClick}
                className={`p-2 rounded-md text-sm font-medium ${currentPage === number
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                    }`}
            >
                {number}
            </a>
        </li>
    ));

    return (
        <div className="flex justify-between items-center mt-4 mx-4 mb-4">
            {items.length > 0 ? (
                <>
                    <div className="text-sm">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, items.length)} of {items.length} entries
                    </div>
                    <ul className="flex">
                        <li className="mr-1">
                            <button onClick={handleFirstClick} hidden={currentPage === 1} className="p-2 rounded-md text-sm font-medium text-white hover:bg-blue-500">
                                {"<<"}
                            </button>
                        </li>
                        {renderPageNumbers}
                        <li className="ml-1">
                            <button onClick={handleLastClick} hidden={currentPage === totalPages} className="p-2 rounded-md text-sm font-medium text-white hover:bg-blue-500">
                                {">>"}
                            </button>
                        </li>
                        <li className="ml-1">
                            <span id="x-vmo-pagination" x-vmo-ptag={paginationTag} x-vmo-itemsperpage={itemsPerPage} className="pl-2 text-sm">
                                Page {currentPage} of {totalPages}
                            </span>
                        </li>
                    </ul>
                </>
            ) : (
                <div className="text-sm">
                    There are no elements to display.
                </div>
            )}
        </div>
    );
}

export default Pagination;
