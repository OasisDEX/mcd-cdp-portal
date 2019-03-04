import React from 'react';
import PageContentLayout from 'layouts/PageContentLayout';
import lang from 'languages';
import styled from 'styled-components';

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

function CDPView({ cdpTypeSlug }) {
  return (
    <PageContentLayout>
      <Heading>
        {cdpTypeSlug.toUpperCase()} {lang.cdp}
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
                  {/* ({cdpTypeDetails.symbol}/USD) */}
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
                  {/* ({cdpTypeDetails.symbol}/USD) */}
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
              {/* <div className="col">{cdpTypeDetails.liquidationPenalty} %</div> */}
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
              {/* <div className="col">{cdpTypeDetails.liquidationRatio} %</div> */}
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
    </PageContentLayout>
  );
}

export default CDPView;
