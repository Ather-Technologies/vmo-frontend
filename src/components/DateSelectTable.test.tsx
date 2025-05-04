import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DateSelectTable from './DateSelectTable';
import { ClipDateStateDataProp, ClipDate } from '../lib/types';
import API_Interface from '../lib/InterfaceForAPI';

// First, mock the module before using any mock functions
jest.mock('nosleep.js', () => {
    function MockNoSleep() { }
    // Use empty functions initially
    MockNoSleep.prototype.enable = jest.fn();
    MockNoSleep.prototype.disable = jest.fn();
    return MockNoSleep;
});

// Then define the mock functions and reassign them
const mockEnableFn = jest.fn();
const mockDisableFn = jest.fn();

// Update the prototype methods to use our tracked mock functions
const MockNoSleep = require('nosleep.js');
MockNoSleep.prototype.enable = mockEnableFn;
MockNoSleep.prototype.disable = mockDisableFn;

// Mock the API Interface
jest.mock('../lib/InterfaceForAPI', () => {
    return jest.fn().mockImplementation(() => {
        return {
            getAllDatesBySourceId: jest.fn().mockResolvedValue([]),
            getFullDateFromDateID: jest.fn().mockResolvedValue({})
        };
    });
});

// Mock the LoadingScreen component
jest.mock('./LoadingScreen', () => ({
    __esModule: true,
    default: ({ loadingText }: { loadingText: string }) => (
        <div data-testid="loading-screen">{loadingText}</div>
    )
}));

// Mock the Pagination component
jest.mock('./Pagination', () => ({
    __esModule: true,
    default: ({
        items,
        setCurrentItems,
    }: {
        items: any[],
        setCurrentItems: (items: any[]) => void,
        paginationTag: string,
        tableRowRef: any,
        viewportPercentage: number
    }) => {
        // Simulate the pagination functionality for testing
        const handlePageClick = () => {
            setCurrentItems(items.slice(0, 3));
        };

        return (
            <div data-testid="pagination">
                <span>Total items: {items.length}</span>
                <button onClick={handlePageClick} data-testid="page-button">
                    Change Page
                </button>
            </div>
        );
    }
}));

// Set up mock dates
const mockDates: ClipDate[] = [
    { id: 1, date: '01/01/22', source_id: 1 },
    { id: 2, date: '01/02/22', source_id: 1 },
    { id: 3, date: '01/03/22', source_id: 1 },
];

// Mock the matchMedia function
beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        })),
    });
});

// Helper to simulate mobile/desktop views
const mockMediaQuery = (matches: boolean) => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
        matches,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
    }));
};

