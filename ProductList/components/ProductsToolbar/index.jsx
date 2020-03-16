import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Button } from '@material-ui/core';

// Shared components
import { DisplayMode, SearchInput } from 'components';

// Component styles
import styles from './styles';

class ProductsToolbar extends Component {
  refresh(){
    window.location.href = window.location.href 
  }

  render() {
    const { classes, className } = this.props;

    const rootClassName = classNames(classes.root, className);

    return (
      <div className={rootClassName}>
        <div className={classes.row}>
          <span className={classes.spacer} />
          <Button
            color="primary"
            size="small"
            variant="outlined"
            onclick={this.refresh}
          >
            Refresh
          </Button>
        </div>
        <div className={classes.row}>
          <SearchInput
            style={{marginRight:0}}
            className={classes.searchInput}
            placeholder="Search product"
          />
          {/*<span className={classes.spacer} />*/}
          {/*<DisplayMode mode="grid" />*/}
        </div>
      </div>
    );
  }
}

ProductsToolbar.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProductsToolbar);
