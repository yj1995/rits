
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
    function:{
      minWidth: 275,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    dropdown:{
      flexGrow:1,
    },
    formControl: {
      display: 'flex',
      margin: theme.spacing(1),
      minWidth: 120,
      flexGrow:1,
    },
  });
  