import { takeSnapshot, restoreSnapshot } from '@makerdao/test-helpers';

let snapshotData;

const originalError = console.error;
beforeAll(async () => {
  snapshotData = await takeSnapshot();
  window.fathom = jest.fn();
  jest.setTimeout(10000);

  // this is just a little hack to silence a warning that we'll get until react
  // fixes this: https://github.com/facebook/react/pull/14853
  //
  // https://github.com/testing-library/react-testing-library/issues/281
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  window.fathom = undefined;
  restoreSnapshot(snapshotData);
});
