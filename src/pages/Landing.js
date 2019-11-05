import React, { useRef, useState } from 'react';
import { hot } from 'react-hot-loader/root';
import styled from 'styled-components';
import { Link, useCurrentRoute } from 'react-navi';

import OasisLayout from '../layouts/OasisLayout';
import SEO from '../components/SEO';
import mixpanel from 'mixpanel-browser';
import { Routes } from '../utils/constants';
import useLanguage from 'hooks/useLanguage';

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
    setHeight(answerElement.current.clientHeight);
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
  const { lang } = useLanguage();
  const link = (url, text) => (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {text}
    </a>
  );
  const questions = [
    {
      q: lang.landing_page.question1,
      a: lang.landing_page.answer1
    },
    {
      q: lang.landing_page.question2,
      a: lang.formatString(
        lang.landing_page.answer2,
        link(
          lang.landing_page.answer2_link1_url,
          lang.landing_page.answer2_link1_text
        )
      )
    },
    {
      q: lang.landing_page.question3,
      a: lang.formatString(
        lang.landing_page.answer3,
        link(
          lang.landing_page.answer3_link1_url,
          lang.landing_page.answer3_link1_text
        ),
        link(
          lang.landing_page.answer3_link2_url,
          lang.landing_page.answer3_link2_text
        )
      )
    },
    {
      q: lang.landing_page.question4,
      a: lang.formatString(
        lang.landing_page.answer4,
        link(
          lang.landing_page.answer4_link1_url,
          lang.landing_page.answer4_link1_text
        )
      )
    },
    {
      q: lang.landing_page.question5,
      a: lang.formatString(
        lang.landing_page.answer5,
        link(
          lang.landing_page.answer5_link1_url,
          lang.landing_page.answer5_link1_text
        )
      )
    },
    {
      q: lang.landing_page.question6,
      a: lang.landing_page.answer6
    },
    {
      q: lang.landing_page.question7,
      a: lang.formatString(
        lang.landing_page.answer7,
        link(
          lang.landing_page.answer7_link1_url,
          lang.landing_page.answer7_link1_text
        )
      )
    },
    {
      q: lang.landing_page.question8,
      a: lang.landing_page.answer8
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
  const { url } = useCurrentRoute();
  const { lang } = useLanguage();

  return (
    <OasisLayout>
      <SEO title="Oasis" />
      <Hero>{lang.landing_page.headline}</Hero>
      <Cards>
        <Card
          style={{
            background:
              'linear-gradient(180deg, #C2D7E4 0%, #DBF1EC 100%), #7AAAC5'
          }}
        >
          <div className="title" style={{ color: '#253A44' }}>
            {lang.landing_page.trade_card.title}
          </div>
          <div className="description" style={{ color: '#14303A' }}>
            {lang.landing_page.trade_card.description}
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
              {lang.landing_page.trade_card.button}
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
            {lang.landing_page.borrow_card.title}
          </div>
          <div className="description" style={{ color: '#5B2E1B' }}>
            {lang.landing_page.borrow_card.description}
          </div>
          <div className="buttonContainer">
            <div className="button">
              <Link
                href={`/${Routes.BORROW}${url.search}`}
                prefetch={true}
                className="button enabled"
                style={{
                  color: '#5894B5',
                  backgroundColor: 'white'
                }}
              >
                {lang.landing_page.borrow_card.button}
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
            {lang.landing_page.save_card.title}
          </div>
          <div className="description" style={{ color: '#002F28' }}>
            {lang.landing_page.save_card.description}
          </div>
          <div className="buttonContainer">
            <div className="button">
              <Link
                href={`/${Routes.SAVE}${url.search}`}
                prefetch={true}
                className="button enabled"
                style={{
                  color: '#5894B5',
                  backgroundColor: 'white'
                }}
              >
                {lang.landing_page.save_card.button}
              </Link>
            </div>
          </div>
        </Card>
      </Cards>
      <TextSection style={{ marginTop: '103px' }}>
        <h3>{lang.landing_page.token_section_title}</h3>
        <TokenList>
          {tokens.map(({ name, icon }) => (
            <Token name={name} icon={icon} key={name} />
          ))}
        </TokenList>
      </TextSection>
      <TextSection style={{ marginTop: '108px' }}>
        <h3>{lang.landing_page.section1_title}</h3>
        <p>{lang.landing_page.section1_p}</p>
      </TextSection>
      <TextSection>
        <h3>{lang.landing_page.section2_title}</h3>
        <p>{lang.landing_page.section2_p}</p>
      </TextSection>
      <TextSection>
        <h3>{lang.landing_page.section3_title}</h3>
        <p>{lang.landing_page.section3_p}</p>
      </TextSection>
      <TextSection>
        <h3>{lang.landing_page.questions_title}</h3>
        <Questions />
      </TextSection>
    </OasisLayout>
  );
}

export default hot(Landing);
