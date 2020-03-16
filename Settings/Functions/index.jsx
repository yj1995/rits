import React, { Component } from 'react';

import { connect } from 'react-redux';
//actions
import { Addfunctions } from '../../../Stores/Actions';

import styles from './styles';
// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';
// Material components
import { Grid, Button, Card, withStyles,CircularProgress } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import {postData} from '../../../helpers/api';


class Functions extends Component {
  constructor(props) {
    super(props);
    this.getFunctions()
    // this.props.history.push('/uploadPhoto', {
    //     subjectsList: "hhhh"
    //   })
  }
  getFunctions=async ()=>{
    var userId=await localStorage.getItem('userData')?JSON.parse(localStorage.getItem('userData')).id:''
    var fun= await postData('api/getFunction',{userId:userId})
    if(!fun) return null;
    this.props.Addfunctions(fun.data.data)
    this.setState({ isLoading: false })
  }
  handleChange = e => {
    this.setState({ events: e.target.value })
  };

  state = {
    isLoading:true,
    events: '',
    isValid: false,
    edit: true
  };
  onSubmit(edit) {
    if (edit) {
      this.setState({ edit: !edit });
    } else {
      //all Save funtion goes here
      alert('successfully saved');
      this.setState({ edit: !edit });
    }
  }
  handleSubmit = async  e => {
    e.preventDefault();
    this.setState({isLoading:true})
    var userId=await localStorage.getItem('userData')?JSON.parse(localStorage.getItem('userData')).id:''
    if (this.state.events) {
    var res= await postData('api/addFunction',{functionName:this.state.events,userId:userId});
    alert(res.data.message)
    this.setState({isLoading:false})
     this.getFunctions()
      this.setState({ events: '' })
      // this.setState({ events: [...this.state.events, ] });
    }
  };
  handleDelete= async (e,id)=>{
    e.preventDefault();
    this.setState({isLoading:true})
    var res = await postData('api/deleteFunction',{functionId:id});
    alert(res.data.message)
    this.setState({isLoading:false})
    this.getFunctions()
  }
  //route handle
  routehandle(event, index) {
    event.preventDefault();
    //   console.log(this.state.events[index]);
    this.props.history.push('/packages', {
      packages: this.props.events[index]._id
    });
  }
  getCards = () => {  
    const { classes } = this.props;
    return this.props.events.map((value, i) => {
      const j = i + 1;
      return (
        <div className={classes.icons}>
        <button
          disabled={this.state.edit ? true : this.state.isValid}
          onClick={e => {
            this.routehandle(e, i);
          }} style={{ 'width': '100%', marginBottom: 16, height: 57, background: 'white', border: '1px solid rgba(0,0,0,0.26)' }}>
          <Card className={classes.card} key={i} style={{ width: '100%', marginBottom: 16, height: 57, background: 'white', }}>
            <div className={classes.container} style={{ position: 'relative', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 18, padding: '0px 15px' }}>
              <div className={classes.subcontent}>{j}</div>
              <div>{value.functionName}</div>
              
              <div>
                <Icon>keyboard_arrow_right</Icon>
              </div>
              
            </div>
          </Card>
        </button>
            <button disabled={this.state.edit ? true : this.state.isValid} className={classes.deleteIcon} onClick={(e)=>this.handleDelete(e,value.id)}>
                  <Icon>delete</Icon>
            </button>
        </div>
      );
    });
  };

  render() {

    
   
    const { classes } = this.props;

    if(this.state.isLoading) return <CircularProgress className={classes.progress} />

    const { isValid, edit } = this.state;
    return (
      <DashboardLayout title="FUNCTIONS">
        <Grid className={classes.content} item lg={7} xs={12}>
          <div className={classes.content}>
            <form className={classes.form}>
              <div className={classes.fields}>{this.getCards()}</div>
              <Card className={classes.addInput} style={{ 'height': 57, 'width': '100%', boxShadow: '0 0 0 0' }}>
                <input
                  disabled={!edit ? false : !isValid}
                  className={classes.input}
                  placeholder="Add more functions"
                  onChange={this.handleChange}
                  style={{ padding: 15, border: '1px solid rgba(0,0,0,0.26)' }}
                />
                <button onClick={this.handleSubmit} disabled={!edit ? false : !isValid} style={{ width: 57 }}>
                  <Icon>add_box</Icon>
                </button>
              </Card>
            </form>
          </div>
        </Grid>
        {/* <Button className={classes.saveButton}>save</Button> */}
        <Button style={{ fontSize: 16 }} disabled={edit ? false : isValid} className={classes.saveButton} value={edit} onClick={() => this.onSubmit(edit)} >{edit ? 'edit' : 'save'}</Button>
      </DashboardLayout>
    );
  }
}



const mapStateToProps = (state) => {
  // console.log(state)
  return {
    events: state.events
  };
};


export default connect(mapStateToProps, { Addfunctions })(withStyles(styles)(Functions));