import React from 'react';
import { Box, Card, Table, Text } from '@makerdao/ui-components-core';
import useLanguage from 'hooks/useLanguage';
import ExternalLink from 'components/ExternalLink';
import { formatEventDescription, formatDate } from 'utils/ui';
import theme from 'styles/theme';

export default function({ title, rows, network }) {
  const { lang } = useLanguage();
  if (rows) rows = formatEventHistory(lang, rows, network);

  const emSize = parseInt(getComputedStyle(document.body).fontSize);
  const pxBreakpoint = parseInt(theme.breakpoints.m) * emSize;
  const overflowX =
    document.documentElement.clientWidth > pxBreakpoint ? 'hidden' : 'scroll';

  return (
    <Box>
      <Text.h4>{title}</Text.h4>
      <Card
        px="l"
        py="m"
        my="s"
        css={{
          overflowX
        }}
      >
        <Table
          width="100%"
          variant="normal"
          css={`
            td,
            th {
              padding-right: 10px;
            }
          `}
        >
          <thead>
            <tr>
              <th>{lang.table.activity}</th>
              <th>{lang.table.date}</th>
              <th>{lang.table.tx_hash}</th>
            </tr>
          </thead>
          <tbody>
            {rows ? (
              rows.map(([actionMsg, dateOfAction, txHash], i) => (
                <tr key={i}>
                  <td
                    css={`
                      white-space: nowrap;
                      max-width: 205px;
                      text-overflow: ellipsis;
                      overflow: hidden;
                    `}
                  >
                    <Text color="darkLavender" t="caption">
                      {actionMsg}
                    </Text>
                  </td>
                  <td
                    css={`
                      white-space: nowrap;
                    `}
                  >
                    <Text color="darkLavender" t="caption">
                      {dateOfAction}
                    </Text>
                  </td>
                  <td>
                    <Text t="caption" color="blue">
                      {txHash}
                    </Text>
                  </td>
                </tr>
              ))
            ) : (
              <tr key={0}>
                <td colSpan="3">
                  <Text color="darkLavender" t="caption">
                    Loading...
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </Box>
  );
}

function formatEventHistory(lang, events = [], network) {
  return events.map(e => {
    return [
      formatEventDescription(lang, e),
      formatDate(new Date(e.timestamp * 1000)),
      <ExternalLink
        key={1}
        string={e.txHash}
        network={network}
        arrowInheritsColorOnHover={true}
      />
    ];
  });
}
