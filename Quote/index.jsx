import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { Dashboard as DashboardLayout } from 'layouts';
import queryString from 'query-string'

import axios from 'axios';
import { apiUrl } from "../../config";

// Component styles
const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 4
  }
});

class Quote extends Component {
  state = {
    tabIndex: 0,
    functions: [],
    packages: [],
    filteredPackage: [],
    selectedFn: '',
    selectedPkg: '',
    isPhone: ''
  };

  componentDidMount() {
    this.setState({ isPhone: detectmob() })
    function detectmob() {
      if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
      ) {
        return true;
      } else {
        return false;
      }
    }
    var userId = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).id : ''
    axios.post(`${apiUrl}api/getPackages`, { userId: userId }).then(res => {
      console.log(res.data);
      if (res.data.status === 1) {
        this.setState({ packages: res.data.data.packages })
        this.setState({ functions: res.data.data.functions })
      } else {
        // show err message
      }
    })
  }

  selectFunction(e) {
    console.log(e.target.value, 'e changeFunction')
    console.log(this.state.packages, 'e changeFunction')
    let a = []
    if (this.state.packages.length) {
      a = this.state.packages.map((x, i) => {
        if (x.functionId == e.target.value) {
          return x
        }
      }).filter(x => x)
      console.log(a, 'a')
      this.setState({ filteredPackage: a })
    }
  }

  selectPackage(e) {
    console.log(e.target.value, 'pkg')
    if (e.target.value != 0) {
      let selectedPkg = (this.state.packages.map((x, i) => {
        if (x._id == e.target.value) {
          return x
        }
      }).filter(x => x))[0]
      this.setState({ selectedPkg: selectedPkg })
    }
  }

  sendQuote() {
    let e = document.getElementById('packageSelect')
    var strUser = e.options[e.selectedIndex].value;
    console.log(strUser, 'strUser')
    let selectedPkg
    if (strUser != 0) {
      selectedPkg = (this.state.packages.map((x, i) => {
        if (x._id == strUser) {
          return x
        }
      }).filter(x => x))[0]

      var queryParams = this.state.isPhone ? queryString.parse(this.props.location.search) : localStorage.getItem('followLeadId');
      var userId = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).id : '';
      let data = {
        userId: userId,
        leadId: this.state.isPhone ? queryParams.leadId : queryParams,
        packageId: selectedPkg._id,
        functionId: selectedPkg.functionId
      }
      console.log(data, 'data')
      axios.post(`${apiUrl}api/sendQuotePackage`, data).then(res => {
        console.log(res.data, 'api/sendQuotePackage');
        if (res.data.status === 1) {
          window.alert('Quote Sent Successfully')
        } else {
          // show err message
        }
      })
    } else {
      window.alert('Please select Function and Package')
    }
    // console.log(this.state.selectedPkg,'this.state.selectPackage')
    // if(this.state.selectedPkg){
    //   var queryParams = queryString.parse(this.props.location.search)

    //   var userId = localStorage.getItem('userData')?JSON.parse(localStorage.getItem('userData')).id:''
    //   let data = {
    //     userId : userId,
    //     leadId : queryParams.leadId,
    //     packageId : this.state.selectedPkg._id,
    //     functionId : this.state.selectedPkg.functionId
    //   }
    //   axios.post(`${apiUrl}api/sendQuotePackage`, data).then(res => {
    //        console.log(res.data, 'api/sendQuotePackage');
    //       if (res.data.status === 1) {
    //           window.alert('Quote Sent Successfully')
    //       } else {
    //          // show err message
    //       }
    //   })
    // }else{
    //   window.alert('Please select Function and Package')
    // }
  }

  renderQuote(present = this.state.isPhone) {
    const { classes } = this.props;

    let functions = []
    if (this.state.functions) {
      functions = this.state.functions.map((x, i) => {
        return <option value={x._id}>{x.functionName}</option>
      })
    }

    let packages = []
    if (this.state.filteredPackage) {
      packages = this.state.filteredPackage.map((x, i) => {
        return <option value={x._id}>{x.packageName}</option>
      })
    }
    return (
      <div className={classes.root} style={{ width: present ? null : 500, marginTop: present ? null : 50 }}>
        <div class="form-group">
          <select class="form-control" id="sel1" onChange={(e) => this.selectFunction(e)} placeholder="Select Function" style={{ height: 56 }}>
            <option value="0" disabled selected hidden >Select Function</option>
            {functions}
          </select>
        </div>
        {this.state.filteredPackage.length ?
          <div class="form-group">
            <select class="form-control" id="packageSelect" onChange={(e) => this.selectPackage(e)} placeholder="Select Package" style={{ height: 56 }}>
              <option value="0" disabled selected hidden >Select Package</option>
              {packages}
            </select>
          </div> : ''
        }

        <div align='center'>
          <button type="button" class="btn btn-success" onClick={this.sendQuote.bind(this)} style={{ position: 'fixed', bottom: 0, right: 0, width: present ? '100%' : 500, height: 63, textAlign: 'center', backgroundColor: '#0767DB', color: 'white', border: '1px solid #DFE3E8', zIndex: 2, fontSize: 18 }}>Send Now</button>
        </div>

      </div>
    )
  }

  render() {
    return (
      this.state.isPhone ?
        <DashboardLayout title="Send Quote">
          {this.renderQuote()}
        </DashboardLayout> : this.renderQuote()
    );
  }
}

Quote.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Quote);
