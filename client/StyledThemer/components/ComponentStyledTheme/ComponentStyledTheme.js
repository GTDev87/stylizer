import React, { PropTypes } from 'react';

import { ThemeProvider } from 'styled-components';

const ComponentStyledTheme = ({ children, componentStyledThemes }) =>
  <ThemeProvider theme={{ component: componentStyledThemes }}>{children}</ThemeProvider>;

ComponentStyledTheme.propTypes = {
  children: PropTypes.node,
  componentStyledThemes: PropTypes.object,
};

export default ComponentStyledTheme;
