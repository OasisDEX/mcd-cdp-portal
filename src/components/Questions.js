import styled from 'styled-components';
import React, { useRef, useState } from 'react';
import useLanguage from 'hooks/useLanguage';

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
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
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
    setHeight(answerElement.current ? answerElement.current.clientHeight : 0);
    // set the height after fonts have probably loaded, or system font is used
    const timeoutId = setTimeout(() => {
      setHeight(answerElement.current ? answerElement.current.clientHeight : 0);
    }, 3200);
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
      clearTimeout(timeoutId);
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

export default Questions;
