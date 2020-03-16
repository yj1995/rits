import React from 'react';
import { TextField } from '@material-ui/core';

import { withStyles } from '@material-ui/core';
import styles from './styles';

const TextfieldC = props => {
  const { classes } = props;
  return (
    <TextField
      type={props.type}
      label={props.label}
      disabled={props.edit}
      className={classes.textField}
      value={props.defaultValue}
      margin="normal"
      variant="outlined"
      onChange={props.onChange}
    />
  );
};

export default withStyles(styles)(TextfieldC);
