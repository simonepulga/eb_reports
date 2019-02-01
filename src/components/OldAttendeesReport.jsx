import React, { Component } from "react";
import moment from "moment";
import EB from "../interfaces/EventbriteInterface";
import AttendeesCard from "./AttendeesCard";

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
      const series = this.props.series;
      const cardsVisibility = {};
      for (let event of series.events) {
        cardsVisibility[event.id] = false;
      }
      this.setState({ series, cardsVisibility });
    } else if (this.props.standalone) {
      if (this.props.fakedata) {
        const series = EB.getFakeSeries({});
        const cardsVisibility = {};
        for (let event of series.events) {
          cardsVisibility[event.id] = false;
        }
        this.setState({ series, cardsVisibility });
      } else {
        // here we can implement a call to the EB Interface so long as we
        // ensure to have a series id
      }
    }

    // PLAY PEN
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
    if (!this.state.series.events) {
      return <h2>Loading</h2>;
    }
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
          <AttendeesCard
            key={e.id}
            event={e}
            visibility={this.state.cardsVisibility[e.id]}
            toggleVisibility={() => this.toggle(e.id)}
          />
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
