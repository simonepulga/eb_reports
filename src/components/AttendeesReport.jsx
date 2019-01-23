import React, { Component } from "react";
import moment from "moment";
import { Collapse } from "reactstrap";
import { StickyContainer, Sticky } from "react-sticky";
import EB from "../interfaces/EventbriteInterface";

class AttendeesReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // standalone: this.props.standalone,
      event_id: 0,
      series: {},
      cardsVisibility: {}
    };
  }
  componentDidMount() {
    // // we fetch an event which may be a series, or not
    // const maybeSeriesOrEvent = getMaybeSeriesOrEvent(this.state.event_id);
    // // we determine what events we need attendees for.
    // const events = getEventsIDs(maybeSeriesOrEvent);
    // // we pull the attendees from all events
    // // PS the setTimeout is only here to SIMULATE response lag
    // setTimeout(() => this.setState({ attendees: getAttendees(events) }), 2000);
    if (this.props.series) {
      console.log("THIS.PROPS.SERIES");
      this.setState({ series: this.props.series }, () => {
        const cardsVisibility = {};
        for (let event of this.state.series.events) {
          cardsVisibility[event.id] = false;
        }
        this.setState({ cardsVisibility });
      });
    } else {
      console.log("CANNOT DETECT this.props.series");
      console.log(this.props);
      this.setState({ series: EB.getFakeSeries({}) }, () => {
        const cardsVisibility = {};
        for (let event of this.state.series.events) {
          cardsVisibility[event.id] = false;
        }
        this.setState({ cardsVisibility });
      });
    }

    // PLAY PEN
  }

  dealWIthDate(date) {
    return (
      <React.Fragment>
        {moment(date).format("DD/MM/YY")}{" "}
        <span className="d-block d-sm-inline">
          {moment(date).format("h:MM A")}
        </span>
      </React.Fragment>
    );
    // return moment(date).format("DD/MM/YY h:MM A");
  }

  toggle(event_id) {
    let cardsVisibility = { ...this.state.cardsVisibility };
    cardsVisibility[event_id] = !cardsVisibility[event_id];
    this.setState({ cardsVisibility });
  }

  expandAll() {
    let cardsVisibility = { ...this.state.cardsVisibility };
    for (let key in cardsVisibility) {
      cardsVisibility[key] = true;
    }
    this.setState({ cardsVisibility });
  }

  collapseAll() {
    let cardsVisibility = { ...this.state.cardsVisibility };
    for (let key in cardsVisibility) {
      cardsVisibility[key] = false;
    }
    this.setState({ cardsVisibility });
  }

  totalCapacity() {
    let total = 0;
    if (!this.state.series.events) return 0;
    for (let e of this.state.series.events) {
      total += e.capacity;
    }
    return total;
  }

  totalAttendees() {
    let total = 0;
    if (!this.state.series.events) return 0;
    for (let event of this.state.series.events) {
      if (event.attendees) {
        // eslint-disable-next-line
        event.attendees.forEach(() => {
          total += 1;
        });
      }
    }
    return total;
  }

  totalCollected() {
    let total = 0;
    if (!this.state.series.events) return 0;
    for (let event of this.state.series.events) {
      if (event.attendees) {
        for (let a of event.attendees) {
          total += a.costs.gross.noic;
        }
      }
    }
    return (total / 100).toLocaleString("en-AU", {
      style: "currency",
      currency: "AUD"
    });
  }

  render() {
    // console.log(this.state);
    if (!this.state.series.events) return <h2>Loading</h2>;
    return (
      <div className="AttendeesReport container">
        {this.props.standalone ? (
          <header>
            <h2>Attendees report</h2>
            <h4>{this.state.series.name.text}</h4>
          </header>
        ) : null}
        <button
          className="btn btn-outline-secondary"
          onClick={() => this.expandAll()}
        >
          Expand all
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={() => this.collapseAll()}
        >
          Collapse all
        </button>
        {this.props.standalone ? (
          <p>
            <em>Click on any performance to expand it:</em>
            <br />
            <small>
              <em>* All prices are net of inside charges.</em>
            </small>
          </p>
        ) : null}

        {this.state.series.events.map(e => (
          <StickyContainer key={e.id}>
            <div className="card">
              <Sticky>
                {({ style }) => (
                  <div style={style}>
                    <div
                      className="card-header cursor-pointer"
                      onClick={() => this.toggle(e.id)}
                    >
                      <div className="row">
                        <div className="col-9">
                          {moment(e.start.local).format(
                            "ddd D MMM YYYY - h:mma"
                          )}
                        </div>
                        <div className="col-3 text-right">
                          <span className="d-none d-sm-inline">Total</span>{" "}
                          {e.attendees.length} / {e.capacity}
                        </div>
                      </div>
                    </div>
                    <Collapse isOpen={this.state.cardsVisibility[e.id]}>
                      <table className="table table-bordered table-sm basic-attendee-table convenience-table">
                        <thead className="card-table-head">
                          <tr>
                            <th className="number">#</th>
                            <th className="name">Name</th>
                            <th className="date">
                              <span className="d-none d sm-inline">Date</span>{" "}
                              Booked
                            </th>
                            <th className="type">Type</th>
                            <th className="price">Price*</th>
                          </tr>
                        </thead>
                      </table>
                    </Collapse>
                  </div>
                )}
              </Sticky>
              <Collapse isOpen={this.state.cardsVisibility[e.id]}>
                <table className="table table-bordered table-sm basic-attendee-table">
                  <tbody>
                    {e.attendees.map((a, b) => (
                      <tr key={a.id}>
                        <td className="number">{++b}</td>
                        <td className="name">{a.profile.name}</td>
                        <td className="date">
                          {this.dealWIthDate(
                            e.orders.filter(o => o.id === a.order_id)[0].created
                          )}
                        </td>
                        <td className="type">{a.ticket_class_name}</td>
                        <td className="price">{a.costs.gross.noic_display}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Collapse>
            </div>
          </StickyContainer>
        ))}
        {this.props.standalone ? (
          <div className="card totals-card">
            <div className="card-header">
              <div className="row">
                <div className="col-6">
                  Total collected* : {this.totalCollected()}
                </div>
                <div className="col-6 text-right">
                  Total {this.totalAttendees()} / {this.totalCapacity()}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default AttendeesReport;
