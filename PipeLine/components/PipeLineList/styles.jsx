export default theme => ({
    root: {
      maxWidth: '100%',
      padding: 0,
      boxShadow: '0px 0px 15px #DFE3E8'
    },
    imageWrapper: {
      height: '64px',
      width: '64px',
      margin: '0 auto',
      border: '1px solid #EDF0F2',
      borderRadius: '5px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    image: {
      width: '100%'
    },
    details: {},
    title: {
      fontSize: '18px',
      lineHeight: '21px',
      textAlign: 'center',
      marginTop: theme.spacing.unit * 2
    },
    description: {
      lineHeight: '16px',
      height: theme.spacing.unit * 4,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      color: theme.palette.text.secondary,
      textAlign: 'center',
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit * 2
    },
    stats: {
      display: 'flex',
      alignItems: 'center',
      paddingTop: theme.spacing.unit
    },
    updateIcon: {
      color: theme.palette.text.secondary
    },
    updateText: {
      marginLeft: theme.spacing.unit,
      color: theme.palette.text.secondary
    },
    downloadsIcon: {
      marginLeft: 'auto',
      color: theme.palette.text.secondary
    },
    downloadsText: {
      marginLeft: theme.spacing.unit,
      color: theme.palette.text.secondary
    },
    buttonStyle: {
      width: "100%",
      color: "#0767DB",
      background: "white",
      height: "100%",
      textAlign: "center",
      border: "none"
    }
  });
  