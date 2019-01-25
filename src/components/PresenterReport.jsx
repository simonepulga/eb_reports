import React, { Component } from "react";
import EB from "../interfaces/EventbriteInterface";
import AttendeesReport from "./AttendeesReport";
import { Collapse } from "reactstrap";

class PresenterReport extends Component {
  state = {
    program: [], // a program is an array of series objects
    cardsVisibility: {}
  };

  componentDidMount() {
    // console.log(EB.getRealProgram());
    EB.getRealProgram().then(response => {
      this.setState(
        {
          program: response
        },
        () => {
          const cardsVisibility = {};
          if (!this.state.program) return true;
          for (let series of this.state.program) {
            cardsVisibility[series.id] = false;
          }
          this.setState({ cardsVisibility });
        }
      );
    });
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
    console.log(this.state);
    if (!this.state.program) return <h2>Loading</h2>;
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
