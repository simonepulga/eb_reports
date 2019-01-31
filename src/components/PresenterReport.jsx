import React, { Component } from "react";
import EB from "../interfaces/EventbriteInterface";
import AttendeesReport from "./AttendeesReport";
import { Collapse } from "reactstrap";
import moment from "moment";

class PresenterReport extends Component {
  state = {
    program: [], // a program is an array of series objects
    cardsVisibility: {}
  };

  componentDidMount() {
    if (this.props.fakedata) {
      EB.getFakeProgram({
        serieses_count: 4,
        events_per_series: 6,
        attendees_per_event: [5, 10], // a min max range
        delay: 1 // a delay to simulate an API response, in seconds
      }).then(response => {
        const program = response;
        const cardsVisibility = {};
        if (!program) return true;
        for (let series of program) {
          cardsVisibility[series.id] = false;
        }
        this.setState({
          program,
          cardsVisibility
        });
      });
    } else {
      EB.getRealProgram({
        sold_date_filter: {
          from: moment("2019-01-30T00:00:00+10:00").valueOf(),
          to: moment("2019-01-31T00:00:00+10:00").valueOf()
        }
      }).then(response => {
        const program = response;
        const cardsVisibility = {};
        if (!program) return true;
        for (let series of program) {
          cardsVisibility[series.id] = false;
        }
        this.setState({
          program,
          cardsVisibility
        });
      });
    }
  }

  toggle(series_id) {
    let cardsVisibility = { ...this.state.cardsVisibility };
    cardsVisibility[series_id] = !cardsVisibility[series_id];
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
    if (!this.state.program) return 0;
    for (let s of this.state.program) {
      if (s.events) {
        for (let e of s.events) {
          total += e.capacity;
        }
      }
    }
    return total;
  }

  totalSeriesCapacity(series) {
    let total = 0;
    if (!series.events) return 0;
    for (let e of series.events) {
      total += e.capacity;
    }
    return total;
  }

  totalAttendees() {
    let total = 0;
    if (!this.state.program) return 0;
    for (let s of this.state.program) {
      if (s.events) {
        for (let e of s.events) {
          if (e.attendees) {
            total += e.attendees.length;
          }
        }
      }
    }
    return total;
  }

  totalSeriesAttendees(series) {
    let total = 0;
    if (!series.events) return 0;
    for (let e of series.events) {
      if (e.attendees) {
        total += e.attendees.length;
      }
    }
    return total;
  }

  render() {
    if (this.state.program.length === 0) {
      return (
        <div className="container" style={{ height: "100vh" }}>
          <h2 style={{ textAlign: "center", lineHeight: "100vh" }}>Loading</h2>
        </div>
      );
    }

    return (
      <div className="PresenterReport container">
        <header>
          <h2>Presenter Report</h2>
          <h4>This is where the business happens.</h4>
        </header>
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
        {this.state.program.map(s => (
          <div className="card" key={s.id}>
            <div
              className="card-header cursor-pointer"
              onClick={() => this.toggle(s.id)}
            >
              <div className="row">
                <div className="col-8">
                  <h5 className="series-header">{s.name.text}</h5>
                </div>
                <div className="col-4 text-right">
                  Total: {this.totalSeriesAttendees(s)} /{" "}
                  {this.totalSeriesCapacity(s)}
                </div>
              </div>
            </div>
            <Collapse isOpen={this.state.cardsVisibility[s.id]}>
              <div className="card-body">
                <AttendeesReport series={s} />
              </div>
            </Collapse>
          </div>
        ))}
      </div>
    );
  }
}

export default PresenterReport;
