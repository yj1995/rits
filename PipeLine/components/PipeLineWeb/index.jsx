import React, { Component } from 'react';
import axios from 'axios';
import { apiUrl } from '../../../../config';
// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';
import { Container, Row, Col, Button } from 'reactstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Material components
import { SwipeableDrawer, Icon, CircularProgress } from '@material-ui/core';

// Component styles
import styles from '../../styles';

// Material helpers
import { withStyles } from '@material-ui/core';

import FollowUpList from '../../../FollowUp/FollowUpList/index';
import Quote from '../../../Quote/index';
import LeadDetail from '../../../AddLead/LeadDetail/index';

// fake data generator
const getItems = state => {
  state.blank.map((data, i) => {
    if (data.status && data.status != 'Select Status') {
      state[data.status].push(data);
    }
  });
  return state;
};

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: '16px 16px 0px 16px',
  margin: `0 0 ${grid}px 0`,
  color: 'black',
  borderTop: '1px solid rgba(192,192,192,1)',
  borderLeft: '1px solid rgba(192,192,192,1)',
  borderRight: '1px solid rgba(192,192,192,1)',
  boxShadow: '0px 0px 5px #DFE3E8',
  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'white',

  // styles we need to apply on draggables
  ...draggableStyle
});
const color = ['#3cba54', '#db3236', '#4885ed', '#f4c20d'];
const getListStyle = (isDraggingOver, i) => ({
  background: isDraggingOver ? 'lightblue' : 'white',
  width: '25%',
  height: 'auto',
  padding: 8,
  border: '1px solid rgba(0,0,0,0.26)'
});

