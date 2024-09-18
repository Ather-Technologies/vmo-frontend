import { render, screen } from '@testing-library/react';
import DatesNavigation from './DatesNavigation';
import { ClipDateStateDataProp, FullClipDate } from '../lib/types';

test('renders DatesNavigation and button component', async () => {
  const setClipID = jest.fn();
  const setDateID = jest.fn();
  const setSelectedDateFullData = jest.fn();

  const clip_id = NaN;
  const date_id = NaN;
  const selectedDateFullData: FullClipDate = {
    id: NaN,
    date: '???',
    source: {
      id: NaN,
      name: '???',
      shorthand: '???',
      timezone: '???'
    }
  };

  // Object to pass to the ClipsPage and DatesNavigation and other child components
  const CDStateData: ClipDateStateDataProp = {
    clip_id,
    date_id,
    setClipID,
    setDateID,
    selectedDateFullData, // This is the row data for the selected date from the DB
    setSelectedDateFullData // This is the setter for the selectedDateFullData
  };

  HTMLMediaElement.prototype.load = () => {};

  render(<DatesNavigation CDStateData={CDStateData} />);

  const sourceName = screen.getByText("Please pick a date");

  expect(sourceName).toBeInTheDocument();
});
