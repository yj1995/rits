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
  Typography
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
import { ProductsToolbar, ProductCard } from './components';

// Component styles
import styles from './styles';

class ProductList extends Component {
  signal = true;

  state = {
    isLoading: true,
    limit: 20,
    page: 1,
    products: [],
    productsTotal: 0,
    error: null,
    filter: false
  };

  componentDidMount() {
    // window.onscroll = function(ev) {
    //     if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    //         console.log('at bottom')
    //     }
    // };
  }

  async getProducts(limit) {
    try {
      this.setState({ isLoading: true });

      const { products, productsTotal } = await getProducts(limit);

      if (this.signal) {
        this.setState({
          isLoading: true,
          products,
          productsTotal,
          limit
        });
      }
    } catch (error) {
      if (this.signal) {
        this.setState({
          isLoading: true,
          error
        });
      }
    }
  }

  refresh() {
    this.setState({ products: [] });
    this.getLeadData(0, JSON.parse(localStorage.getItem('userData')));
  }

  addLead() {
    const { history } = this.props;
    history.push('/add-Lead');
  }

  getLeads(mobileno) {
    this.setState({ isLoading: true })
    axios.post(`${apiUrl}api/authorize`, { mobileno: mobileno }).then(res => {
      console.log(res.data);
      if (res.data.status === 1) {
        this.getLeadData(0, JSON.parse(localStorage.getItem('userData')))
      } else {

      }
    })
  }

  loadNext() {
    this.setState({ page: this.state.page + 1 })
    let userData = localStorage.getItem('userData')
    this.getLeadData(this.state.page + 1, JSON.parse(userData))
  }

  getLeadData(page, userData) {
    let params = userData.typeofUser ? 'assignedUser' : 'userId';
    axios.post(`${apiUrl}api/getMails`, { [params]: userData._id, page: page }).then(res => {
      console.log(res.data);
      if (res.data.status === 1) {
        this.setState({ isLoading: false })
        this.setState({ limit: res.data.data.length })
        this.setState({ products: this.state.products.concat(res.data.data) })
      } else {

      }
    })
  }

  search(e) {
    axios.post(`${apiUrl}api/searchLeads`, { searchkey: e, userId: JSON.parse(localStorage.getItem('userData'))._id }).then(res => {
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
    this.signal = true;

    const { history } = this.props;

    let userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : {}

    if (userData.gtoken) {
      this.getLeads(userData.mobileno);
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

  renderProducts() {
    const { classes, className } = this.props;
    const { isLoading, products } = this.state;
    console.log(isLoading);
    let sort = [];
    const rootClassName = classNames(classes.root, className);
    let uniqueData = [];
    if (isLoading) {
      return (
        <div className={classes.progressWrapper}>
          <CircularProgress />
        </div>
      );
    }

    if (products.length === 0 && !isLoading) {
      return (
        < Paper className={rootClassName} style={{ height: 50, width: '100%' }}>
          <Row style={{ margin: 0, marginTop: 5 }}>
            <Col xl="12" style={{ textAlign: "center" }}>There are no Lead</Col>
          </Row></Paper>
      );
    } else {
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
    }

    return (
      <Grid
        container
        spacing={3}
      >
        {
          uniqueData.map(product => (
            <Grid
              item
              key={product.id}
              lg={4}
              md={6}
              xs={12}
              onClick={() => this.productDetails(product)}
            >
              <ProductCard product={product} history={this.props.history} />
            </Grid>
          ))
        }
      </Grid>
    );
  }
  reset() {
    console.log('reset');
  }
  apply() {
    console.log('apply');
    this.setState({ filter: false })
  }
  makeFilter(classes) {
    return (<React.Fragment>
      <div className={classes.bottomButtonHolder}>
        <button className={classes.buttonLocation} style={{ borderRight: '1px solid #DFE3E8' }} onClick={() => this.reset()}>RESET</button>
        <button className={classes.buttonLocation} onClick={() => this.apply()}>APPLY</button>
      </div>
    </React.Fragment>);
  }

  leadView(classes) {
    console.log('this.state.isLoading', this.state.isLoading);
    return (
      <React.Fragment>
        <SearchBar
          // onChange={(e) => this.search(e)}
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
        <div className={classes.bottomButtonHolder}>
          <button className={classes.buttonLocation} style={{ borderRight: '1px solid #DFE3E8' }} onClick={() => this.addLead()}>+ ADD LEAD</button>
          <button className={classes.buttonLocation} onClick={() => this.refresh()}>REFRESH</button>
        </div>
        <div className={classes.root} style={{ height: window.innerHeight - 55 - 63 }}>
          {/*<ProductsToolbar />*/}
          <div className={classes.content} >{this.renderProducts()}</div>

          {(this.state.limit == 20 && this.state.products.length >= 20) ?
            <div className={classes.fields}>
              <button className={classes.showMore} onClick={this.loadNext.bind(this)} style={{ opacity: this.state.isLoading ? 0 : 1 }}>Show More</button>
            </div> :
            ''
          }

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
    console.log('hhhhh');
    return (
      <DashboardLayout title={this.state.filter ? 'Filters' : 'Leads'}>
        {this.state.filter ? this.makeFilter(classes) : this.leadView(classes)}
      </DashboardLayout>
    );
  }
}

ProductList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductList);
