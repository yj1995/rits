import React, { Component } from 'react';
import { Alert } from 'reactstrap';

// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Button, TextField , CircularProgress} from '@material-ui/core';

import axios from 'axios';
import { apiUrl } from "../../../../config";
// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
  PortletFooter
} from 'components';

// Component styles
import styles from './styles';

class FileUpload extends Component {
  state = {
    values: {
      password: '',
      confirm: ''
    },
    isLoading: false,
    selectedFile: null,
    isSuccess: false
  };

  componentDidMount(){
      // let userId = JSON.parse(localStorage.getItem('userData')).id
      // axios.post(`${apiUrl}api/checkQuote/${userId}`).then(res => {
      //     console.log(res.data);
      //     if(res.data.status == 1){

      //     }else{

      //     }
      // })
  }

  handleFieldChange = (field, value) => {
    const newState = { ...this.state };

    newState.values[field] = value;

    this.setState(newState, this.validateForm);
  };

 onChangeHandler=event=>{
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    })
  }
    onClickHandler = () => {
      this.setState({ isLoading: true });
       const data = new FormData()
       data.append('file', this.state.selectedFile)
       let userId = JSON.parse(localStorage.getItem('userData')).id
       axios.post(`${apiUrl}api/uploadQuote/${userId}`, data, { 

          // receive two    parameter endpoint url ,form data
      })
    .then(res => { // then print response status
        console.log(res.statusText, 'res')
        this.setState({ isLoading: false });

        // this.setState({ isSuccess : true })
        window.alert('Updated successfully')

     })
    }

  render() {
    const { classes, className, ...rest } = this.props;
    const { values ,isLoading} = this.state;

    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet {...rest} className={rootClassName} >
        <PortletHeader>
          <PortletLabel subtitle="(pdf)" title="Upload Document" />
        </PortletHeader>
            
          <form className={classes.form}>
        <PortletContent>
            <input type="file" name="file" onChange={this.onChangeHandler}/>
        </PortletContent>
        <PortletFooter className={classes.portletFooter}>
          <button type="button" class="btn btn-success btn-block" onClick={this.onClickHandler}>Upload</button>
        </PortletFooter>
        {this.state.isSuccess ? 
        <Alert color="success">Uploaded successfully</Alert> : "" }
        </form>

        {isLoading ? (
                      <CircularProgress className={classes.progress} />
        ) : (
          ""
        )}

      </Portlet>
    );
  }
}

FileUpload.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FileUpload);
