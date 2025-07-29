import React from 'react';

const ScreenshotButton = ({ onClick }) => (
  <button onClick={onClick} style={{ position: 'absolute', top: 20, right: 20 }}>
    Take Screenshot
  </button>
);

export default ScreenshotButton;
