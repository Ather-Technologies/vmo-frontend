import API_Interface from "./InterfaceForAPI";
import { InterfaceForAPI_DemoData } from "./DemoData";
import { ClipDate, Clip, FullClipDate, Tone } from "./types";

// Save original environment
const originalEnv = process.env;

// Mock fetch
global.fetch = jest.fn();

describe('API_Interface', () => {
  let api: API_Interface;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    api = new API_Interface();

    // Reset process.env
    process.env = { ...originalEnv };

    // Mock successful fetch response
    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true })
      })
    );
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('Demo mode tests', () => {
    beforeEach(() => {
      process.env.REACT_APP_DEMO = 'true';

      // Spy on demo data methods
      jest.spyOn(InterfaceForAPI_DemoData, 'getFullDateFromDateID');
      jest.spyOn(InterfaceForAPI_DemoData, 'getAllClipsByDateId');
      jest.spyOn(InterfaceForAPI_DemoData, 'getAllDatesBySourceId');
      jest.spyOn(InterfaceForAPI_DemoData, 'getAllTonesBySourceId');
    });

    test('getFullDateFromDateID calls demo data in demo mode', async () => {
      await api.getFullDateFromDateID(1);
      expect(InterfaceForAPI_DemoData.getFullDateFromDateID).toHaveBeenCalledWith(1);
      expect(fetch).not.toHaveBeenCalled();
    });

    test('getAllClipsByDateId calls demo data in demo mode', async () => {
      await api.getAllClipsByDateId(1);
      expect(InterfaceForAPI_DemoData.getAllClipsByDateId).toHaveBeenCalledWith(1);
      expect(fetch).not.toHaveBeenCalled();
    });

    test('getAllDatesBySourceId calls demo data in demo mode', async () => {
      await api.getAllDatesBySourceId(1);
      expect(InterfaceForAPI_DemoData.getAllDatesBySourceId).toHaveBeenCalledWith(1);
      expect(fetch).not.toHaveBeenCalled();
    });

    test('getAllTonesBySourceId calls demo data in demo mode', async () => {
      await api.getAllTonesBySourceId(1);
      expect(InterfaceForAPI_DemoData.getAllTonesBySourceId).toHaveBeenCalledWith(1);
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  describe('API mode tests', () => {
    beforeEach(() => {
      process.env.REACT_APP_DEMO = '';
      process.env.REACT_APP_API_HOST = 'https://api.example.com';
    });

    test('getFullDateFromDateID calls API with correct URL', async () => {
      await api.getFullDateFromDateID(1);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/dates/one/date_id/1',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          })
        })
      );
    });

    test('getAllClipsByDateId calls API with correct URL', async () => {
      await api.getAllClipsByDateId(1);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/clips/many/date_id/1',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          })
        })
      );
    });

    test('getAllDatesBySourceId calls API with correct URL', async () => {
      await api.getAllDatesBySourceId(1);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/dates/many/source_id/1',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          })
        })
      );
    });

    test('getAllTonesBySourceId calls API with correct URL', async () => {
      await api.getAllTonesBySourceId(1);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/tones/many/source_id/1',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          })
        })
      );
    });
  });

  describe('makeApiFetch error handling', () => {
    beforeEach(() => {
      process.env.REACT_APP_DEMO = '';
      process.env.REACT_APP_API_HOST = 'https://api.example.com';
    });

    test('makeApiFetch handles network errors and returns empty array', async () => {
      // Mock a fetch network error
      (global.fetch as jest.Mock).mockImplementation(() => {
        throw new Error('Network error');
      });

      const result = await api.makeApiFetch('/test/url');
      expect(result).toEqual([]);
    });

    test('makeApiFetch returns parsed JSON response', async () => {
      const mockResponse = { data: [{ id: 1, name: 'Test' }] };
      (global.fetch as jest.Mock).mockImplementation(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockResponse)
        })
      );

      const result = await api.makeApiFetch('/test/url');
      expect(result).toEqual(mockResponse);
    });

    test('makeApiFetch properly handles quote characters in URL', async () => {
      await api.makeApiFetch('/test/url"with"quotes');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/test/urlwithquotes',
        expect.any(Object)
      );
    });
  });

  describe('Response parsing', () => {
    beforeEach(() => {
      process.env.REACT_APP_DEMO = '';
      process.env.REACT_APP_API_HOST = 'https://api.example.com';
    });

    test('getFullDateFromDateID correctly extracts date property from response', async () => {
      const mockDateResponse = {
        date: {
          id: 1,
          date: '2023-06-15',
          source: {
            id: 1,
            name: 'Test Source',
            shorthand: 'TS',
            timezone: 'UTC'
          }
        }
      };

      (global.fetch as jest.Mock).mockImplementation(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockDateResponse)
        })
      );

      const result = await api.getFullDateFromDateID(1);
      expect(result).toEqual(mockDateResponse.date);
    });

    test('returns empty array when fetch response is undefined', async () => {
      (global.fetch as jest.Mock).mockImplementation(() => undefined);

      const result = await api.getAllClipsByDateId(1);
      expect(result).toEqual([]);
    });
  });
});
const api = new API_Interface();

global.fetch = jest.fn() as jest.Mock;

beforeAll(() => {
  // Set the demo environment variable to true for testing date to be used in the tests
  process.env.REACT_APP_DEMO = "test";
});

test("call getAllClipsByDateId check for correct result", async () => {
  expect(await api.getAllClipsByDateId(1)).toEqual(
    InterfaceForAPI_DemoData.getAllClipsByDateId(1)
  );
});

test("call getFullDateFromDateID check for correct result", async () => {
  expect(await api.getFullDateFromDateID(1)).toEqual(
    InterfaceForAPI_DemoData.getFullDateFromDateID(1)
  );
});

test("call getAllDatesBySourceId check for correct result", async () => {
  expect(await api.getAllDatesBySourceId(1)).toEqual(
    InterfaceForAPI_DemoData.getAllDatesBySourceId(1)
  );
});

test("call getAllTonesBySourceId check for correct result", async () => {
  expect(await api.getAllTonesBySourceId(1)).toEqual(
    InterfaceForAPI_DemoData.getAllTonesBySourceId(1)
  );
});

test("check api fetch parses data correctly", async () => {
  global.fetch = jest.fn(async () => {
    return {
      json: () => {
        return { test: true };
      },
    };
  }) as jest.Mock;

  expect(await api.makeApiFetch("")).toEqual({ test: true });
});

test("check error handling on api fetch function", async () => {
  expect(await api.makeApiFetch("")).toEqual([]);
});
