export default theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%',
    color: '#12161B'
  },
  grid: {
    height: '100%'
  },
  content: {
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
  bottomButtonHolder: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 63,
    display: 'table',
    zIndex: 1,
    border: '1px solid #DFE3E8'
  },
  buttonLocation: {
    backgroundColor: '#0767DB',
    display: 'table-cell',
    width: '50%',
    height: '100%',
    color: 'white',
    textAlign: 'center',
    verticalAlign: 'middle',
    padding: 0,
    border: 'none'
  },
  follow: {
    backgroundColor: 'white',
    display: 'table-cell',
    width: '50%',
    height: '100%',
    color: '#0767DB',
    textAlign: 'center',
    verticalAlign: 'middle',
    padding: 0,
    border: '1px solid rgba(0, 0, 0, 0.26)'
  },
});
