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

    this.state = {
      style: '',
      propsString: '{}',
      loadError: false,
      propsError: false,
    };
  }

  @autobind
  handleStyleEdit({ target: { value: style } }) {
    this.setState({ style });
  }

  @autobind
  handlePropsEdit({ target: { value: propsString } }) {
    try {
      JSON.parse(propsString);
      this.setState({ propsError: false, propsString });
    } catch (e) {
      this.setState({ propsError: true, propsString });
    }
  }

  unstable_handleError() { // eslint-disable-line camelcase
    this.setState({ loadError: true });
  }

  render() {
    const { UIComponent, componentName } = this.props;
    const { style, propsString, loadError, propsError } = this.state;

    if (loadError) { return <ComponentError componentName={componentName} />; }
    if (!UIComponent || typeof UIComponent !== 'function') { return <Nullcomponent componentName={componentName} />; }

    const extraProps = !propsError ? JSON.parse(propsString) : {};
    const StyledComponent = styled(UIComponent)`${style}`;

    return (
      <div className={styles['single-post']}>
        <h3 className={styles['post-title']}>{componentName}</h3>
        <div>
          <div><StyledComponent {...extraProps} /></div>
          {propsError && <div>PROPS ERROR</div>}
        </div>
        <div className={styles['custom-section']}>
          <div>
            <h4>Styles</h4>
            <div><textarea value={style} onChange={this.handleStyleEdit} /></div>
          </div>
          <div>
            <h4>Props</h4>
            <div><textarea value={propsString} onChange={this.handlePropsEdit} /></div>
          </div>
        </div>
        <hr className={styles.divider} />
      </div>
    );
  }
}

export default ComponentStyler;
