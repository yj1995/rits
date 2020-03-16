export default theme => ({
  root: {
    padding: '5px 15px',
    overflowY: 'auto',
  },
  content: {
    marginTop: 60
  },
  progressWrapper: {
    display: 'block',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  pagination: {
    marginTop: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
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
  filterButton: {
    position: 'fixed',
    'width': 70,
    'right': 0,
    'height': 48,
    'border': 'none',
    backgroundColor: 'white',
    border: '1px solid #DFE3E8',
    zIndex: 1
  },
  showMore: {
    backgroundColor: 'white',
    display: 'table-cell',
    width: '100%',
    height: 48,
    color: '#0767DB',
    textAlign: 'center',
    verticalAlign: 'middle',
    padding: 0,
    border: '1px solid rgba(0, 0, 0, 0.26)'
  },
  fields: {
    margin: '16px 0px 10px 0px'
  },
});
