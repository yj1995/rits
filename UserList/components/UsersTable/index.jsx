import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from 'reactstrap';

// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import PerfectScrollbar from 'react-perfect-scrollbar';
import FollowUpList from '../../../FollowUp/FollowUpList/index';
import LeadDetail from '../../../AddLead/LeadDetail/index';
import Quote from '../../../Quote/index';

// Material helpers
import { withStyles, Icon } from '@material-ui/core';

// Material components
import {
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  Button,
  SwipeableDrawer
} from '@material-ui/core';

// Shared helpers
import { getInitials } from 'helpers';

// Shared components
import { Portlet, PortletContent } from 'components';

// Component styles
import styles from './styles';


class UsersTable extends Component {
  state = {
    selectedUsers: [],
    rowsPerPage: 10,
    page: 0,
    right: false,
    select: ''
  };

  sideList = side => {
    if (this.state.select === 'followUp') {
      return (
        <React.Fragment>
          <div style={{ position: 'fixed', width: 500, height: 60, color: 'white', textAlign: 'center', backgroundColor: '#0767DB', zIndex: 2 }}>
            <span className='header' style={{ top: '50%', position: 'absolute', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 18 }}>Follow Up</span>
            <Icon onClick={() => this.closeDrawer(side, false)} style={{ position: 'absolute', right: 10, left: 'unset', float: 'right', color: 'white', top: '50%', transform: 'translateY(-50%)' }}>close</Icon>
          </div>
          <FollowUpList />
        </React.Fragment>
      )
    } else if (this.state.select === 'sendQuote') {
      return (
        <React.Fragment>
          <div style={{ position: 'fixed', width: 500, height: 60, color: 'white', textAlign: 'center', backgroundColor: '#0767DB', zIndex: 2 }}>
            <span className='header' style={{ top: '50%', position: 'absolute', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 18 }}>Send Quote</span>
            <Icon onClick={() => this.closeDrawer(side, false)} style={{ position: 'absolute', right: 10, left: 'unset', float: 'right', color: 'white', top: '50%', transform: 'translateY(-50%)' }}>close</Icon>
          </div>
          <Quote />
        </React.Fragment>
      )
    } else if (this.state.select === 'viewDetails') {
      return (
        <React.Fragment>
          <div style={{ position: 'fixed', width: 500, height: 60, color: 'white', textAlign: 'center', backgroundColor: '#0767DB', zIndex: 2 }}>
            <span className='header' style={{ top: '50%', position: 'absolute', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 18 }}>Lead Details</span>
            <Icon onClick={() => this.closeDrawer(side, false)} style={{ position: 'absolute', right: 10, left: 'unset', float: 'right', color: 'white', top: '50%', transform: 'translateY(-50%)' }}>close</Icon>
          </div>
          <LeadDetail />
        </React.Fragment>
      )
    }
  }

  toggleDrawer = (e, side, open, user) => {
    // if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    //   return;
    // }
    if (open) {
      localStorage.setItem('productDetails', JSON.stringify(user));
      localStorage.setItem('followLeadId', user._id);
    }
    this.setState({ [side]: open, select: e.currentTarget.value });
  };

  closeDrawer = (side, open) => {
    console.log('close');
    // document.querySelector('.MuiDrawer-root').remove();
    this.setState({ [side]: open });
  }
  handleSelectAll = event => {
    const { users, onSelect } = this.props;

    let selectedUsers;

    if (event.target.checked) {
      selectedUsers = users.map(user => user.id);
    } else {
      selectedUsers = [];
    }

    this.setState({ selectedUsers });

    onSelect(selectedUsers);
  };

