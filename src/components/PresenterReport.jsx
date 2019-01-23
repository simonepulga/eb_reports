import React, { Component } from "react";
import EB from "../interfaces/EventbriteInterface";
import AttendeesReport from "./AttendeesReport";
import { Collapse } from "reactstrap";

class PresenterReport extends Component {
  state = {
    program: {},
    cardsVisibility: {}
  };

  componentDidMount() {
    this.setState(
      {
        program: EB.getFakeProgram({
          serieses_count: 2,
          events_per_series: 14,
          attendees_per_event: [5, 10]
        })
      },
      () => {
        const cardsVisibility = {};
        for (let series of this.state.program.serieses) {
          cardsVisibility[series.id] = false;
        }
        this.setState({ cardsVisibility });
      }
    );
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

  render() {
    console.log(this.state);
    if (!this.state.program.serieses) return <h2>Loading</h2>;
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
        {this.state.program.serieses.map(s => (
          <div className="card" key={s.id}>
            <div className="card-header" onClick={() => this.toggle(s.id)}>
              <div className="row">
                <div className="col-8">
                  <strong>{s.name.text}</strong>
                </div>
                <div className="col-4">Total: xxxx / xxxx</div>
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
