
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
  media: {
    paddingLeft: theme.spacing(2),
  },
  input: {
    display: 'none',
  },
  menuButton: {
    width:"85%",
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems: 'center',
  },
  addInput:{
    minWidth: 275,
    display: 'flex',
    justifyContent: 'space-between',
  },
  valueAdd:{
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
  }
});
