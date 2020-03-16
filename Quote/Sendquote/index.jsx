import React from 'react';

import styles from './styles';
import { Grid, Button, FormControl, InputLabel, Select, Card, Icon, ClickAwayListener, FilledInput } from '@material-ui/core';

import { connect } from 'react-redux';
// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

// Material helpers
import { withStyles, TextField } from '@material-ui/core';

import { postData } from '../../../helpers/api';
function Sendquote(props) {
    console.log(props);
    const { classes } = props;
    const [value, setValue] = React.useState("");
    const [selectedPackage, setPackage] = React.useState("");

    const handleChange = (e) => {
        e.preventDefault();
        setValue(e.target.value);
    }
    const eventRender = () => {
        console.log(props.events);
        return props.events.map((value) => {
            return <option value={value.id}>{value.functionName}</option>
        })
    }
    const packageRender = () => {
        // console.log(props.packages);
        console.log("packagerender")
        if (!props.packages) return null;
        var packages = props.packages.filter((event, index) => {
            if (event.functionId === value) {
                return event;
            }
        });
        return packages.map((value) => {
            console.log(value.packageName)
            return <option value={value.id}>{value.packageName}</option>
        })
    }
    const selectPackage = (e) => {
        e.preventDefault();
        setPackage(e.target.value);
    }
    const handleSend = async (e) => {
        e.preventDefault();
        var userId = await localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).id : ''
        var data = {
            // functionId :value, 
            packageId: selectedPackage,
            // packageDetails : "", 
            // pdfUrl : "", 
            userId: userId
        }
        var res = await postData('api/sendQuotePackage', data);
        alert(res.data.message)
        if (detectmob()) {
            props.history.push('/settingsHomeUI', {
            });
        }
    }

    const detectmob = () => {
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
    const renderQuote = (present = detectmob()) => {
        return (
            <React.Fragment>
                <Grid className={classes.content} item lg={7} xs={12}>
                    <div className={classes.content} style={{ height: !present ? window.innerHeight : window.innerHeight - 55 - 63 }}>
                        <form className={classes.form} style={{ padding: !present ? 10 : null, width: !present ? 500 : null, marginTop: !present ? 60 : null, marginBottom: !present ? 60 : null }}>
                            {/* <div className={classes.fields}> */}
                            {/* <Card className={classes.function}> */}
                            {/* <FormControl variant="filled" className={classes.formControl}>
                                <InputLabel htmlFor="filled-age-native-simple">SELECT TYPE OF FUNCTION</InputLabel>
                                <Select
                                    native
                                    // value={state.age}
                                    onChange={handleChange}
                                    input={<FilledInput name="age" id="filled-age-native-simple" />}
                                >
                                    <option value="" />
                                    {eventRender()}
                                </Select>
                            </FormControl> */}
                            <div className={classes.fields}>
                                <TextField
                                    style={{ width: '100%' }}
                                    label="SELECT TYPE OF FUNCTION"
                                    margin="dense"
                                    onChange={handleChange}
                                    select
                                    SelectProps={{ native: true, style: { height: 56 } }}
                                    InputLabelProps={{ style: { padding: '8px 0px', fontSize: '1rem' } }}
                                    value=''
                                    variant="outlined">
                                    {eventRender()}
                                </TextField>
                            </div>
                            <div className={classes.fields}>
                                <TextField
                                    style={{ width: '100%' }}
                                    label="SELECT TYPE OF PACKAGE"
                                    margin="dense"
                                    onChange={selectPackage}
                                    select
                                    SelectProps={{ native: true, style: { height: 56 } }}
                                    InputLabelProps={{ style: { padding: '8px 0px', fontSize: '1rem' } }}
                                    value=''
                                    variant="outlined">
                                    {packageRender()}
                                </TextField>
                            </div>
                            {/* <FormControl variant="filled" className={classes.formControl}>
                                <InputLabel htmlFor="filled-age-native-simple">SELECT TYPE OF PACKAGE</InputLabel>
                                <Select
                                    native
                                    // value={state.age}
                                    onChange={selectPackage}
                                    input={<FilledInput name="age" id="filled-age-native-simple" />}
                                >
                                    <option value="" />
                                    {packageRender()}
                                </Select>
                            </FormControl>
                        </div> */}
                        </form>
                    </div>
                </Grid>
                <Button style={{ width: !present ? 500 : null, right: !present ? 0 : null, left: !present ? 'unset' : null }} className={classes.saveButton} onClick={handleSend} >SEND NOW</Button>
            </React.Fragment>
        )
    }
    return (
        detectmob() ?
            <DashboardLayout title="SEND QUOTE">
                {renderQuote()}
            </DashboardLayout> : renderQuote()
    )
}

const mapStateToProps = (state) => {


    return {
        events: state.events,
        packages: state.packages
    };
};
export default connect(mapStateToProps, {})(withStyles(styles)(Sendquote)); withStyles(styles)(Sendquote);