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
}

import ComponentStyledTheme from '../../../../StyledThemer/components/ComponentStyledTheme/ComponentStyledTheme';
import styledThemeDecorator from '../../../../StyledThemer/decorators/styledThemeDecorator';


const additionalScope = { React, ReactDOM, Component, styled, ComponentStyledTheme, styledThemeDecorator };

const ComponentError = ({ componentName }) => (
  <div className={styles['single-post']}>
    <h3 className={styles['post-title']}>{componentName}</h3>
    <div>We have found a problem with {componentName}</div>
  </div>
);

ComponentError.propTypes = {
  componentName: PropTypes.string,
};

const Nullcomponent = ({ componentName }) => (
  <div className={styles['single-post']}>
    <h3 className={styles['post-title']}>{componentName}</h3>
    <div>{componentName} is not a component</div>
  </div>
);

Nullcomponent.propTypes = {
  componentName: PropTypes.string,
};

const getReactRootHtml = (reactRoot) =>
  reactRoot &&
  reactRoot.childNodes &&
  reactRoot.childNodes.length &&
  reactRoot.childNodes[0].childNodes &&
  reactRoot.childNodes[0].childNodes[0] &&
  reactRoot.childNodes[0].childNodes[0].outerHTML ||
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
      code: lineFormat(`
        class ComponentExample extends React.Component {
          render() {

            const styledTheme = {
              ${componentName}: 'color: green;'
            };

            const Styled${componentName} = styledThemeDecorator(${componentName});

            return (
              <ComponentStyledTheme componentStyledThemes={styledTheme}>
                <Styled${componentName}/>
              </ComponentStyledTheme>
            )
          }
        }

        ReactDOM.render(<ComponentExample/>, mountNode);
      `),
    };
  }

  componentDidMount() {
    this._executeCode();
  }

  componentDidUpdate(_, { code: prevCode }) {
    const { code } = this.state;
    if (code !== prevCode) { this._executeCode(); }
  }

  @autobind
  _executeCode() {
    const { mount: mountNode } = this.refs;
    const { scope } = this.props;

    try {
      eval(this._compileCode()).apply(null, Object.values(scope).concat(Object.values(additionalScope)).concat([mountNode])); // eslint-disable-line no-eval, max-len
      this.setState({ codeError: null, generatedHtml: getReactRootHtml(mountNode) });
    } catch (err) {
      this.setState({ codeError: err.toString() });
    }
  }

  @autobind
  _compileCode() {
    const { scope } = this.props;
    const { code } = this.state;
    const newScope = Object.keys(scope).concat(Object.keys(additionalScope));
    return transform(`
      ((${newScope.join(',')}, mountNode) => {
        ${code}
      });
    `, { presets: ['es2015', 'react', 'stage-1'], parserOpts: { allowImportExportEverywhere: true } }).code;
  }

  // unstable_handleError() { // eslint-disable-line camelcase
  //   this.setState({ loadError: true });
  // }

  render() {
    const { componentName } = this.props;
    const { codeError, code, generatedHtml } = this.state;

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
            <h4>Generated Html</h4>
            <div>
              <CodeMirror
                value={htmlBeautifier(generatedHtml)}
                options={{ mode: 'htmlmixed', theme: 'monokai' }}
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
