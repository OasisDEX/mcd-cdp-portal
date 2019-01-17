import React from 'react';
import { connect } from 'react-redux';
import { getCDPType } from 'reducers/network/cdpTypes';
import ReactJson from 'react-json-view';
import cdpTypes from 'references/cdpTypes';

function CDPView({ cdpTypeDetails, cdpSymbol }) {
  return (
    <div>
      <h2>CDP Type: {cdpSymbol}</h2>
      <ReactJson
        src={{ ...cdpTypeDetails }}
        theme="bright:inverted"
        enableClipboard={false}
        displayDataTypes={false}
      />
    </div>
  );
}

function mapStateToProps(state, { cdpTypeSlug }) {
  return {
    cdpTypeDetails: getCDPType(state, cdpTypeSlug),
    cdpSymbol: cdpTypes.find(({ slug }) => slug === cdpTypeSlug).symbol
  };
}

export default connect(mapStateToProps)(CDPView);
