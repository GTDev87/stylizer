import * as ant from 'antd';

const excludeList = ['Carousel', 'Tooltip']; // fuckers (duplication from PostList)

const calculateDefaultTheme = (library) =>
  Object.entries(library)
    .filter(([componentName]) => !excludeList.includes(componentName))
    .reduce((agg, [componentName]) => ({ ...agg, [componentName]: { default: 'color: green;' } }));

export default process.env.CLIENT ?
  calculateDefaultTheme(ant)
  : {};
