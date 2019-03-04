const mqBreakpoints = [['m', 950]];

const mqTemplate = (word, value) =>
  `@media only screen and (${word}-width: ${value}px)`;
function mqGenerate(val) {
  return {
    min: mqTemplate('min', val),
    max: mqTemplate('max', val)
  };
}

const mediaQueries = mqBreakpoints.reduce((acc, current) => {
  const [key, value] = current;
  return { ...acc, [key]: mqGenerate(value) };
}, {});

export { mediaQueries };
