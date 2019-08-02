import React from 'react';
import { Box, Card, Table, Text } from '@makerdao/ui-components-core';
import lang from 'languages';
import ExternalLink from 'components/ExternalLink';
import { fullActivityString, formatDate } from 'utils/ui';

export default function({ title, rows, network }) {
  rows = formatEventHistory(rows, network);
  return (
    <Box>
      <Text.h4>{title}</Text.h4>
      <Card px="l" pt="m" pb="l" my="s" css={{ overflowX: 'scroll' }}>
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
              <th>{lang.table.type}</th>
              <th>{lang.table.activity}</th>
              <th>{lang.table.time}</th>
              <th>{lang.table.sender_id}</th>
              <th>{lang.table.tx_hash}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(
              (
                [collateralType, actionMsg, dateOfAction, senderId, txHash],
                i
              ) => (
                <tr key={i}>
                  <td>
                    <Text color="darkPurple" t="body">
                      {collateralType}
                    </Text>
                  </td>
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
                    <Text t="caption">{senderId}</Text>
                  </td>
                  <td>
                    <Text t="caption">{txHash}</Text>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </Card>
    </Box>
  );
}

function formatEventHistory(events = [], network) {
  return events.map(e => {
    return [
      e.changeInCollateral.symbol,
      fullActivityString(e),
      formatDate(e.time),
      <ExternalLink key={1} string={e.senderAddress} network={network} />,
      <ExternalLink key={2} string={e.transactionHash} network={network} />
    ];
  });
}
