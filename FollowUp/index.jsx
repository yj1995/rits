import React, { Component } from 'react';
import styles from './styles';
import axios from 'axios';
import { apiUrl } from '../../config';
import schema from './schema';
import FollowUpList from './FollowUpList/index';

// Material components
import {
  Grid,
  Button,
  IconButton,
  CircularProgress,
  TextField,
  Typography,
  Textarea
} from '@material-ui/core';

import validate from 'validate.js';
import _ from 'underscore';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

// Material helpers
import { withStyles } from '@material-ui/core';
class FollowUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {
        comment: '',
        followupDate: '',
        followUpTime: ''
      },
      touched: {
        comment: false,
        followupDate: false,
        followUpTime: false
      },
      errors: {
        comment: null,
        followupDate: null,
        followUpTime: null
      },
      isValid: false,
      isPhone: '',
      isFollowUpList: ''
    };
  }
  save() {
    let { comment, followupDate, followUpTime } = this.state.values;
    let { history } = this.props;

    let date = followupDate + ' ' + followUpTime;
    let followTime = new Date(date);

    let leadId = localStorage.getItem('followLeadId')
      ? localStorage.getItem('followLeadId')
      : '';
    let userData = localStorage.getItem('userData');
    let userId = userData ? JSON.parse(userData).id : '';
    let data = { comment, followTime, leadId, userId };

    console.log(data, 'add follow up data');
    axios.post(`${apiUrl}api/followup/add`, data).then(res => {
      if (res.data.status === 1) {
        window.alert('Followup added successfully');
        if (this.state.isPhone) {
          history.push('/follow-up-list');
        } else {
          this.setState({ isFollowUpList: true });
        }
      }
    });
  }

  validateForm = _.debounce(() => {
    const { values } = this.state;

    const newState = { ...this.state };
    const errors = validate(values, schema);
    newState.errors = errors || {};
    newState.isValid = errors ? false : true;

    this.setState(newState);
  }, 300);

  handleFieldChange = (field, value) => {
    const newState = { ...this.state };

    newState.submitError = null;
    newState.touched[field] = true;
    newState.values[field] = value;

    this.setState(newState, this.validateForm);
  };

  componentWillMount() {
    this.setState({ isPhone: detectmob() });
    console.log(this.state.isPhone);
    function detectmob() {
      if (
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  renderFollowUp(classes, present = !this.state.isPhone) {
    console.log(this.state.isPhone, 'present');
    const { values, isValid, touched, errors } = this.state;
    const showCommentError = touched.comment && errors.comment;
    const showfollowupDateError = touched.followupDate && errors.followupDate;
    const showfollowUpTimeError = touched.followUpTime && errors.followUpTime;
    if (present) {
      document.querySelector('.header').innerText = 'Add Follow Up';
    }
    return (
      <React.Fragment>
        <Grid
          className={classes.content}
          item
          lg={7}
          style={{ height: window.innerHeight - 55 - 63 }}
          xs={12}
        >
          <div
            className={classes.content}
            style={{
              height: present
                ? window.innerHeight
                : window.innerHeight - 55 - 63
            }}
          >
            <form
              className={classes.form}
              style={{
                padding: present ? 10 : null,
                width: present ? 500 : null,
                marginTop: present ? 60 : null,
                marginBottom: present ? 60 : null
              }}
            >
              <div className={classes.fields}>
                <TextField
                  className={classes.textField}
                  label="COMMENTS"
                  multiline
                  name="Requirement"
                  onChange={event =>
                    this.handleFieldChange('comment', event.target.value)
                  }
                  rows={6}
                  rowsMax={8}
                  type="text"
                  value={values.comment}
                  variant="outlined"
                />
                {showCommentError && (
                  <Typography
                    className={classes.fieldError}
                    variant="body2"
                  >
                    {errors.comment[0]}
                  </Typography>
                )}
              </div>
              <div className={classes.fields}>
                <TextField
                  className={classes.textField}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    inputProps: {
                      min:
                        new Date().getFullYear() +
                        '-0' +
                        (new Date().getMonth() + 1) +
                        '-' +
                        new Date().getDate()
                    }
                  }}
                  label="FOLLOW UP DATE"
                  name="followUpDate"
                  onChange={event =>
                    this.handleFieldChange('followupDate', event.target.value)
                  }
                  type="date"
                  value={values.followupDate}
                  variant="outlined"
                />
                {showfollowupDateError && (
                  <Typography
                    className={classes.fieldError}
                    variant="body2"
                  >
                    {errors.followupDate[0]}
                  </Typography>
                )}
              </div>
              <div className={classes.fields}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  className={classes.textField}
                  label="FOLLOW UP TIME"
                  name="followUpTime"
                  onChange={event =>
                    this.handleFieldChange('followUpTime', event.target.value)
                  }
                  type="time"
                  value={values.followUpTime ? values.followUpTime : '00:00'}
                  variant="outlined"
                />
                {showfollowUpTimeError && (
                  <Typography
                    className={classes.fieldError}
                    variant="body2"
                  >
                    {errors.followUpTime[0]}
                  </Typography>
                )}
              </div>
            </form>
          </div>
        </Grid>
        <Button
          className={classes.saveButton}
          disabled={!isValid}
          onClick={() => this.save()}
          style={{
            width: present ? 500 : null,
            right: present ? 0 : null,
            left: present ? 'unset' : null,
            backgroundColor: !isValid ? '#DFE3E8' : '#0767DB'
          }}
        >
          SAVE
        </Button>
      </React.Fragment>
    );
  }
  render() {
    const { classes } = this.props;
    const { isPhone, isFollowUpList } = this.state;
    console.log('isPhone', isPhone);
    return !isFollowUpList ? (
      isPhone ? (
        <DashboardLayout title="Add Follow Up">
          {this.renderFollowUp(classes)}
        </DashboardLayout>
      ) : (
        this.renderFollowUp(classes)
      )
    ) : (
      <FollowUpList />
    );
  }
}
export default withStyles(styles)(FollowUp);
