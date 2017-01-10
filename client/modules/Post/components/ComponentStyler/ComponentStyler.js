import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

import autobind from 'autobind-decorator';
import { transform } from 'babel-standalone';

// Import Style
import styles from './ComponentStyler.css';

import styled from 'styled-components';

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

class ComponentStyler extends Component {
  static propTypes = {
    UIComponent: PropTypes.any.isRequired,
    componentName: PropTypes.string.isRequired,
    scope: PropTypes.object.isRequired,
  };

  constructor(...args) {
    super(...args);

    const { componentName } = this.props;

    this.state = {
      codeError: false,
      code: `
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
        };

        ReactDOM.render(<ComponentExample/>, mountNode);
      `,
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
      this.setState({ codeError: null });
    } catch (err) {
      this.setState({ codeError: err.toString() });
    }
  }


  @autobind
  handleCodeEdit({ target: { value: code } }) {
    try {
      this.setState({ code });
    } catch (e) {
      this.setState({ code });
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
    `, { presets: ['es2015', 'react', 'stage-1'] }).code;
  }

  // unstable_handleError() { // eslint-disable-line camelcase
  //   this.setState({ loadError: true });
  // }

  render() {
    const { componentName } = this.props;
    const { codeError, code } = this.state;

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
          <div>
            <h4>Code</h4>
            <div><textarea value={code} onChange={this.handleCodeEdit} /></div>
          </div>
        </div>
        <hr className={styles.divider} />
      </div>
    );
  }
}

export default ComponentStyler;
