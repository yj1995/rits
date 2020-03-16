import React, { Component } from 'react';
import axios from 'axios';
import { apiUrl } from "../../config";

// Externals
import PropTypes from 'prop-types';

// Material helpers
import { withStyles, Icon } from '@material-ui/core';
import TuneIcon from '@material-ui/icons/Tune';
import SearchBar from 'material-ui-search-bar';
// Material components
import { CircularProgress, Typography, SwipeableDrawer } from '@material-ui/core';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

// Shared services
import { getUsers } from 'services/user';

// Custom components
import { UsersToolbar, UsersTable } from './components';
import AddLead from './../AddLead/index';
// Component styles
import styles from './style';



class UserList extends Component {
  signal = true;

  state = {
    isLoading: true,
    limit: 20,
    page: 0,
    users: [],
    selectedUsers: [],
    error: null,
    right: false,
  };
  toggleDrawer = (side, open) => {
    console.log("herre")
    // if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    //   return;
    // }

    this.setState({ [side]: open });
  };
  async getUsers() {
    try {
      this.setState({ isLoading: true });

      const { limit } = this.state;

      const { users } = await getUsers(limit);

      if (this.signal) {
        this.setState({
          // isLoading: false,
          users
        });
      }
    } catch (error) {
      if (this.signal) {
        this.setState({
          // isLoading: false,
          error
        });
      }
    }
  }

  sideList = side => {
    return (
      <React.Fragment>
        <div style={{ position: 'fixed', width: 500, height: 60, color: 'white', textAlign: 'center', backgroundColor: '#0767DB', zIndex: 2 }}>
          <span style={{ fontSize: 18, top: '50%', position: 'absolute', left: '50%', transform: 'translate(-50%,-50%)' }}>ADD LEAD DETAILS</span>
          <Icon onClick={() => this.toggleDrawer(side, false)} style={{ position: 'absolute', right: 10, left: 'unset', float: 'right', color: 'white', top: '50%', transform: 'translateY(-50%)' }}>close</Icon>
        </div>
        <AddLead history={this.props.history} />
      </React.Fragment>

      // <div
      //   className={this.props.classes.list}
      //   role="presentation"
      //   onClick={()=>this.toggleDrawer(side, false)}
      //   onKeyDown={()=>this.toggleDrawer(side, false)}
      // >

      ///* </div> 
    )
  };

  refresh() {
    this.setState({ users: [], isLoading: true });
    this.getLeadData(0, JSON.parse(localStorage.getItem('userData')));
  }

  addLead() {

    // const { history } = this.props;
    // history.push('/add-Lead');
  }

  getLeads(mobileno) {
    this.setState({ isLoading: true })
    axios.post(`${apiUrl}api/authorize`, { mobileno: mobileno }).then(res => {
      console.log(res.data);
      if (res.data.status == 1) {
        this.getLeadData(0, JSON.parse(localStorage.getItem('userData')))
      } else {

      }
    })
  }

  loadNext() {
    this.setState({ page: this.state.page + 1 })
    let userData = localStorage.getItem('userData')
    let userId = userData ? JSON.parse(userData).id : ''
    this.getLeadData(this.state.page + 1, JSON.parse(userData))
  }

  getLeadData(page, userData) {
    let params = userData.typeofUser ? 'assignedUser' : 'userId';
    axios.post(`${apiUrl}api/getMails`, { [params]: userData._id, page: page }).then(res => {
      this.setState({ isLoading: false })
      console.log(res.data.status);
      if (res.data.status == 1) {
        // this.setState({users : res.data.data})
        this.setState({ users: this.state.users.concat(res.data.data), limit: res.data.data.length })
      } else {

      }
    })
  }


  componentDidMount() {
    this.signal = true;
    const { history } = this.props;

    // this.getUsers();
    let userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : {}

    if (userData.gtoken) {
      this.getLeads(userData.mobileno)
    } else if (userData.mobileno) {
      this.getLeadData(0, userData)
      // history.push('/sign-up');
    } else {
      history.push('/sign-in');
    }
  }

