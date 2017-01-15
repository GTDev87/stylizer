import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

import autobind from 'autobind-decorator';
import { transform } from 'babel-standalone';

// Import Style
import styles from './ComponentStyler.css';

import styled from 'styled-components';
import CodeMirror from 'react-codemirror';

import { html as htmlBeautifier } from 'js-beautify';


if (typeof navigator !== 'undefined') {
  require('codemirror/mode/jsx/jsx'); // eslint-disable-line global-require
  require('codemirror/mode/htmlmixed/htmlmixed'); // eslint-disable-line global-require
  require('codemirror/mode/css/css'); // eslint-disable-line global-require
}

import ComponentStyledTheme from '../../../../StyledThemer/components/ComponentStyledTheme/ComponentStyledTheme';
import styledThemeDecorator from '../../../../StyledThemer/decorators/styledThemeDecorator';
import libraryThemeDefault from '../libraryTheme/libraryTheme';

const additionalScope = {
  React,
  ReactDOM,
  styled,
  ComponentStyledTheme,
  styledThemeDecorator,
};

const getReactRootHtml = (reactRoot) =>
  reactRoot &&
  reactRoot.childNodes &&
  reactRoot.childNodes.length &&
  reactRoot.childNodes[0].outerHTML ||
  '';

class ComponentStyler extends Component {
  static propTypes = {
    UIComponent: PropTypes.any.isRequired,
    componentName: PropTypes.string.isRequired,
    scope: PropTypes.object.isRequired,
  };

  constructor(...args) {
    super(...args);

    const { componentName } = this.props;

    const lineFormat = (code) => {
      const lines = code.split('\n');

      const firstLineSpace = lines
        .find((line) => /([^\s])/.test(line))
        .match(/^\s*/);

      return lines
        .map((line) => line.replace(new RegExp(`^${firstLineSpace}`), ''))
        .join('\n');
    };

    this.state = {
      generatedHtml: '',
      codeError: false,
      libraryTheme: libraryThemeDefault,
      code: lineFormat(`
        class RootComponent extends React.Component {
          render() {
            const Styled${componentName} = styledThemeDecorator(${componentName});

            return (
              <ComponentStyledTheme componentStyledThemes={libraryTheme}>
                <Styled${componentName}/>
              </ComponentStyledTheme>
            )
          }
        }
      `),
    };
  }

  componentDidMount() {
    this._executeCode();
  }

  componentDidUpdate(_, { code: prevCode, libraryTheme: preLibraryTheme }) {
    const { code, libraryTheme } = this.state;
    if (!(code !== prevCode || JSON.stringify(libraryTheme) !== JSON.stringify(preLibraryTheme))) { return; }
    this._executeCode();
  }

  @autobind
  _executeCode() {
    const { mount: mountNode } = this.refs;
    const { scope } = this.props;
    const { libraryTheme } = this.state;

    try {
      eval(this._compileCode()).apply( // eslint-disable-line no-eval
        null,
        Object
          .values(scope)
          .concat(Object.values(additionalScope))
          .concat([libraryTheme])
          .concat([mountNode])
      );
      this.setState({ codeError: null, generatedHtml: getReactRootHtml(mountNode) });
    } catch (err) {
      this.setState({ codeError: err.toString() });
    }
  }

  @autobind
  _compileCode() {
    const { scope } = this.props;
    const { code } = this.state;
    const newScope = Object
      .keys(scope)
      .concat(Object.keys(additionalScope))
      .concat(['libraryTheme']);
    return transform(`
      ((${newScope.join(',')}, mountNode) => {
        ${code}
        ReactDOM.render(<div><RootComponent/></div>, mountNode);
      });
    `, { presets: ['es2015', 'react', 'stage-1'], parserOpts: { allowImportExportEverywhere: true } }).code;
  }

  // unstable_handleError() { // eslint-disable-line camelcase
  //   this.setState({ loadError: true });
  // }

  render() {
    const { componentName } = this.props;
    const { codeError, code, generatedHtml, libraryTheme } = this.state;

    const componentCssStyles = typeof libraryTheme[componentName] === 'object' ?
      libraryTheme[componentName].default :
      libraryTheme[componentName];

    return (
      <div className={styles['single-post']}>
        <h3 className={styles['post-title']}>{componentName}</h3>
        <div>
          <div><div ref="mount" className="previewArea" /></div>
          {
            codeError &&
              <div>
                <div className={styles.error}>
                  CODE ERROR error:
                </div>
                <div>{codeError}</div>
              </div>
          }
        </div>
        <div className={styles['custom-section']}>
          <div className={styles['full-width']}>
            <h4>Code</h4>
            <div>
              <CodeMirror
                value={code}
                onChange={(edittedCode) => this.setState({ code: edittedCode })}
                options={{ mode: 'jsx', lineNumbers: true, theme: 'monokai' }}
              />
            </div>
          </div>
        </div>
        <div className={styles['custom-section']}>
          <div className={styles['full-width']}>
            <h4>{componentName} Theme CSS</h4>
            <div>

              <CodeMirror
                value={componentCssStyles}
                onChange={(edittedStyles) =>
                  this.setState({ libraryTheme: { ...libraryTheme, [componentName]: { default: edittedStyles } } })
                }
                options={{ mode: 'css', lineNumbers: true, theme: 'monokai' }}
              />
            </div>
          </div>
        </div>
        <div className={styles['custom-section']}>
          <div className={styles['full-width']}>
            <h4>Generated Html (Read Only)</h4>
            <div>
              <CodeMirror
                value={htmlBeautifier(generatedHtml)}
                options={{ mode: 'htmlmixed', lineNumbers: true, theme: 'monokai', readOnly: true }}
              />
            </div>
          </div>
        </div>
        <hr className={styles.divider} />
      </div>
    );
  }
}

export default ComponentStyler;
