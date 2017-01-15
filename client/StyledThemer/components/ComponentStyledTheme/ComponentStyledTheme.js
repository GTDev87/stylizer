import React, { PropTypes } from 'react';

import { ThemeProvider } from 'styled-components';

const ComponentStyledTheme = ({ children, componentStyledThemes, defaultName = 'default' }) =>
  <ThemeProvider theme={{ component: componentStyledThemes, defaultName }}>
    {children}
  </ThemeProvider>;

ComponentStyledTheme.propTypes = {
  children: PropTypes.node,
  componentStyledThemes: PropTypes.object,
  defaultName: PropTypes.string,
};

export default ComponentStyledTheme;
