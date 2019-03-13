import React from 'react';
import { hot } from 'react-hot-loader/root';
import PageContentLayout from 'layouts/PageContentLayout';
import lang from 'languages';
import { Box } from '@makerdao/ui-components-core';
import { Heading } from 'components/Typography';

function CDPView({ cdpTypeSlug }) {
  return (
    <PageContentLayout>
      <Box pr="m" mb="m">
        <Heading color="black2">
          {cdpTypeSlug.toUpperCase()} {lang.cdp}
        </Heading>
      </Box>
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

export default hot(CDPView);
