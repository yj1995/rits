import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Grid, Typography } from '@material-ui/core';

// Component styles
const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 4
  },
  content: {
    marginTop: '150px',
    textAlign: 'center'
  },
  image: {
    display: 'inline-block',
    marginTop: '50px',
    maxWidth: '100%',
    width: '554px'
  }
});

class UnderDevelopment extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid
          container
          justify="center"
          spacing={4}
        >
          <Grid
            item
            lg={6}
            xs={12}
          >
            <div className={classes.content}>
              <Typography variant="h1">Privacy Policy</Typography>
              <Typography variant="subtitle2">
              <div>
                <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}><strong>What information do we collect?</strong></span></span></p>
                  <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}>We collect information from you when you register on our site or fill out an enquiry form.</span></span></p>
                  <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}>When enquiring or registering on our site, as appropriate, you may be asked to enter your name, email address or mobile number. </span></span></p>
                  <p align="justify">&nbsp;</p>
                  <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}><strong>What we use your information for?</strong></span></span></p>
                  <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}>Any of the information we collect from you may be used in one or the following ways:</span></span></p>
                  <ul>
                    <li>
                      <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}>To personalize your experience (your information helps us to better respond to your individual needs)</span></span></p>
                    </li>
                    <li>
                      <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}>To improve our application (we continually strive to improve our website offering based on the information and feedback we receive from you)</span></span></p>
                    </li>
                    <li>
                      <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}>To improve customer service (your information helps us to more effectively respond to your customer service requests and support needs)</span></span></p>
                    </li>
                    <li>
                      <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}>To send periodic emails</span></span></p>
                    </li>
                    <li>
                      <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}>The email address or mobile number your provide while registration, may be used to send you information updates on services, products or places of partner merchants, in addition to receiving occasional company news, updates related to our companies developments.</span></span></p>
                    </li>
                  </ul>
                  <p align="justify">&nbsp;</p>
                  <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}>Note: If at any time you would like to unsubscribe from receiving future emails, we include detailed unsubscribe instructions at the bottom of each email.</span></span></p>
                  <p align="justify">&nbsp;</p>
                  <ul>
                    <li>
                      <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}>To administer a contest, promotion, survey or other site feature.</span></span></p>
                    </li>
                  </ul>
                  <p align="justify">&nbsp;</p>
                  <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}><strong>How do we protect your information?</strong></span></span></p>
                  <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}>We implement a variety of security measures to maintain the safety of your personal information when you access your personal information.</span></span></p>
                  <p align="justify">&nbsp;</p>
                  <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}><strong>Do we use cookies?</strong></span></span></p>
                  <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}>We do not use cookies.</span></span></p>
                  <p align="justify">&nbsp;</p>
                  <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}><strong>Do we disclose any information to other parties?</strong></span></span></p>
                  <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}>We do not sell, trade, or otherwise transfer to outside parties your personal identifiable information. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential. We may also release your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others rights, property or safety. However non-personally identifiable visitor information may be provided to other parties for marketing, advertising or other uses.</span></span></p>
                  <p align="justify">&nbsp;</p>
                  <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}><strong>Third Party Links</strong></span></span></p>
                  <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}>Occasionally, at our discretion we may include or offer third party products or services on our website. These third party sites have separate and independent privacy policies. We therefore have no responsibility or liability for the content and activities of these linked sites. Nonetheless, we seek to protect the integrity of our site and welcome any feedback about these sites.</span></span></p>
                  <p align="justify">&nbsp;</p>
                  <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}><strong>Online Privacy Policy</strong></span></span></p>
                  <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}>This online privacy policy applies only to information collected through our website and not to information collected offline.</span></span></p>
                  <p align="justify">&nbsp;</p>
                  <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}><strong>Terms &amp; Conditions</strong></span></span></p>
                  <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}>Please also visit our Terms and Conditions section establishing the use, disclaimers, and limitations of liability of governing the use of our website at https://ritsworld.com/terms</span></span></p>
                  <p align="justify">&nbsp;</p>
                  <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}><strong>Your Consent</strong></span></span></p>
                  <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}>By using our website you consent to our privacy policy.</span></span></p>
                  <p align="justify">&nbsp;</p>
                  <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}><strong>Changes to our Privacy Policy</strong></span></span></p>
                  <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}>If we decide to change our privacy policy, we will post those changes on this page.</span></span></p>
                  <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}>This policy was last modified on 04/08/2019</span></span></p>
                  <p align="justify">&nbsp;</p>
                  <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}><strong>Contacting Us</strong></span></span></p>
                  <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}>If there are any questions regarding this privacy policy, you may contact us using the information below:</span></span></p>
                  <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}>RITSWORLD BUSINESS SOLUTIONS PRIVATE LIMITED</span></span></p>
                  <p align="justify"><a name="_GoBack" /> <span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}>#488, 2nd Cross, Troop Lane, Ramanagara, Bangalore Rural, </span></span></p>
                  <p align="justify"><span style={{fontFamily: 'Century Gothic, serif'}}><span style={{fontSize: 'small'}}>Karnataka, India, 571511. Email admin@ritsworld.com</span></span></p>
                </div>
              </Typography>
              {/*<img
                alt="Under development"
                className={classes.image}
                src="/images/under_development.png"
              />*/}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

UnderDevelopment.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UnderDevelopment);
