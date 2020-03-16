import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from "../../config";
import { Paper } from 'components';
import classNames from 'classnames';
import { Row, Col, Button } from 'reactstrap';


// Externals
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';
import TuneIcon from '@material-ui/icons/Tune';
import SearchBar from 'material-ui-search-bar';
// Material components
import {
    IconButton,
    CircularProgress,
    Grid,
    Typography,
    TextField
} from '@material-ui/core';

// Material icons
import {
    ChevronRight as ChevronRightIcon,
    ChevronLeft as ChevronLeftIcon
} from '@material-ui/icons';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

// Shared services
import { getProducts } from 'services/product';

// Custom components
import PipeLineList from './components/PipeLineList';

// Component styles
import styles from './styles';

const status = [
    {
        value: 'Select Status',
        label: 'Select Status'
    },
    {
        value: 'Qualified',
        label: 'Qualified'
    },
    {
        value: 'Hot',
        label: 'Hot'
    },
    {
        value: 'Won',
        label: 'Won'
    },
    {
        value: 'Lost',
        label: 'Lost'
    }
];

class PipeLine extends Component {
    signal = true;

    state = {
        isLoading: true,
        limit: 20,
        page: 1,
        status: 'Hot',
        products: [],
        productsTotal: 0,
        error: null,
        filter: false,
        showMore: false
    };

    refresh() {
        let userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : {};
        this.getLeadData(userData._id, this.state.status);
    }

    addLead() {
        const { history } = this.props;
        history.push('/add-Lead');
    }

    handleChange = (e, key) => {
        const newState = { ...this.state };
        newState[key] = e.target.value;
        this.setState(newState);
    };

    getLeadData(userId, status) {
        const params = JSON.parse(localStorage.getItem('userData')).typeofUser ? 'assignedUser' : 'userId';
        axios.post(`${apiUrl}api/getMailsBy`, { [params]: userId, status }).then(res => {
            console.log(res.data);
            this.setState({ isLoading: false })
            if (res.data.status === 1) {
                console.log(res.data.data);
                this.setState({ products: res.data.data })
            } else {

            }
        })
    }

    search(e) {
        const params = JSON.parse(localStorage.getItem('userData')).typeofUser ? 'assignedUser' : 'userId';
        axios.post(`${apiUrl}api/searchLeads`, { searchkey: e, [params]: JSON.parse(localStorage.getItem('userData'))._id }).then(res => {
            console.log(res.data.data);
            this.setState({ products: res.data.data });
        })
    }

    productDetails(product) {
        let { history } = this.props;
        localStorage.setItem('productDetails', JSON.stringify(product));
        var obj = { mobileno: product.mobileno, mobileno: product.mobileno, lId: product._id, followup: product.followup };
        localStorage.setItem('followup', JSON.stringify(obj));
        localStorage.setItem('followLeadId', obj.lId);
        history.push('/LeadDetail');
    }

    filter() {
        this.setState({ filter: true });
    }

    componentWillMount() {
        let userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : {};
        this.getLeadData(userData._id, this.state.status);
    }

    componentWillUnmount() {
        this.signal = false;
    }

