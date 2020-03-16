import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import { Dashboard as DashboardLayout } from 'layouts';
import queryString from 'query-string'

import axios from 'axios';
import { apiUrl } from "../../../config";

import { Grid, CircularProgress, Button } from '@material-ui/core';

import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Modal, ModalHeader, ModalBody, ModalFooter, Toast, ToastBody, ToastHeader
} from 'reactstrap';

// Component styles
const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 4
  }
});

class Functions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      functions: [],
      packages: [],
      filteredPackage: [],
      selectedFn: '',
      selectedPkg: '',
      modal: false,
      noData: false
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.getFunctions()
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  addBank() {

    let form = document.getElementById('addFunction')
    if (form.checkValidity()) {
      this.setState({ isLoading: true })

      var userId = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).id : ''
      let data = {
        functionName: this.refs.functionName.value,
        userId: userId
      }
      console.log('data')
      axios.post(`${apiUrl}api/addFunction`, data).then(res => {
        console.log(res.data);
        if (res.data.status === 1) {
          // this.setState({functions : res.data.data})
          this.setState({ modal: !this.state.modal })
          this.getFunctions()
          window.alert('Function added')
        } else {
          // show err message
        }
      })
      // this.addBankApi(data, loginData)
      this.setState({ submitErr: false })
    } else {
      this.setState({ submitErr: true })
    }

  }

  getFunctions() {
    var userId = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).id : ''
    axios.post(`${apiUrl}api/getFunction`, { userId: userId }).then(res => {
      console.log(res.data);
      if (res.data.status === 1) {
        this.setState({ functions: res.data.data })
        if (res.data.data.length == 0) {
          this.setState({ noData: true })
        }
      } else {
        // show err message
      }
    })
  }

  render() {
    const { classes } = this.props;
    let functions = []
    if (this.state.functions) {
      functions = this.state.functions.map((x, i) => {
        return <Link to={"/packages?fId=" + x._id + "&fName=" + x.functionName}><div className="card" >
          <div className="card-body">
            <h6 className="card-subtitle mb-2 text-muted">{x.functionName}</h6>
          </div>
        </div></Link>
      })
    }

    return (
      <DashboardLayout title="Functions">
        <div className={classes.root}>

          {
            this.state.noData ? <div align="center">No functions added</div> :
              <span>
                {
                  functions.length == 0 ? <div align="center"><CircularProgress className={classes.progress} /></div> : ""
                }
              </span>

          }

          {functions}
          <br />
          <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} style={{ marginTop: 85 }}>
            <ModalHeader toggle={this.toggle}>Add New Function</ModalHeader>
            <ModalBody>
              <form name="addFunction" id="addFunction">
                <div class="form-group">
                  <input type="text" class="form-control" name="account_id" placeholder="Function Name"
                    required maxlength="32" ref="functionName" />
                </div>

                <p style={{ color: "red" }}>{this.state.submitErr ? "Please fill valid details" : ""}</p>

              </form>


            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={() => { this.addBank() }}>Submit</Button>{' '}
              <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
          </Modal>
        </div>
        <div align='center'>
          <button type="button" style={{ position: 'fixed', bottom: 0, right: 0, width: '100%', height: 63, textAlign: 'center', backgroundColor: '#0767DB', color: 'white', border: '1px solid #DFE3E8', zIndex: 2, fontSize: 18 }} class="btn btn-success" onClick={this.toggle} >Add New</button>
        </div>
      </DashboardLayout>
    );
  }
}

Functions.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Functions);
