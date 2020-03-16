import React from 'react';
import { Dashboard as DashboardLayout } from 'layouts';
import styles from './styles';
import { Grid, Container, withStyles } from '@material-ui/core';



function Privacy_Policy(props) {
    const { classes } = props;
    return (
            <div>
                <DashboardLayout title="PRIVACY POLICY">
                        <Grid className={classes.content} xs={12} >
                            <Container maxWidth="md">
                                <p><strong>What information do we collect?</strong></p>
                                <p>We collect information from you when you register on our site or fill out an enquiry form.</p>
                                <p>When enquiring or registering on our site, as appropriate, you may be asked to enter your name, email address or mobile number.&nbsp;</p>
                                <p>&nbsp;</p>
                                <p><strong>What we use your information for?</strong></p>
                                <p>Any of the information we collect from you may be used in one or the following ways:</p>
                                <ul>
                                <li>To personalize your experience (your information helps us to better respond to your individual needs)</li>
                                <li>To improve our application (we continually strive to improve our website offering based on the information and feedback we receive from you)</li>
                                <li>To improve customer service (your information helps us to more effectively respond to your customer service requests and support needs)</li>
                                <li>To send periodic emails</li>
                                <li>The email address or mobile number your provide while registration, may be used to send you information updates on services, products or places of partner merchants, in addition to receiving occasional company news, updates related to our companies developments.</li>
                                </ul>
                                <p>&nbsp;</p>
                                <p>Note: If at any time you would like to unsubscribe from receiving future emails, we include detailed unsubscribe instructions at the bottom of each email.</p>
                                <p>&nbsp;</p>
                                <ul>
                                <li>To administer a contest, promotion, survey or other site feature.</li>
                                </ul>
                                <p>&nbsp;</p>
                                <p><strong>How do we protect your information?</strong></p>
                                <p>We implement a variety of security measures to maintain the safety of your personal information when you access your personal information.</p>
                                <p>&nbsp;</p>
                                <p><strong>Do we use cookies?</strong></p>
                                <p>We do not use cookies.</p>
                                <p>&nbsp;</p>
                                <p><strong>Do we disclose any information to other parties?</strong></p>
                                <p>We do not sell, trade, or otherwise transfer to outside parties your personal identifiable information. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential. We may also release your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others rights, property or safety. However non-personally identifiable visitor information may be provided to other parties for marketing, advertising or other uses.</p>
                                <p>&nbsp;</p>
                                <p><strong>Third Party Links</strong></p>
                                <p>Occasionally, at our discretion we may include or offer third party products or services on our website. These third party sites have separate and independent privacy policies. We therefore have no responsibility or liability for the content and activities of these linked sites. Nonetheless, we seek to protect the integrity of our site and welcome any feedback about these sites.</p>
                                <p>&nbsp;</p>
                                <p><strong>Online Privacy Policy</strong></p>
                                <p>This online privacy policy applies only to information collected through our website and not to information collected offline.</p>
                                <p>&nbsp;</p>
                                <p><strong>Terms &amp; Conditions</strong></p>
                                <p>Please also visit our Terms and Conditions section establishing the use, disclaimers, and limitations of liability of governing the use of our website at https://ritsworld.com/terms</p>
                                <p>&nbsp;</p>
                                <p><strong>Your Consent</strong></p>
                                <p>By using our website you consent to our privacy policy.</p>
                                <p>&nbsp;</p>
                                <p><strong>Changes to our Privacy Policy</strong></p>
                                <p>If we decide to change our privacy policy, we will post those changes on this page.</p>
                                <p>This policy was last modified on 04/08/2019</p>
                                <p>&nbsp;</p>
                                <p><strong>Contacting Us</strong></p>
                                <p>If there are any questions regarding this privacy policy, you may contact us using the information below:</p>
                                <p>RITSWORLD BUSINESS SOLUTIONS PRIVATE LIMITED</p>
                                <p>#488, 2nd Cross, Troop Lane, Ramanagara, Bangalore Rural,&nbsp;</p>
                                <p>Karnataka, India, 571511. Email admin@ritsworld.com</p>
                                <p>&nbsp;</p>
                            </Container>
                        </Grid>
                </DashboardLayout>
            </div>
        )
    
}

export default withStyles(styles)(Privacy_Policy);