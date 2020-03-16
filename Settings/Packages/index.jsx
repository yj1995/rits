import React, { Component } from 'react';

import { connect } from 'react-redux';
//actions
import { AddPackages, AddPackageFile } from '../../../Stores/Actions';

import styles from './styles';
// Material components
import { Grid, Button, Container, Card,CircularProgress } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';
import {postData} from '../../../helpers/api';

// Material helpers
import { withStyles } from '@material-ui/core';


class Packages extends Component {
  constructor(props) {
    super(props); 
    this.state = {
      isLoading:true,
      packages: '',
      packageIndex: this.props.location.state.packages,
      isValid: false,
      edit: true,
      value: '',
    };
    this.getPackages();
  }
  
  getPackages= async ()=>{
    var userId=await localStorage.getItem('userData')?JSON.parse(localStorage.getItem('userData')).id:''
    var packages= await postData('api/getPackages',{userId:userId})
    if(!packages) return null;
    var data=packages.data.data.packages.filter((value,index)=>{
      if(value.functionId === this.state.packageIndex){
        return value;
      }
    });
    this.props.AddPackages(data)
    this.setState({ isLoading: false })
  }
  packageIndex = ''
  onSubmit = (edit) => {
    if (edit) {
      this.setState({ edit: !edit });
    } else {
      //all Save funtion goes here
      alert('successfully saved');
      // this.props.history.push('/sendquote', {
      // });
    }
  }

  handleChange = e => {
    this.event = e.target.value;
    this.setState({ value: e.target.value });
    this.setState({ packages: e.target.value })
  };

  handleFileChange = async (e, index) => {
    // console.log(index);
    console.log("fileName=>",e.target.files[0].name,"File=>",e.target.files[0])
    e.preventDefault();
    //console.log(index)
    // let reader = new FileReader();
     let file = e.target.files[0];

    if (file && file.size > 1024 * 2000) {
      alert("File is greater then 2MB!");
      return;
    };
    var formData = new FormData();
    formData.append('file', file);
   var amazonPdfUrl= await postData('api/uploadPdf',formData);

   var packages = this.props.packages?this.props.packages:[];
    var value=packages.find((value,indx)=>{
     return  indx==index
    });
    var updatePackage={packageId:value.id}
    updatePackage.pdfUrl=amazonPdfUrl.data.data[0]
    await postData('api/updatePackage',updatePackage); 
    window.alert('Quotation uploaded')
    this.getPackages();

    // this.props.AddPackageFile({ index: this.state.packageIndex, packageIndex: index, value: file });

    // reader.onoadend = () => {
    //     this.setState({
    //         file: file,
    //         imagePreviewUrl: reader.result
    //     });
    //     localStorage.setItem('uploadImage', JSON.stringify(reader.result)); //yash
    //     alert('Upload Success')
    // }
    // reader.readAsDataURL(file)

  }
  handleSubmit = async e => {
    e.preventDefault();
    this.setState({isLoading:true})
    var userId=await localStorage.getItem('userData')?JSON.parse(localStorage.getItem('userData')).id:''
    if (this.state.packages) {
     var data =  {
        functionId :this.state.packageIndex, 
        packageName : this.state.packages, 
        packageDetails : "", 
        pdfUrl : "", 
        userId:userId
        }
        var res=  await postData('api/addPackage',data)
      alert(res.data.message)
    this.setState({isLoading:false})
     this.getPackages();
      this.setState({ packages: '' })
    }
  };
  handleDelete= async (e,id)=>{
    e.preventDefault();
    this.setState({isLoading:true})
    var res = await postData('api/deletePackage',{packageId:id});
    alert(res.data.message)
    this.setState({isLoading:false})
     this.getPackages();
  }
  
  getCards = (value,i) => {
    //console.log(this.props)
    console.log(value)
    const { classes } = this.props;    
    const index=i
      return (
        <div key={'package_' + index}  className={classes.icons}>
          <Card
            className={classes.menuButton}
            style={{ width: '100%', 'margin': 0, marginBottom: 16, border: '1px solid rgba(0,0,0,0.26)', boxShadow: '0 0 0 0' }} >
            <Grid item xs={9} className={classes.media}>
              <span>{value.packageName}</span>
            </Grid>
            <Grid item xs={3}>
              
              <input
                disabled={this.state.edit ? true : this.state.isValid}
                accept="application/pdf"
                // disabled={!this.state.edit ? false : this.state.isValid}
                // className={classes.input}
                // id="contained-button-file"
                // indx={index}
                // ref={fileinput=>{
                 
                //  return  this.fileInput=fileinput
                // }}
                type="file"
                multiple
                onChange={(e) => this.handleFileChange(e, index)}
              />
              {/* <label
            
                // htmlFor="contained-button-file"
                onClick={()=>{
                    // console.log(this.fileInput)
                  return this.fileInput.click(index)}}
                style={{ display: 'inline', textAlign: 'left' }}
                className={classes.media}>
                <Button variant="contained" component="span" color="primary"  >
                  UPLOAD FILE
              </Button>
              </label> */}
            </Grid>
          </Card>
             <button disabled={this.state.edit ? true : this.state.isValid} className={classes.deleteIcon} onClick={(e)=>this.handleDelete(e,value.id)}>
                  <Icon>delete</Icon>
            </button>
        </div>
      );

  };

  render() {
    var packages = this.props.packages?this.props.packages:[];
    const { classes } = this.props;
    if(this.state.isLoading) return <CircularProgress className={classes.progress} />

    const { isValid, edit } = this.state;
    return (
      <DashboardLayout title="PACKAGE">
        <Grid className={classes.content} item lg={7} xs={12}>
          <div className={classes.content}>
            <form className={classes.form} encType="multipart/form-data">
              <div className={classes.fields}>
                <Container
                  style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', padding: 0 }}>
                  {/* <p style={{ width: '100%', border: '1px solid rgba(0,0,0,0.26)', 'padding': 15, 'fontSize': 18 }}>Function Name: {this.state.packageIndex}</p> */}
                  {!packages?null:packages.map(this.getCards)}
                </Container>
                <Card className={classes.addInput}>
                  <input
                    className={classes.valueAdd}
                    disabled={!edit ? false : !isValid}
                    placeholder="Add more packages"
                    value={this.state.packages}
                    onChange={this.handleChange}
                    style={{ padding: 15, border: '1px solid rgba(0,0,0,0.26)' }}
                  />
                  <button onClick={this.handleSubmit} disabled={!edit ? false : !isValid} style={{ width: 57 }} >
                    <Icon>add_box</Icon>
                  </button>
                </Card>
              </div>
            </form>
          </div>
        </Grid>
        <Button style={{ fontSize: 16 }} disabled={edit ? false : isValid} className={classes.saveButton} value={edit} onClick={() => this.onSubmit(edit)} >{edit ? 'edit' : 'save'}</Button>
      </DashboardLayout>
    );
  }
}

const mapStateToProps = (state) => {


  return {
    packages: state.packages
  };
};


export default connect(mapStateToProps, { AddPackages, AddPackageFile })(withStyles(styles)(Packages));