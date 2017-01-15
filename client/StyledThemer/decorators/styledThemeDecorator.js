import styled from 'styled-components';

// maybe rename this
export default (WC) =>
  styled(WC)`
    ${({ theme: { component, defaultName } }) =>
      component &&
        (
          typeof component[WC.name] === 'object' ?
            (component[WC.name][defaultName]) :
            component[WC.name]
        ) || ''
    }
  `;
