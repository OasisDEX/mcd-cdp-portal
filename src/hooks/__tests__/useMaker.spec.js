import React from 'react';
import { render, cleanup } from 'react-testing-library';
import waitForExpect from 'wait-for-expect';

import MakerProvider from '../../providers/MakerProvider';
import useMaker from '../useMaker';
import config from '../../references/config.json';

// This helper component allows us to call the hook in a component context.
function TestHook({ callback }) {
  callback();
  return null;
}

function testHookWithMakerProvider(callback) {
  render(
    <MakerProvider rpcUrl={config.rpcUrls[42]} network="kovan">
      <TestHook callback={callback} />
    </MakerProvider>
  );
}

let useMakerHookValue;
beforeAll(() => {
  testHookWithMakerProvider(() => (useMakerHookValue = useMaker()));
});

afterEach(cleanup);

// we allow up to 10 seconds for this
// test will throw a warning, see here for explanation:
// https://github.com/testing-library/react-testing-library/issues/281#issuecomment-480349256
test('maker is properly instantiated and authenticated within the maker provider', async () => {
  expect(useMakerHookValue.authenticated).toBe(false);
  await waitForExpect(() => {
    expect(useMakerHookValue.authenticated).toBe(true);
    expect(useMakerHookValue.maker).not.toBe(null);
  }, 10000);
}, 10500);
