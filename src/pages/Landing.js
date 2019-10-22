import React, { useRef, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import styled from 'styled-components';
import { Link } from 'react-navi';

import OasisLayout from '../layouts/OasisLayout';
import SEO from '../components/SEO';
import mixpanel from 'mixpanel-browser';
import { Routes } from '../utils/constants';

import { ReactComponent as BatIcon } from '../images/oasis-tokens/bat.svg';
import { ReactComponent as ZrxIcon } from '../images/oasis-tokens/zrx.svg';
import { ReactComponent as EthIcon } from '../images/oasis-tokens/eth.svg';
import { ReactComponent as DaiIcon } from '../images/oasis-tokens/dai.svg';
import { ReactComponent as RepIcon } from '../images/oasis-tokens/rep.svg';

const Hero = styled.div`
  color: #1e2e3a;
  font-size: 38px;
  margin-top: 97px;
`;

const Cards = styled.div`
  max-width: 1000px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 80px auto;

  @media (max-width: 1020px) {
    max-width: 300px;
  }
`;

const Card = styled.div`
  overflow: hidden;
  border-radius: 15px;
  width: 300px;
  height: 355px;
  color: #ffffff;
  position: relative;
  flex-shrink: 1;

  @media (max-width: 1020px) {
    margin-bottom: 35px;
  }

  .title {
    font-size: 29px;
    margin-top: 56px;
  }

  .description {
    font-size: 17px;
    margin-top: 25px;
    margin-right: 23px;
    margin-left: 23px;
    line-height: 26px;
  }

  .buttonContainer {
    position: absolute;
    bottom: 32px;
    width: 100%;
  }

  .button {
    padding-right: 22px;
    padding-left: 22px;
    border-radius: 6px;
    display: inline-block;
    font-size: 15px;
    font-weight: 500;
    height: 39px;
    line-height: 38px;
    text-decoration: none;
  }

  .button.enabled {
    box-shadow: 0 2px 2px #c8e4e6;
    transition: all 0.15s ease;
  }

  .button.enabled:hover {
    box-shadow: 0 5px 5px #c8e4e6;
    transform: translateY(-1px);
  }
`;

const TextSection = styled.div`
  margin-top: 81px;

  h3 {
    font-size: 30px;
    font-weight: normal;
    margin-bottom: 20px;
    line-height: 40px;
  }

  p {
    max-width: 580px;
    margin: 0 auto;
    font-size: 20px;
    line-height: 30px;
  }
`;

const tokens = [
  {
    name: 'Dai',
    icon: DaiIcon
  },
  {
    name: 'Ethereum',
    icon: EthIcon
  },
  {
    name: 'Augur',
    icon: RepIcon
  },
  {
    name: '0x',
    icon: ZrxIcon
  },
  {
    name: 'Basic Attention Token',
    icon: BatIcon
  }
];

const TokenList = styled.div`
  max-width: 978px;
  display: flex;
  justify-content: center;
  align-content: space-between;
  flex-wrap: wrap;
  margin: 40px auto;

  @media (max-width: 1000px) {
    max-width: 560px;
  }
`;

const Token = ({ name, icon }) => {
  const Icon = icon;
  return (
    <div style={{ display: 'flex', alignItems: 'center', margin: '20px 35px' }}>
      <Icon width="22" height="22" style={{ flexGrow: 0, flexShrink: 0 }} />
      <span
        style={{
          fontSize: '17px',
          lineHeight: '22px',
          marginLeft: '13px',
          flexGrow: 0,
          flexShrink: 0
        }}
      >
        {name}
      </span>
    </div>
  );
};

const answerPaddingBottom = 21;
const answerAnimationTime = '350ms';

const QuestionAndAnswerStyle = styled.div`
  position: relative;

  .question-row {
    padding-top: 14px;
    padding-bottom: 18px;
    letter-spacing: 0.007em;
    position: relative;
  }

  .question {
    margin-right: 25px;
  }

  .answer {
    overflow: hidden;
    transition: max-height ${answerAnimationTime} ease,
      padding-bottom ${answerAnimationTime} ease;
    font-size: 18px;
    line-height: 29px;

    a {
      text-decoration: underline;
    }
  }

  &.active {
    .answer {
      padding-bottom: ${answerPaddingBottom}px;
    }
  }
  .plus-minus-toggle {
    cursor: pointer;
    height: 21px;
    position: absolute;
    width: 21px;
    right: 4px;
    top: 50%;
    z-index: 2;

    &:before,
    &:after {
      background: #000;
      content: '';
      height: 1px;
      left: 0;
      position: absolute;
      top: 0;
      width: 21px;
      transition: transform ${answerAnimationTime} ease,
        opacity ${answerAnimationTime} ease;
    }

    &:after {
      transform-origin: center;
      opacity: 0;
    }
  }

  &.collapsed {
    .plus-minus-toggle {
      &:after {
        transform: rotate(90deg);
        opacity: 1;
      }

      &:before {
        transform: rotate(180deg);
      }
    }
  }
`;
function debounce(fn, ms) {
  let timer;
  return _ => {
    clearTimeout(timer);
    timer = setTimeout(_ => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}

const QuestionAndAnswer = ({ question, answer, onClick, isSelected }) => {
  const answerElement = useRef(null);
  const [height, setHeight] = React.useState(0);
  React.useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setHeight(answerElement.current ? answerElement.current.clientHeight : 0);
    }, 300);

    window.addEventListener('resize', debouncedHandleResize);
    if (answerElement.current && height === 0) {
      setHeight(answerElement.current.clientHeight);
    }
    return _ => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, [height]);

  return (
    <QuestionAndAnswerStyle
      key={question}
      className={isSelected ? 'active' : 'collapsed'}
    >
      <div className="question-row">
        <div style={{ cursor: 'pointer' }} onClick={onClick}>
          <div className="question">{question}</div>
          <div className="plus-minus-toggle" />
        </div>
      </div>
      <div
        className="answer"
        style={{ maxHeight: isSelected ? height + answerPaddingBottom : 0 }}
      >
        <div ref={answerElement}>{answer}</div>
      </div>
    </QuestionAndAnswerStyle>
  );
};

