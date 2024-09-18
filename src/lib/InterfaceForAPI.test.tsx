import API_Interface from "./InterfaceForAPI";
import { InterfaceForAPI_DemoData } from "./DemoData";

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
