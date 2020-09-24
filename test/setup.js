import { takeSnapshot, restoreSnapshot } from '@makerdao/test-helpers';

let snapshotData;

beforeAll(async () => {
  snapshotData = await takeSnapshot();
  window.fathom = jest.fn();
  jest.setTimeout(10000);
});

afterAll(() => {
  window.fathom = undefined;
  restoreSnapshot(snapshotData);
});
