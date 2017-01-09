import React, { PropTypes } from 'react';

// Import Components
import ComponentStyler from './ComponentStyler/ComponentStyler';
import * as ant from 'antd';

const excludeList = ['Carousel', 'Tooltip']; // fuckers

function PostList() {
  return (
    <div className="listView">
      <ant.Button>ANT HELLO BUTTON</ant.Button>
      {
        process.env.CLIENT && Object.entries(ant)
          .filter(([componentName]) => !excludeList.includes(componentName))
          .map(([componentName, UIComponent]) =>
            <ComponentStyler
              key={componentName}
              componentName={componentName}
              UIComponent={UIComponent}
            />
        )
      }
    </div>
  );
}

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    cuid: PropTypes.string.isRequired,
  })).isRequired,
  handleDeletePost: PropTypes.func.isRequired,
};

export default PostList;
