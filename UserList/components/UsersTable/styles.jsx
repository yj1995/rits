export default theme => ({
  root: {},
  tableRow: {
    height: '100%'
  },
  tableCell: {
    whiteSpace: 'nowrap',
    padding: '0px 10px',
    border: '1px solid #DFE3E8',
    textAlign: 'left'
  },
  tableCellInner: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    display: 'inline-flex',
    fontSize: '14px',
    fontWeight: 500,
    height: '36px',
    width: '36px'
  },
  nameText: {
    display: 'inline-block',
    marginLeft: theme.spacing.unit * 2,
    fontWeight: 500,
    cursor: 'pointer'
  },
  actionButton: {
    fontSize: 12,
    color: '#0767DB',
    textAlign: 'center',
    border: '1px solid #DFE3E8'
  }
});
