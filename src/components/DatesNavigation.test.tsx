import { render, screen, fireEvent, within } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import DatesNavigation from './DatesNavigation';
import { ClipDateStateDataProp } from '../lib/types';

// Mock DateSelectTable completely to avoid matchMedia issues
jest.mock('./DateSelectTable', () => ({
  __esModule: true,
  default: ({ CDStateData, setIsExpanded }: any) => (
    <div data-testid="date-select-container">DateSelectTable Mock</div>
  ),
}));

// Mock AudioPlayer component since it's not the focus of these tests
jest.mock('./AudioPlayer', () => ({
  __esModule: true,
  default: ({ CDStateData }: any) => (
    <div data-testid="audio-player">
      {isNaN(CDStateData.clip_id) ? "Nothing to play..." : `Playing clip ${CDStateData.clip_id}`}
    </div>
  ),
}));

// Mock window.matchMedia - this is critical for tests to work
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
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

  // Mock HTMLMediaElement methods
  HTMLMediaElement.prototype.load = jest.fn();
  HTMLMediaElement.prototype.play = jest.fn();
  HTMLMediaElement.prototype.pause = jest.fn();
});

// Mock window.innerWidth for testing
const mockInnerWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  window.dispatchEvent(new Event('resize'));
};

describe('DatesNavigation component', () => {
  const setupComponent = (customProps = {}) => {
    const defaultProps = {
      clip_id: NaN,
      date_id: NaN,
      selectedDateFullData: {
        id: NaN,
        date: '???',
        source: {
          id: NaN,
          name: '???',
          shorthand: '???',
          timezone: '???'
        }
      }
    };

    const props = {
      ...defaultProps,
      ...customProps,
      setClipID: jest.fn(),
      setDateID: jest.fn(),
      setSelectedDateFullData: jest.fn(),
    };

    const CDStateData: ClipDateStateDataProp = {
      clip_id: props.clip_id,
      date_id: props.date_id,
      setClipID: props.setClipID,
      setDateID: props.setDateID,
      selectedDateFullData: props.selectedDateFullData,
      setSelectedDateFullData: props.setSelectedDateFullData
    };

    return { CDStateData, ...props };
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    // Set a default desktop viewport size
    mockInnerWidth(1200);
  });

  test('renders DatesNavigation without crashing when no date is selected', () => {
    const { CDStateData } = setupComponent();
    render(<DatesNavigation CDStateData={CDStateData} />);

    // Check for empty state indicators
    const audioPlayer = screen.getByTestId("audio-player");
    expect(audioPlayer).toHaveTextContent("Nothing to play...");

    // Check that the button is disabled
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  test('renders audio player component', () => {
    const { CDStateData } = setupComponent();
    render(<DatesNavigation CDStateData={CDStateData} />);

    // Verify the audio player is rendered
    const audioPlayerElement = screen.getByTestId("audio-player");
    expect(audioPlayerElement).toBeInTheDocument();
  });

  test('expands date selection panel automatically when no date is selected', () => {
    const { CDStateData } = setupComponent();
    const { container } = render(<DatesNavigation CDStateData={CDStateData} />);

    // Verify that the background element has the correct classes using the id
    const dateNavBackground = screen.getByTestId('datesnavbackground');
    expect(dateNavBackground).toHaveClass('h-full');
    expect(dateNavBackground).toHaveClass('bg-gray-900/90');
  });

  test('renders with selected date information when date is provided', () => {
    const { CDStateData } = setupComponent({
      date_id: 1,
      selectedDateFullData: {
        id: 1,
        date: '2024-06-15T00:00:00.000Z',
        source: {
          id: 1,
          name: "Sanders County Sheriff's Office",
          shorthand: 'SCSO',
          timezone: 'America/Denver'
        }
      }
    });

    render(<DatesNavigation CDStateData={CDStateData} />);

    // Check for source shorthand
    const sourceShorthand = screen.getByText('SCSO');
    expect(sourceShorthand).toBeInTheDocument();

    // Check for formatted date (Jun 15, 2024)
    const dateElement = screen.getByText('Jun 15, 2024');
    expect(dateElement).toBeInTheDocument();
  });

  test('toggles expanded state when button is clicked', () => {
    const { CDStateData } = setupComponent({
      date_id: 1,
      selectedDateFullData: {
        id: 1,
        date: '2024-06-15T00:00:00.000Z',
        source: {
          id: 1,
          name: "Sanders County Sheriff's Office",
          shorthand: 'SCSO',
          timezone: 'America/Denver'
        }
      }
    });

    const { container } = render(<DatesNavigation CDStateData={CDStateData} />);

    // Initially not expanded - find by ID since that's what the component uses
    const dateNavBackground = screen.getByTestId('datesnavbackground');
    expect(dateNavBackground).toHaveClass('h-auto');

    // Find and click the toggle button
    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);

    // Should now be expanded
    expect(dateNavBackground).toHaveClass('h-full');

    // Text should now be "Close"
    expect(screen.getByText("Close")).toBeInTheDocument();

    // Click again to collapse
    fireEvent.click(toggleButton);

    // Should be back to non-expanded state
    expect(dateNavBackground).toHaveClass('h-auto');
  });

  test('adapts to mobile view on small screens', () => {
    // Set viewport to mobile size
    act(() => {
      mockInnerWidth(600);
    });

    const { CDStateData } = setupComponent({
      date_id: 1,
      selectedDateFullData: {
        id: 1,
        date: '2024-06-15T00:00:00.000Z',
        source: {
          id: 1,
          name: "Sanders County Sheriff's Office",
          shorthand: 'SCSO',
          timezone: 'America/Denver'
        }
      }
    });

    render(<DatesNavigation CDStateData={CDStateData} />);

    // Check for mobile-specific text
    const selectButtonText = screen.getByText("Select");
    expect(selectButtonText).toBeInTheDocument();

    // Reset viewport
    act(() => {
      mockInnerWidth(1024);
    });
  });

  test('button is disabled when no date is selected', () => {
    const { CDStateData } = setupComponent();
    render(<DatesNavigation CDStateData={CDStateData} />);

    // Find toggle button
    const toggleButton = screen.getByRole('button');
    expect(toggleButton).toBeDisabled();
  });

  test('gracefully handles invalid date format', () => {
    const { CDStateData } = setupComponent({
      date_id: 1,
      selectedDateFullData: {
        id: 1,
        date: 'invalid-date-format',
        source: {
          id: 1,
          name: "Sanders County Sheriff's Office",
          shorthand: 'SCSO',
          timezone: 'America/Denver'
        }
      }
    });

    const { container } = render(<DatesNavigation CDStateData={CDStateData} />);

    // Component should render without crashing
    const datesNavBackground = screen.getByTestId('datesnavbackground');
    expect(datesNavBackground).toBeInTheDocument();

    // Source shorthand should still be rendered
    expect(screen.getByText('SCSO')).toBeInTheDocument();

    // Check for "Invalid Date" text
    expect(screen.getByText('Invalid Date')).toBeInTheDocument();
  });
});
