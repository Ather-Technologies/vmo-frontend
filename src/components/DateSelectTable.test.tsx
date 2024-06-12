import { render, screen } from '@testing-library/react';
import { act } from 'react';
import DateSelectTable from './DateSelectTable';
import { ClipDateStateDataProp, FullClipDate } from '../lib/types';

test('renders DateSelectTable and table elements', async () => {
  process.env.REACT_APP_DEMO = "test";

  const setIsExpanded = jest.fn();

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

  await act(async () => {
    render(<DateSelectTable CDStateData={CDStateData} setIsExpanded={setIsExpanded} />);

  });


  const dateText = screen.getByText("06/10/24");
  const clipsCount = screen.getByText("1 Clip");
  const sourceName = screen.getAllByText("Sanders County Sheriff's Office")[0];
  // const loadingText = screen.getByText("Loading dates...");

  expect(dateText).toBeInTheDocument();
  expect(clipsCount).toBeInTheDocument();
  expect(sourceName).toBeInTheDocument();
  // expect(loadingText).toBeInTheDocument();
});
