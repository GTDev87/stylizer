import React, { PropTypes, Component } from 'react';

import autobind from 'autobind-decorator';

// Import Style
import styles from './ComponentStyler.css';

import styled from 'styled-components';

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
  };

  constructor(...args) {
    super(...args);

    this.state = { style: '', error: false };
  }

  @autobind
  handleTextEdit({ target: { value: style } }) {
    this.setState({ style });
  }

  //
  unstable_handleError() { // eslint-disable-line camelcase
    this.setState({ error: true });
  }

  render() {
    const { UIComponent, componentName } = this.props;
    const { style, error } = this.state;

    if (error) { return <ComponentError componentName={componentName} />; }
    if (!UIComponent || typeof UIComponent !== 'function') { return <Nullcomponent componentName={componentName} />; }

    const StyledComponent = styled(UIComponent)`${style}`;

    return (
      <div className={styles['single-post']}>
        <h3 className={styles['post-title']}>{componentName}</h3>
        <div><StyledComponent /></div>
        <div><textarea value={style} onChange={this.handleTextEdit} /></div>
        <hr className={styles.divider} />
      </div>
    );
  }
}

export default ComponentStyler;