class PipeLineWeb extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // items: getItems(10),
      // selected: getItems(5, 10),
      blank: [],
      Qualified: [],
      Hot: [],
      Won: [],
      Lost: [],
      right: false,
      select: '',
      loading: true
    };
  }
  /**
   * A semi-generic way to handle multiple lists. Matches
   * the IDs of the droppable container to the names of the
   * source arrays stored in the state.
   */
  id2List = {};

  sideList = side => {
    if (this.state.select === 'followUp') {
      return (
        <React.Fragment>
          <div
            style={{
              position: 'fixed',
              width: 500,
              height: 60,
              color: 'white',
              textAlign: 'center',
              backgroundColor: '#0767DB',
              zIndex: 2
            }}
          >
            <span
              className="header"
              style={{
                top: '50%',
                position: 'absolute',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                fontSize: 18
              }}
            >
              Follow Up
            </span>
            <Icon
              onClick={() => this.closeDrawer(side, false)}
              style={{
                position: 'absolute',
                right: 10,
                left: 'unset',
                float: 'right',
                color: 'white',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            >
              close
            </Icon>
          </div>
          <FollowUpList />
        </React.Fragment>
      );
    } else if (this.state.select === 'sendQuote') {
      return (
        <React.Fragment>
          <div
            style={{
              position: 'fixed',
              width: 500,
              height: 60,
              color: 'white',
              textAlign: 'center',
              backgroundColor: '#0767DB',
              zIndex: 2
            }}
          >
            <span
              className="header"
              style={{
                top: '50%',
                position: 'absolute',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                fontSize: 18
              }}
            >
              Send Quote
            </span>
            <Icon
              onClick={() => this.closeDrawer(side, false)}
              style={{
                position: 'absolute',
                right: 10,
                left: 'unset',
                float: 'right',
                color: 'white',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            >
              close
            </Icon>
          </div>
          <Quote />
        </React.Fragment>
      );
    } else if (this.state.select === 'viewDetails') {
      return (
        <React.Fragment>
          <div
            style={{
              position: 'fixed',
              width: 500,
              height: 60,
              color: 'white',
              textAlign: 'center',
              backgroundColor: '#0767DB',
              zIndex: 2
            }}
          >
            <span
              className="header"
              style={{
                top: '50%',
                position: 'absolute',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                fontSize: 18
              }}
            >
              Lead Details
            </span>
            <Icon
              onClick={() => this.closeDrawer(side, false)}
              style={{
                position: 'absolute',
                right: 10,
                left: 'unset',
                float: 'right',
                color: 'white',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            >
              close
            </Icon>
          </div>
          <LeadDetail />
        </React.Fragment>
      );
    }
  };

  toggleDrawer = (e, side, open, user) => {
    // if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    //   return;
    // }
    if (open) {
      localStorage.setItem('productDetails', JSON.stringify(user));
      localStorage.setItem('followLeadId', user._id);
    }
    this.setState({
      [side]: open,
      select: e.currentTarget.getAttribute('value')
    });
  };

  closeDrawer = (side, open) => {
    // document.querySelector('.MuiDrawer-root').remove();
    this.setState({ [side]: open });
  };

  dropClassified = () => {
    Object.keys(this.state).map((val, i) => {
      if (i && typeof this.state[val] === 'object') {
        this.id2List[val] = val;
      }
    });
  };
  getList = id => this.state[this.id2List[id]];

  onDragEnd = result => {
    const { source, destination } = result;
    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );
      this.setState({ [destination.droppableId]: items });
    } else {
      const results = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );
      Object.keys(results).map(val => {
        this.setState({ [val]: results[val] });
      });
      const data = this.state.blank.filter(val => {
        if (val._id === result.draggableId) {
          return val;
        }
      });
      data[0].status = destination.droppableId;
      let type = data[0].mobileno ? 'mobileno' : 'name';
      axios
        .post(`${apiUrl}api/update`, {
          [type]: data[0][type],
          userId: data[0].id,
          leadId: data[0]._id,
          data: data[0]
        })
        .then(res => {
          if (res.data.status === 1) {
            console.log(res.data);
            alert('Lead updated successfully');
          }
        });
    }
  };

  componentDidMount() {
    const params = JSON.parse(localStorage.getItem('userData')).typeofUser
      ? 'assignedUser'
      : 'userId';
    this.dropClassified();
    this.call(Object.keys(this.id2List)[0], 0, params);
  }

  call = (value, count, params) => {
    axios
      .post(`${apiUrl}api/getMailsBy`, {
        [params]: JSON.parse(localStorage.getItem('userData'))._id,
        status: value
      })
      .then(res => {
        if (res.data.status === 1) {
          count++;
          let blank = this.state.blank;
          res.data.data.forEach(data => {
            blank.push(data);
          });
          this.setState({ [value]: res.data.data, blank });
          if (count < Object.keys(this.id2List).length) {
            this.call(Object.keys(this.id2List)[count], count, params);
          } else {
            this.setState({ loading: false });
          }
        }
      });
  };

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    const { classes } = this.props;
    return (
      <DashboardLayout title="PipeLine">
        {this.state.blank ? (
          !this.state.loading ? (
            <div
              style={{
                display: 'absolute',
                width: '100%',
                minHeight: '100vh',
                backgroundColor: 'white'
              }}
            >
              <div
                className="pipelineTop"
                style={{
                  display: 'flex',
                  width: 'calc(-230px + 100%)',
                  zIndex: 2,
                  position: 'fixed'
                }}
              >
                {Object.keys(this.id2List).map((val, i) => {
                  return (
                    <div
                      keys={val + i}
                      style={{
                        width: '25%',
                        backgroundColor: color[i],
                        padding: 8,
                        border: '1px solid rgba(192,192,192,1)',
                        color: 'white'
                      }}
                    >
                      <div
                        style={{
                          position: 'relative',
                          top: '50%',
                          transform: 'translateY(-50%)'
                        }}
                      >
                        {val} Leads
                      </div>
                    </div>
                  );
                })}
              </div>
              <div
                className="pipelineTop"
                style={{
                  display: 'flex',
                  width: 'calc(-230px + 100%)',
                  position: 'fixed',
                  zIndex: 2,
                  top: 96
                }}
              >
                {Object.keys(this.id2List).map((val, i) => {
                  let amount = 0;
                  this.state[val].map(val => {
                    amount += val.deal;
                  });
                  return (
                    <div
                      key={'amount' + val}
                      style={{
                        width: '25%',
                        backgroundColor: color[i],
                        padding: 8,
                        border: '1px solid rgba(192,192,192,1)',
                        color: 'white'
                      }}
                    >
                      <div
                        style={{
                          position: 'relative',
                          top: '50%',
                          transform: 'translateY(-50%)'
                        }}
                      >
                        <Row style={{ margin: 0 }}>
                          <Col
                            style={{
                              wordWrap: 'break-word',
                              padding: 0,
                              flex: '0 0 104px',
                              maxWidth: 104
                            }}
                            xs="6"
                          >
                            Total Amount:{' '}
                          </Col>
                          <Col
                            style={{ wordWrap: 'break-word', padding: 0 }}
                            xs="6"
                          >
                            ₹ {amount}
                          </Col>
                        </Row>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  paddingTop: 82,
                  minHeight: '100vh'
                }}
              >
                <DragDropContext onDragEnd={this.onDragEnd}>
                  {Object.keys(this.id2List).map((val, i) => {
                    return (
                      <Droppable
                        droppableId={val}
                        key={val + i}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver, i)}
                          >
                            {this.state[val].map((item, index) => (
                              <Draggable
                                draggableId={item._id}
                                index={index}
                                key={item.name + index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    onClick={e => {
                                      e.stopPropagation();
                                      this.toggleDrawer(e, 'right', true, item);
                                    }}
                                    ref={provided.innerRef}
                                    value="viewDetails"
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={getItemStyle(
                                      snapshot.isDragging,
                                      provided.draggableProps.style
                                    )}
                                  >
                                    <Row
                                      style={{
                                        paddingBottom: 5,
                                        margin: 0,
                                        fontSize: 14
                                      }}
                                    >
                                      <Col
                                        style={{
                                          padding: 0,
                                          maxWidth: 45,
                                          flex: '0 0 45px'
                                        }}
                                        xs="2"
                                      >
                                        Name:{' '}
                                      </Col>
                                      <Col
                                        style={{
                                          wordWrap: 'break-word',
                                          padding: 0
                                        }}
                                        xs="9"
                                      >
                                        {item.name}
                                      </Col>
                                    </Row>
                                    <Row
                                      style={{
                                        paddingBottom: 5,
                                        margin: 0,
                                        fontSize: 14
                                      }}
                                    >
                                      <Col
                                        style={{
                                          padding: 0,
                                          maxWidth: 48,
                                          flex: '0 0 48px'
                                        }}
                                        xs="3"
                                      >
                                        Moble:{' '}
                                      </Col>
                                      <Col
                                        style={{
                                          wordWrap: 'break-word',
                                          padding: 0
                                        }}
                                        xs="8"
                                      >
                                        {item.mobileno ? item.mobileno : ''}
                                      </Col>
                                    </Row>
                                    <Row
                                      style={{
                                        paddingBottom: 5,
                                        margin: 0,
                                        fontSize: 14
                                      }}
                                    >
                                      <Col
                                        style={{
                                          padding: 0,
                                          maxWidth: 52,
                                          flex: '0 0 52px'
                                        }}
                                        xs="3"
                                      >
                                        Source:{' '}
                                      </Col>
                                      <Col
                                        style={{
                                          wordWrap: 'break-word',
                                          padding: 0
                                        }}
                                        xs="8"
                                      >
                                        {item.source ? item.source : 'JustDail'}
                                      </Col>
                                    </Row>
                                    <Row
                                      style={{
                                        paddingBottom: 5,
                                        margin: 0,
                                        fontSize: 14
                                      }}
                                    >
                                      <Col
                                        style={{
                                          wordWrap: 'break-word',
                                          padding: 0,
                                          flex: '0 0 75px',
                                          maxWidth: 75
                                        }}
                                        xs="5"
                                      >
                                        Deal Value:{' '}
                                      </Col>
                                      <Col
                                        style={{
                                          wordWrap: 'break-word',
                                          padding: 0
                                        }}
                                        xs="7"
                                      >
                                        ₹ {item.deal ? item.deal : 0}
                                      </Col>
                                    </Row>
                                    <Row
                                      style={{
                                        paddingBottom: 5,
                                        margin: 0,
                                        fontSize: 14
                                      }}
                                    >
                                      <Col
                                        style={{
                                          padding: 0,
                                          maxWidth: 88,
                                          flex: '0 0 88px'
                                        }}
                                        xs="4"
                                      >
                                        Requirement:{' '}
                                      </Col>
                                      <Col
                                        style={{
                                          wordWrap: 'break-word',
                                          padding: 0
                                        }}
                                        xs="7"
                                      >
                                        {item.requirement
                                          ? item.requirement
                                          : ''}
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col
                                        style={{
                                          padding: 0,
                                          border: '1px solid #DFE3E8'
                                        }}
                                        xs="6"
                                      >
                                        <Button
                                          id={'followup' + item.id}
                                          onClick={e => {
                                            e.stopPropagation();
                                            this.toggleDrawer(
                                              e,
                                              'right',
                                              true,
                                              item
                                            );
                                          }}
                                          style={{
                                            width: '100%',
                                            color: '#0767DB',
                                            background: 'white',
                                            height: '100%',
                                            textAlign: 'center',
                                            border: 'none'
                                          }}
                                          value="followUp"
                                        >
                                          Follow Up
                                        </Button>
                                      </Col>
                                      <Col
                                        style={{
                                          padding: 0,
                                          border: '1px solid #DFE3E8'
                                        }}
                                        xs="6"
                                      >
                                        <Button
                                          disabled={item.quoted}
                                          id={'quoteBtn' + item.id}
                                          onClick={e => {
                                            e.stopPropagation();
                                            this.toggleDrawer(
                                              e,
                                              'right',
                                              true,
                                              item
                                            );
                                          }}
                                          style={{
                                            backgroundColor: item.quoted
                                              ? 'white'
                                              : null,
                                            color: item.quoted ? 'green' : null,
                                            width: '100%',
                                            color: '#0767DB',
                                            background: 'white',
                                            height: '100%',
                                            textAlign: 'center',
                                            border: 'none'
                                          }}
                                          value="sendQuote"
                                        >
                                          {item.quoted
                                            ? 'View Quote'
                                            : 'Send Quote'}
                                        </Button>
                                      </Col>
                                    </Row>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    );
                  })}
                </DragDropContext>
              </div>
              <SwipeableDrawer
                anchor="right"
                onClose={() => this.closeDrawer('right', false)}
                onOpen={e => this.toggleDrawer(e, 'right', true)}
                open={this.state.right}
              >
                {this.sideList('right')}
              </SwipeableDrawer>
            </div>
          ) : (
            <div className={classes.progressWrapper}>
              <CircularProgress />
            </div>
          )
        ) : (
          <div>No lead assigned with status</div>
        )}
      </DashboardLayout>
    );
  }
}

export default withStyles(styles)(PipeLineWeb);
