import React, { Component } from "react";
import EB from "../interfaces/EventbriteInterface";
import AttendeesReport from "./AttendeesReport";
import { Collapse } from "reactstrap";
import { cloneDeep } from "lodash";
import filters from "../filters/filters";

class PresenterReport extends Component {
  state = {
    program: [], // a program is an array of series objects
    apiResponse: [], // the original API response
    cardsVisibility: {}
  };

  componentDidMount() {
    // console.log("component DID MOUNT!");
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
          cardsVisibility[series.id] = {};
          cardsVisibility[series.id].children = {};
          cardsVisibility[series.id].self = false;
          for (let event of series.events) {
            cardsVisibility[series.id].children[event.id] = false;
          }
        }
        this.setState({
          program,
          apiResponse: cloneDeep(program),
          cardsVisibility
        });
      });
    } else {
      EB.getRealProgram().then(response => {
        const program = response;
        const cardsVisibility = {};
        if (!program) return true;
        for (let series of program) {
          cardsVisibility[series.id] = {};
          cardsVisibility[series.id].children = {};
          cardsVisibility[series.id].self = false;
          for (let event of series.events) {
            cardsVisibility[series.id].children[event.id] = false;
          }
        }
        this.setState({
          program,
          apiResponse: cloneDeep(program),
          cardsVisibility
        });
      });
    }
  }

  toggle(series_id) {
    let cardsVisibility = cloneDeep(this.state.cardsVisibility);
    cardsVisibility[series_id].self = !cardsVisibility[series_id].self;
    this.setState({ cardsVisibility });
  }

  toggleChild(series_id, event_id) {
    let cardsVisibility = cloneDeep(this.state.cardsVisibility);
    cardsVisibility[series_id].children[event_id] = !cardsVisibility[series_id]
      .children[event_id];
    this.setState({ cardsVisibility });
  }

  expandAll() {
    let cardsVisibility = cloneDeep(this.state.cardsVisibility);
    for (let key in cardsVisibility) {
      cardsVisibility[key].self = true;
    }
    this.setState({ cardsVisibility });
  }

  expandAllChildren(series_id) {
    let cardsVisibility = cloneDeep(this.state.cardsVisibility);
    for (let key in cardsVisibility[series_id].children) {
      cardsVisibility[series_id].children[key] = true;
    }
    this.setState({ cardsVisibility });
  }

  collapseAll() {
    let cardsVisibility = cloneDeep(this.state.cardsVisibility);
    for (let key in cardsVisibility) {
      cardsVisibility[key].self = false;
    }
    this.setState({ cardsVisibility });
  }

  collapseAllChildren(series_id) {
    let cardsVisibility = cloneDeep(this.state.cardsVisibility);
    for (let key in cardsVisibility[series_id].children) {
      cardsVisibility[series_id].children[key] = false;
    }
    this.setState({ cardsVisibility });
  }

  totalCapacity() {
    let total = 0;
    if (!this.state.program) return 0;
    for (let s of this.state.apiResponse) {
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

  unfilter() {
    this.setState({
      program: this.state.apiResponse
    });
  }

  filterByDateSold() {
    const from = "2019-01-29";
    const to = "2019-01-30";
    const result = filters.soldDate(
      cloneDeep(this.state.apiResponse),
      {
        from,
        to
      },
      this.state
    );
    this.setState({
      program: result
    });
  }

  render() {
    // console.log(this.state);
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
        <button
          className="btn btn-outline-secondary"
          onClick={() => this.filterByDateSold()}
        >
          Filter
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={() => this.unfilter()}
        >
          Unfilter
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
            <Collapse isOpen={this.state.cardsVisibility[s.id].self}>
              <div className="card-body">
                <AttendeesReport
                  series={s}
                  toggle={(a, b) => this.toggleChild(a, b)}
                  cardsVisibility={this.state.cardsVisibility[s.id]}
                  handleExpandAll={() => this.expandAllChildren(s.id)}
                  handleCollapseAll={() => this.collapseAllChildren(s.id)}
                />
              </div>
            </Collapse>
          </div>
        ))}
      </div>
    );
  }
}

export default PresenterReport;