  componentWillUnmount() {
    this.signal = false;
  }

  handleSelect = selectedUsers => {
    this.setState({ selectedUsers });
  };

  renderUsers() {
    const { classes } = this.props;
    const { isLoading, users, error } = this.state;
    let sort = [];
    let uniqueData = [];
    if (isLoading) {
      return (
        <div className={classes.progressWrapper}>
          <CircularProgress />
        </div>
      );
    }

    if (error) {
      return <Typography variant="h6">{error}</Typography>;
    }

    if (users.length === 0) {
      return <Typography variant="h6"></Typography>;
    } else {
      sort = users.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.requiredDate) - new Date(a.requiredDate);
      });
      // filter to remove duplicate entry.
      uniqueData = sort.reduce((acc, current) => {
        const x = acc.find(item => (item.mobileno === current.mobileno || item.name === current.name));
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
    }

    return (
      <UsersTable
        //
        props={this.props}
        onSelect={this.handleSelect}
        users={uniqueData}
      />
    );
  }

  search(e) {
    console.log(e);
    this.setState({ isLoading: true });
    axios.post(`${apiUrl}api/searchLeads`, { userId: JSON.parse(localStorage.getItem('userData'))._id, searchkey: e }).then(res => {
      console.log(res.data.data);
      this.setState({ users: res.data.data, isLoading: false });
    })
  }

  render() {
    const { classes } = this.props;
    const { selectedUsers } = this.state;
    console.log(this.state.isLoading);
    return (
      <DashboardLayout title="Leads">
        <div className={classes.root}>
          {/*<UsersToolbar selectedUsers={selectedUsers} />*/}
          <div className={classes.backColor} />
          <div className={classes.bottomButtonHolder}>
            <SearchBar
              // onChange={(e) => this.search(e)}
              className='searchBar'
              onRequestSearch={(e) => this.search(e)}
              key='search'
              style={{
                width: '56.5%',
                boxShadow: '0 0 0 0 white',
                border: '1px solid #DFE3E8',
                position: 'fixed',
                zIndex: 1,
                marginLeft: 10,
                height: 40,
                opacity: this.state.isLoading ? 0 : 1,
                borderRadius: 0
              }}
              spellCheck={true}
              placeholder="Search by name, mobile, email ...."
              inputProps={{ 'aria-label': 'Search by name, mobile, email ....', style: { color: 'black', fontSize: 18 } }}
            ><input></input></SearchBar>
            <button className={classes.filterButton} style={{ opacity: this.state.isLoading ? 0 : 1 }}><TuneIcon color="primary" fontSize="large" style={{ width: '70%', height: '70%' }} /></button>
            <button className={classes.buttonLocation} style={{ borderRight: '1px solid #DFE3E8', zIndex: 2, right: 124 }} onClick={() => this.toggleDrawer('right', true)}>+ ADD LEAD</button>
            <button style={{ zIndex: 2, right: 10 }} className={classes.buttonLocation} onClick={() => this.refresh()}>REFRESH</button>
          </div>
          <div className={classes.content}>{this.renderUsers()}</div>
          {this.state.limit == 20 ?
            <button className={classes.showMore} onClick={this.loadNext.bind(this)} style={{ opacity: this.state.isLoading ? 0 : 1 }} >Show More</button> :
            <button disabled className={classes.showMore} style={{ opacity: this.state.isLoading ? 0 : 1 }} >No More Lead</button>
          }
        </div>
        <SwipeableDrawer
          anchor="right"
          open={this.state.right}
          onClose={() => this.toggleDrawer('right', false)}
          onOpen={() => this.toggleDrawer('right', true)}
        >
          {this.sideList('right')}
        </SwipeableDrawer>
      </DashboardLayout>
    );
  }
}

UserList.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UserList);
