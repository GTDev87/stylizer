import styled from 'styled-components';

// maybe rename this
export default (WrappedComponent) =>
  styled(WrappedComponent)`
    ${props => props.theme &&
                props.theme.component &&
                props.theme.component[WrappedComponent.name] ||
                ''
    }
  `;
