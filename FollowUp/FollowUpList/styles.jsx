export default theme => ({
    root: {
        padding: '5px 15px',
        overflowY: 'auto',
        boxShadow: '0px 0px 15px #DFE3E8'
    },
    grid: {
        height: '100%'
    },
    content: {
        marginTop: theme.spacing.unit * 2
    },
    form: {
        paddingLeft: '100px',
        paddingRight: '100px',
        paddingBottom: '125px',
        flexBasis: '700px',
        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing.unit * 2,
            paddingRight: theme.spacing.unit * 2
        }
    },
    fields: {
        marginTop: theme.spacing.unit * 2
    },
    textField: {
        width: '100%',
        '& + & ': {
            marginTop: theme.spacing.unit * 2
        }
    },
    fieldError: {
        color: theme.palette.danger.main,
        marginBottom: theme.spacing.unit * 2,
        marginTop: theme.spacing.unit
    },
    submitError: {
        color: theme.palette.danger.main,
        alignText: 'center',
        marginBottom: theme.spacing.unit,
        marginTop: theme.spacing.unit * 2
    },
    saveButton: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 63,
        textAlign: 'center',
        backgroundColor: '#0767DB',
        color: 'white',
        border: '1px solid #DFE3E8',
    },
    progressWrapper: {
        display: 'block',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
});