    renderProducts() {
        const { classes, className } = this.props;
        const { isLoading, products } = this.state;
        let sort = [];
        let userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : {};
        const rootClassName = classNames(classes.root, className);
        let uniqueData = [];
        const params = JSON.parse(localStorage.getItem('userData')).typeofUser ? 'assignedUser' : 'userId';
        let hotList = [];
        if (isLoading) {
            return (
                <div className={classes.progressWrapper}>
                    <CircularProgress />
                </div>
            );
        }

        if (products.length === 0) {
            return (
                < Paper className={rootClassName} style={{ height: 50, width: '100%' }}>
                    <Row style={{ margin: 0, marginTop: 5 }}>
                        <Col xl="12" style={{ textAlign: "center" }}>There are no {this.state.status} Lead</Col>
                    </Row></Paper>
            );
        } else {
            console.log(products);
            sort = products.sort(function (a, b) {
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
            let data = [];
            uniqueData.find((val, i) => {
                if (val[params] === userData._id) {
                    hotList.push(val);
                }
            })
        }
        console.log(hotList);
        return (
            <Grid
                container
                spacing={3}
            >
                {
                    hotList.length ? hotList.map(product => (
                        <Grid
                            item
                            key={product.id}
                            lg={4}
                            md={6}
                            xs={12}
                            onClick={() => this.productDetails(product)}
                        >
                            <PipeLineList product={product} history={this.props.history} />
                        </Grid>
                    ), () => { this.setState({ showMore: true }) }) : < Paper className={rootClassName} style={{ height: 50, width: '100%' }}>
                            <Row style={{ margin: 0, marginTop: 5 }}>
                                <Col xl="12" style={{ textAlign: "center" }}>There are no {this.state.status} Lead</Col>
                            </Row></Paper>
                }
            </Grid>
        );
    }
    reset() {
        console.log('reset');
        this.setState({ status: '' });
    }
    apply() {
        console.log('apply');
        axios.post(`${apiUrl}api/searchLeads`, { status: this.state.status, userId: JSON.parse(localStorage.getItem('userData'))._id }).then(res => {
            console.log(res.data.data);
            this.setState({ products: res.data.data, filter: false });
        })
    }
    makeFilter(classes) {
        return (<React.Fragment>
            <div className={classes.fields}>
                <TextField
                    style={{ width: '100%' }}
                    label="STATUS"
                    margin="dense"
                    onChange={(e) => this.handleChange(e, 'status')}
                    select
                    SelectProps={{ native: true, style: { height: 56 } }}
                    InputLabelProps={{ shrink: true, style: { padding: '8px 0px', fontSize: '1rem' } }}
                    value={this.state.status}
                    variant="outlined">
                    {status.map(option => (
                        <option
                            key={option.value}
                            value={option.value}
                            style={{ margin: 10, fontSize: 16 }}
                        >
                            {option.label}
                        </option>
                    ))}
                </TextField>
            </div>
            <div className={classes.bottomButtonHolder}>
                <button className={classes.buttonLocation} style={{ borderRight: '1px solid #DFE3E8' }} onClick={() => this.reset()}>RESET</button>
                <button className={classes.buttonLocation} onClick={() => this.apply()}>APPLY</button>
            </div>
        </React.Fragment>);
    }

    leadView(classes) {
        return (
            <React.Fragment>
                <SearchBar
                    onChange={(e) => this.search(e)}
                    onRequestSearch={(e) => this.search(e)}
                    style={{
                        width: window.innerWidth - 70,
                        boxShadow: '0 0 0 0 white',
                        border: '1px solid #DFE3E8',
                        position: 'fixed',
                        zIndex: 1,
                        opacity: this.state.isLoading ? 0 : 1,
                        borderRadius: 0
                    }}
                    spellCheck={true}
                    placeholder="Search by name, mobile, email ...."
                    inputProps={{ 'aria-label': 'Search by name, mobile, email ....', style: { color: 'black', fontSize: 18 } }}
                ><input></input></SearchBar>
                <button className={classes.filterButton} onClick={() => this.filter()} style={{ opacity: this.state.isLoading ? 0 : 1 }}><TuneIcon color="primary" fontSize="large" style={{ width: '70%', height: '70%' }} /></button>
                {/* <div className={classes.bottomButtonHolder}>
                    <button className={classes.buttonLocation} style={{ borderRight: '1px solid #DFE3E8' }} onClick={() => this.addLead()}>+ ADD LEAD</button>
                    <button className={classes.buttonLocation} onClick={() => this.refresh()}>REFRESH</button>
                </div> */}
                <div className={classes.root} style={{ height: window.innerHeight - 55 }}>
                    {/*<ProductsToolbar />*/}
                    <div className={classes.content} >{this.renderProducts()}</div>

                    {/* {(this.state.limit == 20 && this.state.products.length >= 20) ?
                        <div className={classes.fields}>
                            <button className={classes.showMore} onClick={this.loadNext.bind(this)} style={{ opacity: this.state.isLoading ? 0 : this.state.showMore ? 1 : 0 }}>Show More</button>
                        </div> :
                        ''
                    } */}

                    {/*<div className={classes.pagination}>
        <Typography variant="caption">1-6 of 20</Typography>
        <IconButton>
          <ChevronLeftIcon />
        </IconButton>
        <IconButton>
          <ChevronRightIcon />
        </IconButton>
      </div>*/}
                </div>
            </React.Fragment>
        );
    }

    render() {
        const { classes } = this.props;
        return (
            <DashboardLayout title={this.state.filter ? 'Filters' : 'PIPELINE'}>
                {this.state.filter ? this.makeFilter(classes) : this.leadView(classes)}
            </DashboardLayout>
        );
    }
}

PipeLine.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PipeLine);