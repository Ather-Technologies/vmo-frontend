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

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(items.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        setCurrentPage(Number(event.currentTarget.id));
    };

    const renderPageNumbers = pageNumbers.map(number => (
        <li key={number} className="inline-block">
            <a
                href="#1"
                id={number.toString()}
                x-vmo-ptag={paginationTag}
                onClick={handleClick}
                className={`px-3 py-2 rounded-md text-sm font-medium ${currentPage === number
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                    }`}
            >
                {number}
            </a>
        </li>
    ));

    const totalPages = Math.ceil(items.length / itemsPerPage);



    return (
        <div className="flex justify-between items-center mt-4 mx-4 mb-4">
            {items.length > 0 ? (
                <>
                    <div className="text-sm">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, items.length)} of {items.length} entries
                    </div>
                    <ul className="flex">
                        <li className="mr-2">
                            <span id="x-vmo-pagination" x-vmo-ptag={paginationTag} x-vmo-itemsperpage={itemsPerPage} className="pl-4 text-sm">
                                Page {currentPage} of {totalPages}
                            </span>
                        </li>
                        {renderPageNumbers}
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
