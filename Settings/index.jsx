import React, { Component } from 'react';
import axios from 'axios';
import { apiUrl } from "../../config";

// Externals
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Grid } from '@material-ui/core';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

// Custom components
import { Notifications, Password, FileUpload } from './components';

import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
  PortletFooter
} from 'components';

// Component styles
const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 4
  }
});

class Settings extends Component {
  componentWillMount(){
      console.log('puneet')
  }
  render() {
    const { classes } = this.props;

    return (
      <DashboardLayout title="Settings">
        <div className={classes.root}>
          <Grid
            container
            spacing={4}
          >
            <Grid
              item
              md={7}
              xs={12}
            >
              <Notifications />
            </Grid>
            <Grid
              item
              md={5}
              xs={12}
            >
              <Password />
              <br />  
              <FileUpload />


            </Grid>
          </Grid>
        </div>
      </DashboardLayout>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Settings);
