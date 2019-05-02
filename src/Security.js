class Security {
  constructor(props) {
    props = props || {};

    this.consoleLog = props.consoleLog || console.log;
  }

  printConsoleInjectionWarning = () => {
    this.consoleLog('%c📛STOP📛', 'color: red; font-size: 100pt;');
    this.consoleLog(
      '%cThis is a console for developers. If someone has asked you ' +
        'to open this window, they are likely trying to compromise your ' +
        'session. This could result in the loss of funds!',
      'color: red;'
    );
    this.consoleLog('%cPlease close this window now.', 'color: blue;');
  };
}

export default Security;
