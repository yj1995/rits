
export default theme => ({
    content: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
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
      marginTop: theme.spacing.unit * 2,
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
    card: {
      minWidth: 275,
    },
    container:{
      display: 'flex',
      justifyContent: 'space-between',
    },
  addInput:{
    minWidth: 275,
    display: 'flex',
    justifyContent: 'space-between',
  },
  input:{
    flexGrow:1,
  },
  progress: {
    display: 'block',
    marginTop: theme.spacing.unit * 2,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  icons:{
    display: 'flex',
  },
  deleteIcon:{
    alignSelf: 'center',
    border: '1px solid #DFE3E8',
    paddingTop: theme.spacing.unit * 1,
    paddingBottom: theme.spacing.unit * 0.7
  }
  });
  