import React, { Component } from 'react';
import { Dashboard as DashboardLayout } from 'layouts';
import { Grid } from '@material-ui/core';
import styles from './styles';
import { withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Container from '@material-ui/core/Container';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';


class UploadPhoto extends Component {
    state = { file: '', imagePreviewUrl: '' };

    _handleSubmit(e) {
        e.preventDefault();
        console.log('handle uploading-', this.state.file);
    }
    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        if (file.size > 1024 * 2000) {
            alert("File is greater then 2MB!");
            return;
        };
        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
            localStorage.setItem('uploadImage', JSON.stringify(reader.result)); //yash
        }
        reader.readAsDataURL(file)
    }

    render() {
        let { imagePreviewUrl } = this.state;
        let imagePreview = null;
        if (imagePreviewUrl) {
            imagePreview = imagePreviewUrl;
        }
        const { classes } = this.props;
        return (
            <div>
                <DashboardLayout title="PROFILE PHOTO">
                    <Grid className={classes.content} xs={12} >
                        <Container maxWidth="sm">
                            {/* <Box className={classes.root}> */}
                            <Card className={classes.card}>
                                <CardMedia
                                    className={classes.media}
                                    image={imagePreview}
                                    title="image"
                                />
                            </Card>
                            {/* </Box> */}
                        </Container>
                    </Grid>
                    <input

                        accept="image/*"
                        className={classes.input}
                        id="contained-button-file"
                        multiple
                        type="file"

                        onChange={(e) => this._handleImageChange(e)}
                    />

                    <label htmlFor="contained-button-file" className={classes.menuButton}>
                        <Button variant="contained" fullWidth component="span" color='primary' className={classes.saveButton}>
                            <Icon className={classes.icon} >
                                add
                                </Icon>
                            UPLOAD PHOTO
                            </Button>
                    </label>

                </DashboardLayout>
            </div>
        )
    }

}
export default withStyles(styles)(UploadPhoto);