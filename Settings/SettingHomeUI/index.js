import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import { Icon, Grid, Box } from '@material-ui/core';
import { Dashboard as DashboardLayout } from 'layouts';

const useStyles = makeStyles(theme => ({
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  form: {
    paddingLeft: '100px',
    paddingRight: '100px',
    paddingBottom: '125px',
    flexBasis: '700px',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2
    }
  },
  fields: {
    marginTop: theme.spacing.unit * 2
  },
  button: {
    margin: theme.spacing(3)
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  icon: {
    alignSelf: 'center'
  }
}));
export const BoxC = props => {
  const classes = useStyles();
  return (
    <Box display="flex" p={1} className={classes.button} border={1}>
      <Box p={1} className={classes.title}>
        {props.title}
      </Box>
      <Box className={classes.icon}>
        <Icon>{props.icon}</Icon>
      </Box>
    </Box>
  );
};
export default function SettingsHomeUI() {
  const classes = useStyles();
  const style = {
    color: '#0060B6',
    textDecoration: 'none'
  };
  return (
    <DashboardLayout title="SETTINGS">
      <Grid className={classes.content} item lg={7} xs={12} style={{ height: window.innerHeight - 55 }}>
        <div className={classes.content}>
          <form className={classes.form}>
            <div className={classes.fields}>
              <Link to="./Profile" style={style}>
                <BoxC title="PROFILE" icon="keyboard_arrow_right" />
              </Link>
              {/* <Link style={style}>
                <BoxC title="COMPANY PROFILE" icon="keyboard_arrow_right" />
              </Link> */}
              <Link to="./functions" style={style}>
                <BoxC title="PACKAGES" icon="keyboard_arrow_right" />
              </Link>
              {/* <Link style={style}>
                <BoxC title="INTEGRATION" icon="keyboard_arrow_right" />
              </Link> */}
              {/* <Link style={style}>
                <BoxC title="PREFERANCES" icon="keyboard_arrow_right" />
              </Link> */}
              {/* <Link style={style}>
                <BoxC title="LEGAL" icon="keyboard_arrow_right" />
              </Link> */}
            </div>
          </form>
        </div>
      </Grid>
    </DashboardLayout>
  );
}
