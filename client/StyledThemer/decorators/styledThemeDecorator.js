import styled from 'styled-components';

// maybe rename this
export default (WC) =>
  styled(WC)`
    ${props => props.theme &&
                props.theme.component &&
                props.theme.component[WC.name] ||
                ''
    }
  `;
