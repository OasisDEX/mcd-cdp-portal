import React from 'react';
import { connect } from 'react-redux';
import ReactJson from 'react-json-view';

function Overview({ systemState }) {
  return (
    <div>
      <h2>Overview</h2>
      <ReactJson
        src={{ ...systemState }}
        theme="bright:inverted"
        enableClipboard={false}
        displayDataTypes={false}
      />
    </div>
  );
}

function mapStateToProps(state) {
  return { systemState: state.network.system };
}

export default connect(mapStateToProps)(Overview);
