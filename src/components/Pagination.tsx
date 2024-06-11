
import React from "react";
import { useState, useEffect } from "react";
import { PaginationProps } from "../lib/types";

function Pagination({ items, setCurrentItems, tableRowRef, paginationTag }: PaginationProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    useEffect(() => {
        const tableRow = tableRowRef.current;

        if (tableRow) {
            const containerHeight = window.innerHeight;
            const rowHeight = tableRow.clientHeight;
            let numRows = Math.floor(containerHeight / rowHeight);

            numRows -= 3; // Subtract 3 rows for a margin

            setItemsPerPage(numRows <= items.length ? numRows : items.length);
        }

        setCurrentItems(items.slice(indexOfFirstItem, indexOfLastItem));
    }, [currentPage, items, setCurrentItems, tableRowRef, indexOfFirstItem, indexOfLastItem, itemsPerPage]);

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        setCurrentPage(Number(event.currentTarget.id));
    };

    const renderPageNumbers = () => {
        const pageRange = window.innerWidth < 640 ? 2 : 4; // Number of pages to show on either side of the current page

        let startingPage = currentPage - pageRange;
        let endingPage = currentPage + pageRange;

        if (startingPage < 1) {
            endingPage += Math.abs(startingPage) + 1;
            startingPage = 1;
        }

        if (endingPage > totalPages) {
            // Max prevents negative numbers
            startingPage = Math.max(1, startingPage - (endingPage - totalPages));
            endingPage = totalPages;
        }

        const pageNumbers = [];

        for (let i = startingPage; i <= endingPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers.map((number) => {
            return (
                <li key={number} className="inline-block">
                    <a
                        href="#1"
                        id={number.toString()}
                        x-vmo-ptag={paginationTag}
                        onClick={handleClick}
                        className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === number
                            ? "bg-blue-500 text-white currentPage"
                            : "text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        {number}
                    </a>
                </li>
            );
        });
    };

    const totalPages = Math.ceil(items.length / itemsPerPage);

    return (
        <div className="flex justify-between items-center mt-4 mx-4 mb-4">
        {items.length > 0 ? (
            <>
                <div className="text-sm text-gray-700 dark:text-gray-400">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, items.length)} of {items.length} entries
                </div>
                <ul className="flex">
                    <li className="mr-2">
                                <span id="x-vmo-pagination" x-vmo-ptag={paginationTag} x-vmo-itemsperpage={itemsPerPage} className="pl-4 text-sm text-gray-700 dark:text-gray-400">
                            Page {currentPage} of {totalPages}
                        </span>
                    </li>
                    {renderPageNumbers()}
                </ul>
            </>
        ) : (
            <div className="text-sm text-gray-700 dark:text-gray-400">
                There are no elements to display.
            </div>
        )}
    </div>
    );
}

export default Pagination;
