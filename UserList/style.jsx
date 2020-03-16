export default theme => ({
  root: {
    padding: 0
  },
  content: {
    margin: '20px 10px 10px 10px'
  },
  showMore: {
    backgroundColor: 'white',
    display: 'table-cell',
    minWidth: 200,
    height: 50,
    marginTop: 10,
    color: '#0767DB',
    textAlign: 'center',
    verticalAlign: 'middle',
    padding: 0,
    border: '1px solid rgba(0, 0, 0, 0.26)',
    position: 'relative',
    left: '50%',
    transform: 'translate(-50%)'
  },
  bottomButtonHolder: {
    left: 0,
    width: '100%',
    minHeight: 50,
    display: 'table',
    zIndex: 1,
    position: 'relative',
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
  backColor: {
    position: 'fixed',
    left: 0,
    minHeight: 60,
    zIndex: 1,
    width: '100%',
    backgroundColor: 'white',
    borderBottom: '1px solid #DFE3E8'
  },
  buttonLocation: {
    height: 40,
    float: 'right',
    color: 'white',
    position: 'fixed',
    minWidth: 100,
    border: 'none',
    display: 'table-cell',
    padding: '0px 10px',
    textAlign: 'center',
    verticalAlign: 'middle',
    backgroundColor: '#0767DB'
  },
  progressWrapper: {
    display: 'block',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  list: {
    width: '60vh',
  },
  fullList: {
    width: 'auto',
  },
  filterButton: {
    position: 'fixed',
    'width': 70,
    'right': 249,
    'height': 40,
    'border': 'none',
    backgroundColor: 'white',
    border: '1px solid #DFE3E8',
    zIndex: 1
  },
});