const Questions = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const questions = [
    {
      q: 'What is Oasis?',
      a:
        'Oasis is a decentralized application which runs on the Ethereum blockchain. Allowing anyone to trade tokens, borrow against them and earn savings using Dai.'
    },
    {
      q: 'What is Dai?',
      a: (
        <span>
          Dai is a stablecoin soft pegged to the US Dollar. It aims to be 1 Dai
          = $1 USD, but this can vary slightly. Read more{' '}
          <a
            href="https://makerdao.com/dai/"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
          .
        </span>
      )
    },
    {
      q: 'Do I need an account?',
      a: (
        <span>
          You do not need an account to use Oasis. However, you will need an
          Ethereum wallet. Oasis supports most Ethereum browser wallets such as{' '}
          <a
            href="https://metamask.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Metamask
          </a>
          ,{' '}
          <a
            href="https://wallet.coinbase.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Coinbase Wallet
          </a>
          , etc.
        </span>
      )
    },
    {
      q: 'Why are Borrow and Save not yet available?',
      a: (
        <span>
          Borrow and Save are features coming with the launch of
          Multi-Collateral Dai. You can track{' '}
          <a
            href="https://makerdao.com/roadmap/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Multi-Collateral Dai progress here
          </a>
          .
        </span>
      )
    },
    {
      q: 'Is it secure?',
      a:
        'We conduct a range of audits on all of our smart contracts and the Oasis code is open-source.'
    },
    {
      q: 'Are there fees?',
      a: (
        <span>
          Oasis does not charge any fees, although you will have to pay{' '}
          <a
            href="https://kb.myetherwallet.com/en/transactions/what-is-gas/"
            target="_blank"
            rel="noopener noreferrer"
          >
            gas
          </a>{' '}
          and other fees associated with the Maker Protocol, such as Stability
          Fees.
        </span>
      )
    },
    {
      q: 'I have a question, how can I get in contact with you?',
      a: (
        <span>
          You can reach the team by contacting us on{' '}
          <a
            href="https://chat.makerdao.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            our chat
          </a>
          .
        </span>
      )
    },
    {
      q: 'Can I buy Bitcoin or Ethereum with my bank account on Oasis?',
      a:
        'You cannot buy crypto from your bank account using Oasis. Instead, you can use Dai to buy Ethereum and other supported tokens. '
    }
  ];

  return (
    <div
      style={{
        maxWidth: '700px',
        margin: '0 auto',
        textAlign: 'left',
        fontSize: '18px',
        lineHeight: '25px'
      }}
    >
      {questions.map(({ q, a }, index) => {
        const isSelected = index === selectedIndex;
        return (
          <div key={q}>
            <QuestionAndAnswer
              question={q}
              answer={a}
              onClick={() => setSelectedIndex(isSelected ? null : index)}
              isSelected={isSelected}
            />
            {index < questions.length - 1 ? (
              <div
                style={{ borderBottom: '1px solid #9E9E9E', opacity: 0.9 }}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

function Landing() {
  return (
    <OasisLayout>
      <SEO title="Oasis" />
      <Hero>Trade, borrow and save using Dai.</Hero>
      <Cards>
        <Card
          style={{
            background:
              'linear-gradient(180deg, #C2D7E4 0%, #DBF1EC 100%), #7AAAC5'
          }}
        >
          <div className="title" style={{ color: '#253A44' }}>
            Trade
          </div>
          <div className="description" style={{ color: '#14303A' }}>
            Place orders in the Marketplace, or simply exchange your tokens
            instantly for what's available.
          </div>
          <div className="buttonContainer">
            <a
              href="https://oasis.app/trade"
              className="button enabled"
              style={{
                color: '#5894B5',
                backgroundColor: 'white'
              }}
              onClick={() => {
                mixpanel.track('btn-click', {
                  id: 'StartTrading',
                  product: 'oasis-landing'
                });
              }}
            >
              Start Trading
            </a>
          </div>
        </Card>
        <Card
          style={{
            background:
              'linear-gradient(180deg, #F0DED8 0%, #FDF2E1 100%), linear-gradient(0deg, #EFBF98, #EFBF98)'
          }}
        >
          <div className="title" style={{ color: '#5B2E1B' }}>
            Borrow
          </div>
          <div className="description" style={{ color: '#5B2E1B' }}>
            Lock your tokens as collateral to generate Dai, a decentralized
            cryptocurrency pegged to 1 USD.
          </div>
          <div className="buttonContainer">
            <div className="button">
              <Link
                href={`/${Routes.BORROW}`}
                prefetch={true}
                className="button enabled"
                style={{
                  color: '#5894B5',
                  backgroundColor: 'white'
                }}
              >
                Borrow Dai
              </Link>
            </div>
          </div>
        </Card>
        <Card
          style={{
            background: 'linear-gradient(180deg, #D5E8E3 0%, #EEF0E4 100%)',
            marginBottom: 0
          }}
        >
          <div className="title" style={{ color: '#002F28' }}>
            Save
          </div>
          <div className="description" style={{ color: '#002F28' }}>
            Earn savings on your Dai by locking it into Oasis Save. Automatic
            and non-custodial.
          </div>
          <div className="buttonContainer">
            <div className="button">
              <Link
                href={`/${Routes.SAVE}`}
                prefetch={true}
                className="button enabled"
                style={{
                  color: '#5894B5',
                  backgroundColor: 'white'
                }}
              >
                Save Dai
              </Link>
            </div>
          </div>
        </Card>
      </Cards>
      <TextSection style={{ marginTop: '103px' }}>
        <h3>Currently supported by Oasis Trade</h3>
        <TokenList>
          {tokens.map(({ name, icon }) => (
            <Token name={name} icon={icon} key={name} />
          ))}
        </TokenList>
      </TextSection>
      <TextSection style={{ marginTop: '108px' }}>
        <h3>What's the Story</h3>
        <p>
          Oasis is a platform for decentralized finance. Use it to trade tokens,
          borrow Dai and earn savings — all in one place.
        </p>
      </TextSection>
      <TextSection>
        <h3>Secure protocol built on Ethereum</h3>
        <p>
          Oasis is built on top of audited and formally verified smart contracts
          created by Maker, the industry leader in secure decentralized finance.
        </p>
      </TextSection>
      <TextSection>
        <h3>Completely Permissionless</h3>
        <p>
          Anyone can access the system simply by using an ethereum supported
          wallet. Oasis is a decentralized, non-custodial platform. We can never
          touch or control your assets.
        </p>
      </TextSection>
      <TextSection>
        <h3>Questions</h3>
        <Questions />
      </TextSection>
    </OasisLayout>
  );
}

export default hot(Landing);
