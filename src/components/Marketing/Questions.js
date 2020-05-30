import styled from 'styled-components';
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Flex, Text } from '@makerdao/ui-components-core';

const answerAnimationTime = '350ms';
const separatorColor = '#EBEBEB';

const QuestionAndAnswerStyle = styled.div`
  position: relative;

  .question-row {
    padding-top: 27px;
    padding-bottom: 24px;
    letter-spacing: 0.007em;
    position: relative;
    border-bottom: 1px solid ${separatorColor};
  }

  .question {
    margin-right: 58px;
    line-height: 31px;

    @media (min-width: ${props => props.theme.breakpoints.m}) {
      line-height: 36px;
    }
  }

  .answer {
    overflow: hidden;
    transition: max-height ${answerAnimationTime} ease;
    font-size: 18px;
    line-height: 29px;

    a {
      text-decoration: underline;
    }

    .answer-text {
      padding: 32px 10px 32px 32px;
    }
  }

  .plus-minus-toggle {
    cursor: pointer;
    height: 20px;
    position: absolute;
    width: 20px;
    right: 6px;
    top: calc(50% - 3px);
    z-index: 2;

    &:before,
    &:after {
      background: #000;
      content: '';
      height: 2px;
      left: 0;
      position: absolute;
      top: 0;
      width: 20px;
      border-radius: 1px;
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

    // todo: move subscribing to resize to Questions component
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
          <Text.h4 className="question">{question}</Text.h4>
          <div className="plus-minus-toggle" />
        </div>
      </div>
      <div className="answer" style={{ maxHeight: isSelected ? height : 0 }}>
        <div ref={answerElement}>
          <Text as="div" className="answer-text">
            {answer}
          </Text>
        </div>
      </div>
    </QuestionAndAnswerStyle>
  );
};

function buildQuestionsFromLangObj(questionsObj, lang) {
  const questions = [];
  const link = (url, text) => (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {text}
    </a>
  );
  let questionNum = 1;
  while (questionsObj[`question${questionNum}`]) {
    const links = [];
    let linkNum = 1;
    while (questionsObj[`answer${questionNum}_link${linkNum}_url`]) {
      links.push(
        link(
          questionsObj[`answer${questionNum}_link${linkNum}_url`],
          questionsObj[`answer${questionNum}_link${linkNum}_text`]
        )
      );
      linkNum++;
    }
    questions.push({
      q: questionsObj[`question${questionNum}`],
      a: lang.formatString(questionsObj[`answer${questionNum}`], ...links)
    });
    questionNum++;
  }
  return questions;
}

const SeparatorLine = styled.div`
  position: relative;
  height: 1px;
  border-top: 1px solid ${separatorColor};
  top: ${props => (props.isSelected ? 0 : '-1px')};
`;

const Links = styled(Flex)`
  font-size: ${props => props.theme.fontSizes.s};
  align-items: center;
  text-decoration: underline;
  margin-top: 32px;

  flex-direction: column;
  a {
    margin-bottom: 14px;
  }

  @media (min-width: ${props => props.theme.breakpoints.m}) {
    flex-direction: row;
    a {
      margin-bottom: inherit;
    }
  }
`;

export const QuestionsWrapper = styled(Box).attrs(props => ({
  mt: props.mt || { s: '159px', m: '280px' },
  mb: props.mb || { s: '-37px', m: '126px' }
}))``;

const Questions = ({ questions, links }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <Box
      style={{
        maxWidth: '800px',
        textAlign: 'left',
        fontSize: '18px',
        lineHeight: '25px'
      }}
      px={{ s: '12px', m: 0 }}
      m={{ s: '25px auto', m: '29px auto' }}
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
            <SeparatorLine isSelected={isSelected} />
          </div>
        );
      })}
      <Links>{links}</Links>
    </Box>
  );
};

Questions.propTypes = {
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      q: PropTypes.string,
      a: PropTypes.any
    })
  )
};

export { buildQuestionsFromLangObj };

export default Questions;
