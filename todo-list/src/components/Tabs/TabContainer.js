import React from 'react';
import Typography from '@material-ui/core/Typography';

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: '24px 0' }}>
      {children}
    </Typography>
  );
}

export default TabContainer;