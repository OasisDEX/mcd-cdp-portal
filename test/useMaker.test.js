import React from 'react';
import { render, cleanup } from 'react-testing-library';
import waitForExpect from 'wait-for-expect';

import MakerHooksProvider from '../src/providers/MakerHooksProvider';
import useMaker from '../src/hooks/useMaker';
import config from '../src/references/config.json';

// This helper component allows us to call the hook in a component context.
function TestHook({ callback }) {
  callback();
  return null;
}

function testHookWithMakerProvider(callback) {
  render(
    <MakerHooksProvider rpcUrl={config.rpcUrls[42]} network="kovan">
      <TestHook callback={callback} />
    </MakerHooksProvider>
  );
}

let useMakerHookValue;
beforeAll(() => {
  testHookWithMakerProvider(() => (useMakerHookValue = useMaker()));
});

afterEach(cleanup);

// we allow up to 10 seconds for this
test('maker is properly instantiated and authenticated within the maker provider', async () => {
  expect(useMakerHookValue.authenticated).toBe(false);
  await waitForExpect(() => {
    expect(useMakerHookValue.authenticated).toBe(true);
    expect(useMakerHookValue.maker).not.toBe(null);
  }, 10000);
}, 10500);
