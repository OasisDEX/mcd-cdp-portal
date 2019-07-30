import React from 'react';
import { cleanup, waitForElement } from '@testing-library/react';
import Payback from '../Payback';
import lang from '../../../languages';
import { renderForSidebar as render } from '../../../../test/helpers/render';

afterEach(cleanup);

test('basic rendering', async () => {
  const { getByText } = render(<Payback cdpId="1" />);

  await waitForElement(() => getByText(lang.action_sidebar.payback_title));

  // these throw errors if they don't match anything
  getByText('Pay Back DAI');
  getByText('7.5 DAI'); // art * rate
});