  handleSelectOne = (event, id) => {
    const { onSelect } = this.props;
    const { selectedUsers } = this.state;

    const selectedIndex = selectedUsers.indexOf(id);
    let newSelectedUsers = [];

    if (selectedIndex === -1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers, id);
    } else if (selectedIndex === 0) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(1));
    } else if (selectedIndex === selectedUsers.length - 1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedUsers = newSelectedUsers.concat(
        selectedUsers.slice(0, selectedIndex),
        selectedUsers.slice(selectedIndex + 1)
      );
    }

    this.setState({ selectedUsers: newSelectedUsers });

    onSelect(newSelectedUsers);
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const { classes, className, users } = this.props;
    const { activeTab, selectedUsers, rowsPerPage, page } = this.state;

    const rootClassName = classNames(classes.root, className);


    // name:String,
    // mobileno:String,
    // email:String,
    // requiredDate:String,
    // searchDate:String,
    // city:String,
    // state:String
    // source JD
    // requirement:String,

    return (
      <Portlet className={rootClassName}>
        <PortletContent noPadding>
          <PerfectScrollbar>
            <Table>
              <TableHead>
                <TableRow style={{ height: 46 }}>
                  {/*                  <TableCell align="left">
                    <Checkbox
                      checked={selectedUsers.length === users.length}
                      color="primary"
                      indeterminate={
                        selectedUsers.length > 0 &&
                        selectedUsers.length < users.length
                      }
                      onChange={this.handleSelectAll}
                    />
                    Name
                  </TableCell>*/}
                  <TableCell style={{ padding: 10, borderRight: '1px solid #DFE3E8', }} align="left">Name</TableCell>
                  <TableCell style={{ padding: 10, borderRight: '1px solid #DFE3E8', }} align="left">Mobile</TableCell>
                  <TableCell style={{ padding: 10, borderRight: '1px solid #DFE3E8', }} align="left">Email</TableCell>
                  <TableCell style={{ padding: 10, borderRight: '1px solid #DFE3E8', }} align="left">Source</TableCell>
                  <TableCell style={{ padding: 10, borderRight: '1px solid #DFE3E8', }} align="left">Date And Time</TableCell>
                  <TableCell style={{ padding: 10, borderRight: '1px solid #DFE3E8', }} align="left">Assigned To</TableCell>
                  <TableCell style={{ padding: 10, borderRight: '1px solid #DFE3E8', }} align="left">Requirement</TableCell>
                  <TableCell style={{ padding: 10, borderLeft: '1px solid #DFE3E8', }} align="left">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.filter(user => {
                  if (activeTab === 1) {
                    return !user.returning;
                  }

                  if (activeTab === 2) {
                    return user.returning;
                  }

                  return user;
                })
                  .map(user => (
                    <TableRow
                      className={classes.tableRow}
                      hover
                      key={user.id}
                      selected={selectedUsers.indexOf(user.id) !== -1}
                    >
                      <TableCell className={classes.tableCell}>
                        {user.name ? user.name : ""}
                        {/* <div className={classes.tableCellInner}> */}
                        {/* <Checkbox
                            checked={selectedUsers.indexOf(user.id) !== -1}
                            color="primary"
                            onChange={event =>
                              this.handleSelectOne(event, user.id)
                            }
                            value="true"
                          />
                          <Avatar
                            className={classes.avatar}
                            src={user.avatarUrl}
                          >
                            {getInitials(user.name)}
                          </Avatar>*/}
                        {/* <Link to="#">
                            <Typography
                              className={classes.nameText}
                              variant="body1"
                            >
                              {user.name + " "} */}
                        {/*{user.isEnquiry ? <Badge color="success">E</Badge> : <Badge color="info">S</Badge>}*/}

                        {/* </Typography>
                          </Link> */}
                        {/* </div> */}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {user.mobileno ? user.mobileno : ""}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {user.email ? user.email : ""}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {user.source ? user.source : "JustDail"}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {user.isAdded ?
                          user.requiredDate ?
                            moment(new Date(user.requiredDate)).format('DD/MM/YYYY hh:mm a') : ''
                          : user.requiredDate ?
                            moment(new Date(new Date(user.requiredDate).setHours(new Date(user.requiredDate).getHours())).setMinutes(new Date(user.requiredDate).getMinutes())).format('DD/MM/YYYY hh:mm a') : ''
                        }
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {user.assignedUserName ? user.assignedUserName : ""}
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        {user.requirement}
                      </TableCell>
                      <TableCell className={classes.tableCell} style={{ textAlign: 'center', padding: 5 }}>
                        <Button style={{ marginRight: 15 }} className={classes.actionButton} onClick={(e) => this.toggleDrawer(e, 'right', true, user)} value='followUp'>Follow Up</Button>
                        <Button style={{ marginRight: 15 }} className={classes.actionButton} onClick={(e) => this.toggleDrawer(e, 'right', true, user)} value='sendQuote'>Send Quote</Button>
                        <Button className={classes.actionButton} onClick={(e) => this.toggleDrawer(e, 'right', true, user)} value='viewDetails'>View Details</Button>
                      </TableCell>
                      {/*                      <TableCell className={classes.tableCell}>
                        {moment(user.createdAt).format('DD/MM/YYYY')}
                      </TableCell>*/}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </PerfectScrollbar>
          {/*<TablePagination
            backIconButtonProps={{
              'aria-label': 'Previous Page'
            }}
            component="div"
            count={users.length}
            nextIconButtonProps={{
              'aria-label': 'Next Page'
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />*/}
        </PortletContent>
        <SwipeableDrawer
          anchor="right"
          open={this.state.right}
          onClose={() => this.closeDrawer('right', false)}
          onOpen={(e) => this.toggleDrawer(e, 'right', true)}
        >
          {this.sideList('right')}
        </SwipeableDrawer>
      </Portlet>
    );
  }
}

UsersTable.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
  onShowDetails: PropTypes.func,
  users: PropTypes.array.isRequired
};

UsersTable.defaultProps = {
  users: [],
  onSelect: () => { },
  onShowDetails: () => { }
};

export default withStyles(styles)(UsersTable);
