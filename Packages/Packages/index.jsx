import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string'

import { withStyles } from '@material-ui/core';
import { Container, Row, Col } from 'reactstrap';
import { Grid, Button, CircularProgress } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

import { Dashboard as DashboardLayout } from 'layouts';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Modal, ModalHeader, ModalBody, ModalFooter, Toast, ToastBody, ToastHeader
} from 'reactstrap';

import axios from 'axios';
import { apiUrl } from "../../../config";

// Component styles
const styles = theme => ({
  fab: {
    margin: theme.spacing(1),
  },
  root: {
    padding: theme.spacing.unit * 4
  }
});

class Packages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      tabIndex: 0,
      packages: [],
      functionName: '',
      modal: false,
      selectedFile: null,
      noData: false,
      fileErr: false,
      uploading: false,
      exception: false
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.getPackages()
  }

  getPackages() {
    var userId = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).id : ''
    axios.post(`${apiUrl}api/getPackages`, { userId: userId }).then(res => {
      console.log(res.data);
      let a
      var queryParams = queryString.parse(this.props.location.search)
      if (res.data.status === 1) {
        a = res.data.data.packages.map((x, i) => {
          if (x.functionId == queryParams.fId) {
            return x
          }
        }).filter(x => x)
        console.log(a, 'a')
        if (a.length == 0) {
          this.setState({ noData: true })
        }
        this.setState({ packages: a })
      } else {
        // show err message
      }
    })
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
    this.setState({ exception: false })
    this.setState({ fileErr: false })
    this.setState({ submitErr: false })
  }

  addBank() {
    let form = document.getElementById('addFunction')
    if (form.checkValidity()) {
      this.setState({ uploading: true })

      var userId = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).id : ''
      var functionId = (queryString.parse(this.props.location.search)).fId
      var packageName = this.refs.functionName.value

      // userId, functionId, packageName, packageData, pdfUrl

      const data = new FormData()
      data.append('file', this.state.selectedFile)
      axios.post(`${apiUrl}api/uploadPdf`, data).then(res => { // then print response status
        console.log(res.data, 'res')
        this.setState({ uploading: false })
        this.setState({ exception: false })
        this.setState({ fileErr: false })

        if (res.data.status == 1) {
          let data = {
            userId: userId, functionId: functionId, packageName: packageName,
            pdfUrl: res.data.data[0], fileName: res.data.fileName[0].originalname
          }
          axios.post(`${apiUrl}api/addPackage`, data).then(res => {
            console.log(res.data);
            if (res.data.status === 1) {
              this.setState({ submitErr: false })
              this.getPackages()
              window.alert('Package added')
              this.setState({ modal: !this.state.modal })
            } else {
              // show err message
            }
          })
        } else {
          this.setState({ fileErr: true })
        }
      }).catch(err => {
        this.setState({ uploading: false })
        this.setState({ fileErr: false })
        this.setState({ exception: true })
      })
    } else {
      this.setState({ submitErr: true })
    }

  }

  onChangeHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    })
  }


  render() {
    const { classes } = this.props;

    let functionName = ''
    // console.log(, 'fname')

    let packages = []
    if (this.state.packages) {
      packages = this.state.packages.map((x, i) => {
        return <div className="card" >
          <div className="card-body">
            <h6 className="card-subtitle mb-2 text-muted" style={{ marginTop: 7 }}>{x.packageName}</h6>
            <h6 className="card-subtitle mb-2 text-muted">File Name : {x.fileName}</h6>
            {/*<a href="#" className="card-link">Edit</a>
            <a href="#" className="card-link">Delete</a>*/}
          </div>
        </div>
      })
    }

    return (
      <DashboardLayout title="Packages">
        <div className={classes.root}>
          <div className="row">
            <div className="col-12">
              <Row style={{ margin: 0 }}>
                <Col xs="5" style={{ paddingRight: 0, maxWidth: typeof window.orientation !== 'undefined' ? 134 : null, flex: typeof window.orientation !== 'undefined' ? "0 0 134px" : null }}><h6>Function Name:</h6> </Col>
                <Col xs="7" style={{ wordWrap: 'break-word', padding: 0 }}><h6>{(queryString.parse(this.props.location.search)).fName}</h6></Col>

              </Row>
            </div>
          </div>

          {/*          <Fab color="primary" aria-label="add" className={classes.fab}>
            <AddIcon onClick={this.toggle} />
          </Fab>*/}

          <br />
          {
            this.state.noData ? <div align="center">No packages added</div> :
              <span>
                {
                  packages.length == 0 ? <div align="center"><CircularProgress className={classes.progress} /></div> : ""
                }
              </span>

          }
          {packages}
          <br />
          <div align='center'>

          </div>


          <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} style={{ marginTop: 85 }}>
            <ModalHeader toggle={this.toggle}>Add New Package</ModalHeader>
            <ModalBody>
              <form name="addFunction" id="addFunction">
                <div class="form-group">
                  <input type="text" class="form-control" name="account_id" placeholder="Package Name"
                    required maxlength="32" ref="functionName" />
                </div>
                <input type="file" name="file" onChange={this.onChangeHandler} required />

                <p style={{ color: "red" }}>{this.state.submitErr ? "Please fill valid details" : ""}</p>
                <p style={{ color: "red" }}>{this.state.fileErr ? "File Size should be less than 2 MB and PDF only" : ""}</p>
                <p style={{ color: "red" }}>{this.state.exception ? "Something went wrong, try again" : ""}</p>

              </form>

              {this.state.uploading ?
                <div align="center"><CircularProgress className={classes.progress} /><p>Uploading file</p></div> : ""
              }


            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={() => { this.addBank() }}>Submit</Button>{' '}
              <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
          </Modal>


        </div>
        <button type="button" class="btn btn-success" onClick={this.toggle} style={{ position: 'fixed', bottom: 0, right: 0, width: '100%', height: 63, textAlign: 'center', backgroundColor: '#0767DB', color: 'white', border: '1px solid #DFE3E8', zIndex: 2, fontSize: 18 }}>Add</button>
      </DashboardLayout>
    );
  }
}

Packages.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Packages);
