import React from 'react';

import lang from 'languages';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { getCDPTypeDetails } from 'reducers/network/cdpTypes';

// NOTE: CDP Page styles imported directly from prototype
const StyledCdp = styled.div`
  max-width: 1200px;
  margin: auto;
  span.last-active-date {
    font-size: 1.4rem;
    color: #9aa3ad;
    padding-left: 20px;
    letter-spacing: normal;
    font-weight: 400;
  }
  .grid-wrapper {
    background: #d9d9d9;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 50px;
  }
  .grid {
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid #d9d9d9;
    display: grid;
    grid-gap: 1px;
    grid-template-columns: 1fr 1fr;
  }
  .grid-item {
    background: #fff;
    padding: 30px 30px 20px 30px;
  }
  .flexbox {
    display: flex;
    flex-flow: row wrap;
    font-size: 10px;
    &:last-child {
      margin-bottom: 0;
    }
    .col {
      color: #9aa3ad;
      font-size: 1.5rem;
      font-weight: 400;

      &.strong {
        color: #231536;
        font-size: 1.7rem;
        font-weight: 600;
      }
      &.strong:first-child {
        margin-bottom: 15px;
      }

      margin-bottom: 10px;
      &:first-child {
        flex-grow: 1;
      }

      .heading {
        display: inline-block;
      }
      .heading-sm {
        font-size: 1.4rem;
        font-weight: 400;
        padding-left: 5px;
      }
    }
  }

  .section-values {
    margin-right: 15px;
    text-align: right;
    div {
      line-height: 20px;
    }
    div:nth-child(1) {
      color: #231536;
      font-size: 1.7rem;
    }
    div:nth-child(2) {
      color: #9aa3ad;
      font-size: 1.4rem;
    }
  }

  .max-avail-to-withdraw {
    max-width: 100px;
    line-height: 2rem;
  }

  .flexbox.button-section {
    &.section-1 {
      margin-top: 10px;
    }
    &.section-2 {
      margin-top: 20px;
    }
  }

  .separator {
    padding: 0 5px;
  }
  button {
    font-weight: 500;
    font-size: 1.6rem;
    color: #231536;
    background: #e2e9ec;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    user-select: none;
    &:focus {
      outline: none;
    }
    &:hover {
      background: #d7e2e6;
    }
    &:active {
      background: #1abc9c;
    }
    &:disabled {
      background: #e2e9ec;
      opacity: 0.5;
      cursor: not-allowed;
    }
    width: 120px;
    height: 40px;
    line-height: 38px;
  }
`;

const Heading = styled.div`
  display: block;
  padding-right: 20px;
  margin: 0;
  font-weight: 600;
  font-size: 28px;
  margin-bottom: 20px;
  letter-spacing: -1pt;
  color: #231536;
`;

function CDPView({ cdpTypeDetails }) {
  console.log(cdpTypeDetails);
  return (
    <StyledCdp>
      <Heading>
        {cdpTypeDetails.symbol} {lang.cdp}
      </Heading>
      <div className="grid-wrapper">
        <div className="grid">
          <div className="grid-item">
            <div className="flexbox">
              <div className="col strong">
                <div className="heading tooltip-underline">
                  {lang.cdp_page.liquidation_ratio}
                </div>
                <span className="heading-sm">
                  ({cdpTypeDetails.symbol}/USD)
                </span>
              </div>
              {/* <div className="col strong">{`${cdpTypeDetails.liquidationPrice}`}</div> */}
            </div>
            <div className="flexbox">
              <div className="col">
                <div className="heading tooltip-underline">
                  {lang.cdp_page.current_price_information}
                </div>
                <span className="heading-sm">
                  ({cdpTypeDetails.symbol}/USD)
                </span>
              </div>
              {/* <div className="col">{`${cdp.collateralPrice}`}</div> */}
            </div>
            <div className="flexbox">
              <div className="col">
                <div className="heading tooltip-underline">
                  {lang.cdp_page.liquidation_penalty}
                </div>
              </div>
              <div className="col">{cdpTypeDetails.liquidationPenalty} %</div>
            </div>
          </div>

          <div className="grid-item">
            <div className="flexbox">
              <div className="col strong">
                <div className="heading tooltip-underline">
                  {lang.cdp_page.collateralization_ratio}
                </div>
              </div>
              {/* <div className="col strong">{cdp.collateralizationRatio} %</div> */}
            </div>
            <div className="flexbox">
              <div className="col">
                <div className="heading tooltip-underline">
                  {lang.cdp_page.minimum_ratio}
                </div>
              </div>
              <div className="col">{cdpTypeDetails.liquidationRatio} %</div>
            </div>
            <div className="flexbox">
              <div className="col">
                <div className="heading tooltip-underline">
                  {lang.cdp_page.stability_fee}
                </div>
              </div>
              {/* <div className="col">{cdp.stabilityFee} %</div> */}
            </div>
          </div>
        </div>
      </div>
    </StyledCdp>
  );
}

function mapStateToProps(state, { cdpTypeSlug }) {
  return {
    cdpTypeDetails: getCDPTypeDetails(state, cdpTypeSlug)
  };
}

// ~~ cdpTypeDetails object for reference ~~
// ---------------------------------------
// const defaultCDPTypeState = {
//   key: '',
//   slug: '',
//   symbol: '',
//   rate: '0',
//   lastDrip: '0',
//   feedValueUSD: '0',
//   debtCeiling: '0',
//   adapterBalance: '0',
//   liquidationRatio: '0',
//   feedSetUSD: false,
//   liquidatorAddress: '',
//   liquidationPenalty: '0',
//   maxAuctionLotSize: '0',
//   priceWithSafetyMargin: '0'
// };
// ---------------------------------------

export default connect(mapStateToProps)(CDPView);