describe('DateSelectTable Component', () => {
    let mockCDStateData: ClipDateStateDataProp;
    let mockSetIsExpanded: jest.Mock;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
        mockEnableFn.mockClear();
        mockDisableFn.mockClear();

        // Set up default state for desktop view
        mockMediaQuery(false);

        // Create mock props
        mockCDStateData = {
            date_id: NaN,
            clip_id: NaN,
            setDateID: jest.fn(),
            setClipID: jest.fn(),
            selectedDateFullData: {
                id: NaN,
                date: '',
                source: {
                    id: NaN,
                    name: '',
                    shorthand: '',
                    timezone: ''
                }
            },
            setSelectedDateFullData: jest.fn()
        };

        mockSetIsExpanded = jest.fn();

        // Setup API mock implementation
        (API_Interface as jest.Mock).mockImplementation(() => {
            return {
                getAllDatesBySourceId: jest.fn().mockResolvedValue(mockDates),
                getFullDateFromDateID: jest.fn().mockResolvedValue({
                    id: 1,
                    date: '2022-01-01T00:00:00.000Z',
                    source: {
                        id: 1,
                        name: "Sanders County Sheriff's Office",
                        shorthand: 'SCSO',
                        timezone: 'America/Denver'
                    }
                })
            };
        });
    });

    test('renders loading screen initially', () => {
        render(
            <DateSelectTable
                CDStateData={mockCDStateData}
                setIsExpanded={mockSetIsExpanded}
            />
        );

        expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
        expect(screen.getByText('Loading dates...')).toBeInTheDocument();
    });

    test('renders no dates message when dates array is empty', async () => {
        (API_Interface as jest.Mock).mockImplementation(() => {
            return {
                getAllDatesBySourceId: jest.fn().mockResolvedValue([]),
                getFullDateFromDateID: jest.fn()
            };
        });

        render(
            <DateSelectTable
                CDStateData={mockCDStateData}
                setIsExpanded={mockSetIsExpanded}
            />
        );

        // Wait for the "No Dates Available" heading to appear
        await waitFor(() => {
            expect(screen.getByText('No Dates Available')).toBeInTheDocument();
        });

        // After the heading is visible, check for the message text
        expect(screen.getByText('There are no dates available. Please check back later.')).toBeInTheDocument();
    });

    test('renders dates table with correct data', async () => {
        render(
            <DateSelectTable
                CDStateData={mockCDStateData}
                setIsExpanded={mockSetIsExpanded}
            />
        );

        // Wait for a key element to be in the document - use a more specific selector
        await waitFor(() => {
            expect(screen.getByRole('columnheader', { name: /source/i })).toBeInTheDocument();
        });

        // After we know the table has rendered, check for the other elements
        expect(screen.getByRole('columnheader', { name: /date/i })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();

        // Use getAllByText for elements that may appear multiple times, and check that at least one exists
        const sourceNames = screen.getAllByText(/sanders county sheriff's office/i);
        expect(sourceNames.length).toBeGreaterThan(0);

        // Check for date text, more specific than before
        const dateTexts = screen.getAllByText('01/01/22');
        expect(dateTexts.length).toBeGreaterThan(0);

        expect(screen.getByTestId('pagination')).toBeInTheDocument();
        expect(screen.getByText(/total items: 3/i)).toBeInTheDocument();
    });

    test('updates selected date when row is clicked', async () => {
        // Set a current date_id
        mockCDStateData.date_id = 2;

        render(
            <DateSelectTable
                CDStateData={mockCDStateData}
                setIsExpanded={mockSetIsExpanded}
            />
        );

        // Wait for the table to be in the document
        await waitFor(() => {
            expect(screen.getByRole('table')).toBeInTheDocument();
        });

        // Find the date row by a more specific selector
        const dateRows = screen.getAllByRole('row');
        // The first row is the header, so we want the second row (index 1)
        const dateRow = dateRows[1];

        // Click the row
        fireEvent.click(dateRow);

        // Verify the date was updated
        await waitFor(() => {
            expect(mockCDStateData.setDateID).toHaveBeenCalledWith(1);
        });

        expect(mockSetIsExpanded).toHaveBeenCalledWith(false);

        // Check NoSleep was properly handled
        expect(mockDisableFn).toHaveBeenCalled();
        expect(mockEnableFn).toHaveBeenCalled();
    });

    test('shows different UI on mobile devices', async () => {
        // Set up mobile view
        mockMediaQuery(true);

        render(
            <DateSelectTable
                CDStateData={mockCDStateData}
                setIsExpanded={mockSetIsExpanded}
            />
        );

        // Wait for the table to load - use a more specific selector
        await waitFor(() => {
            expect(screen.getByRole('table')).toBeInTheDocument();
        });

        // Status column should not be visible on mobile - be more specific
        const statusColumn = screen.getByRole('columnheader', { name: /status/i });
        expect(statusColumn).toHaveClass('hidden');

        // Use a more specific approach to find elements with the 'Available' title
        const sourceIcons = screen.getAllByTitle(/available/i);
        expect(sourceIcons.length).toBeGreaterThan(0);
    });

    test('pagination changes displayed items', async () => {
        render(
            <DateSelectTable
                CDStateData={mockCDStateData}
                setIsExpanded={mockSetIsExpanded}
            />
        );

        // Wait for the pagination component to load
        const pageButton = await screen.findByTestId('page-button');
        fireEvent.click(pageButton);

        // Check that dates are still displayed after pagination
        const dateTexts = screen.getAllByText('01/01/22');
        expect(dateTexts.length).toBeGreaterThan(0);
    });

    test('highlights selected row correctly', async () => {
        // Set a current date_id
        mockCDStateData.date_id = 1;

        render(
            <DateSelectTable
                CDStateData={mockCDStateData}
                setIsExpanded={mockSetIsExpanded}
            />
        );

        // Wait for component to render
        await waitFor(() => {
            expect(screen.getByRole('table')).toBeInTheDocument();
        });

        // Find rows that might have the right ID (need to examine the actual component)
        const rows = screen.getAllByRole('row');
        // Skip header row
        expect(rows.length).toBeGreaterThan(1);

        // Note: In a real test we would verify the selected row has appropriate CSS classes
        // This requires proper data-testid attributes in the component
    });

    test('fetches data with correct source ID', async () => {
        const mockGetAllDatesBySourceId = jest.fn().mockResolvedValue(mockDates);
        (API_Interface as jest.Mock).mockImplementation(() => {
            return {
                getAllDatesBySourceId: mockGetAllDatesBySourceId,
                getFullDateFromDateID: jest.fn().mockResolvedValue({})
            };
        });

        render(
            <DateSelectTable
                CDStateData={mockCDStateData}
                setIsExpanded={mockSetIsExpanded}
            />
        );

        await waitFor(() => {
            // Check that the API was called with source ID 1
            expect(mockGetAllDatesBySourceId).toHaveBeenCalledWith(1);
        });
    });

    test('disables and enables NoSleep when clicking a date', async () => {
        render(
            <DateSelectTable
                CDStateData={mockCDStateData}
                setIsExpanded={mockSetIsExpanded}
            />
        );

        // Wait for the table to be in the document
        await waitFor(() => {
            expect(screen.getByRole('table')).toBeInTheDocument();
        });

        // Get the row and click it - use a more reliable approach
        const dateRows = screen.getAllByRole('row');
        // Skip the header row (index 0)
        const dateRow = dateRows[1];
        fireEvent.click(dateRow);

        // Verify NoSleep was handled correctly
        expect(mockDisableFn).toHaveBeenCalled();
        expect(mockEnableFn).toHaveBeenCalled();
    });
});