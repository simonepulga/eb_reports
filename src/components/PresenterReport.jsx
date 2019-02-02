import React, { Component } from "react";
import EB from "../interfaces/EventbriteInterface";
import AttendeesReport from "./AttendeesReport";
import { Collapse } from "reactstrap";
import _ from "lodash";
import filters from "../filters/filters";

class PresenterReport extends Component {
  state = {
    program: [], // a program is an array of series objects
    apiResponse: [], // the original API response
    cardsVisibility: {},
    isLoading: true,
    isFiltered: false,
    filters: {
      selected: "All Shows",
      saleDate: {
        filterDateFrom: "",
        filterDateTo: ""
      }
    }
  };

  componentDidMount() {
    // console.log("component DID MOUNT!");
    if (this.props.fakedata) {
      EB.getFakeProgram({
        serieses_count: 4,
        events_per_series: 6,
        attendees_per_event: [5, 10], // a min max range
        delay: 0 // a delay to simulate an API response, in seconds
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
          apiResponse: _.cloneDeep(program),
          cardsVisibility,
          isLoading: false
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
          apiResponse: _.cloneDeep(program),
          cardsVisibility,
          isLoading: false
        });
      });
    }
  }

  toggle(series_id) {
    let cardsVisibility = _.cloneDeep(this.state.cardsVisibility);
    cardsVisibility[series_id].self = !cardsVisibility[series_id].self;
    this.setState({ cardsVisibility });
  }

  toggleChild(series_id, event_id) {
    let cardsVisibility = _.cloneDeep(this.state.cardsVisibility);
    cardsVisibility[series_id].children[event_id] = !cardsVisibility[series_id]
      .children[event_id];
    this.setState({ cardsVisibility });
  }

  expandAll() {
    let cardsVisibility = _.cloneDeep(this.state.cardsVisibility);
    for (let key in cardsVisibility) {
      cardsVisibility[key].self = true;
    }
    this.setState({ cardsVisibility });
  }

  expandAllChildren(series_id) {
    let cardsVisibility = _.cloneDeep(this.state.cardsVisibility);
    for (let key in cardsVisibility[series_id].children) {
      cardsVisibility[series_id].children[key] = true;
    }
    this.setState({ cardsVisibility });
  }

  collapseAll() {
    let cardsVisibility = _.cloneDeep(this.state.cardsVisibility);
    for (let key in cardsVisibility) {
      cardsVisibility[key].self = false;
    }
    this.setState({ cardsVisibility });
  }

  collapseAllChildren(series_id) {
    let cardsVisibility = _.cloneDeep(this.state.cardsVisibility);
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
    const origSeries = this.state.apiResponse.filter(
      s => s.id === series.id
    )[0];
    let total = 0;
    if (!origSeries.events) return 0;
    for (let e of origSeries.events) {
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
      program: this.state.apiResponse,
      isFiltered: false,
      filters: {
        selected: "All Shows",
        saleDate: { filterDateFrom: "", filterDateTo: "" }
      }
    });
  }

  filterByDateSold() {
    // console.log(this.state.filters.saleDate.filterDateFrom);
    const {
      filterDateFrom: from,
      filterDateTo: to
    } = this.state.filters.saleDate;
    const result = filters.soldDate(
      _.cloneDeep(this.state.apiResponse),
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

  handleDateFilterChange(event) {
    this.setState({
      filters: {
        ...this.state.filters,
        saleDate: {
          ...this.state.filters.saleDate,
          [event.target.name]: event.target.value
        }
      }
    });
  }

  handleClearSalesDate = () => {
    this.setState({
      filters: {
        ...this.state.filters,
        saleDate: { filterDateFrom: "", filterDateTo: "" }
      }
    });
  };

  handleSelectChange = event => {
    this.setState({
      filters: {
        ...this.state.filters,
        selected: event.target.value
      }
    });
  };

  handleSetSelectToAll = () => {
    this.setState({
      filters: {
        ...this.state.filters,
        selected: "All Shows"
      }
    });
  };

  renderHeader() {
    return (
      <React.Fragment>
        <div className="row">
          <header className="col-12 mt-4">
            <h2>Presenter Report</h2>
            <h4>Until AI finally emerges, we do it by hand like peasants.</h4>
          </header>
        </div>
      </React.Fragment>
    );
  }

  renderFilters() {
    return (
      <React.Fragment>
        <hr />
        <div className="row">
          <div className="form-inline align-items-center col-12">
            <div className="col-sm-2">
              <strong>Production</strong>
            </div>
            <div className="input-group col-sm-6">
              <select
                value={this.state.filters.selected}
                onChange={this.handleSelectChange}
                className="custom-select"
              >
                <option key="#" value="All Shows">
                  All Shows
                </option>
                {_.sortBy(this.state.apiResponse, [s => s.name.text]).map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name.text}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-sm-4 pr-auto pr-sm-0">
              <button
                className="btn mt-3 mt-sm-auto mr-3 mr-sm-0 mb-0 btn-outline-secondary float-right"
                onClick={this.handleSetSelectToAll}
              >
                Set to "all"
              </button>
            </div>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="form-inline align-items-center col-12">
            <div className="col-sm-2">
              <strong>Sales Date</strong>
            </div>
            <div className="input-group col-sm-3">
              <label className="col-2">From: </label>
              <div className="col-10">
                <input
                  type="date"
                  name="filterDateFrom"
                  value={this.state.filters.saleDate.filterDateFrom}
                  onChange={this.handleDateFilterChange.bind(this)}
                  placeholder="placeholder"
                  className="form-control"
                />
              </div>
            </div>
            <div className="input-group col-sm-3">
              <label className="col-2">To: </label>
              <div className="col-10">
                <input
                  type="date"
                  name="filterDateTo"
                  value={this.state.filters.saleDate.filterDateTo}
                  onChange={this.handleDateFilterChange.bind(this)}
                  placeholder="placeholder"
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-sm-4 pr-auto pr-sm-0">
              <button
                className="btn mt-3 mt-sm-auto mr-3 mr-sm-0 mb-0 btn-outline-secondary float-right"
                onClick={this.handleClearSalesDate}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-sm-6">
            <button
              className="btn mb-0 btn-outline-secondary"
              onClick={() => this.filterByDateSold()}
            >
              Filter
            </button>
            <button
              className="btn mb-0 btn-outline-secondary"
              onClick={() => this.unfilter()}
            >
              Unfilter
            </button>
          </div>
          <div className="col-sm-6 mt-3 mt-sm-0">
            <div className="float-none float-sm-right">
              <button
                className="btn mb-0 btn-outline-secondary"
                onClick={() => this.expandAll()}
              >
                Expand all
              </button>
              <button
                className="btn mb-0 mr-auto mr-sm-0 btn-outline-secondary"
                onClick={() => this.collapseAll()}
              >
                Collapse all
              </button>
            </div>
          </div>
        </div>
        <hr />
      </React.Fragment>
    );
  }

  renderBody() {
    if (this.state.program.length === 0) {
      return (
        <div className="container" style={{ height: "100vh" }}>
          <h2 style={{ textAlign: "center" }}>No results</h2>
          <p style={{ textAlign: "center" }}>Please try different filters</p>
        </div>
      );
    } else {
      return (
        <React.Fragment>
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
        </React.Fragment>
      );
    }
  }

  render() {
    console.log(this.state);
    if (this.state.isLoading) {
      return (
        <div className="container" style={{ height: "100vh" }}>
          <h2 style={{ textAlign: "center", lineHeight: "100vh" }}>Loading</h2>
        </div>
      );
    }

    return (
      <div className="PresenterReport container">
        {this.renderHeader()}
        {this.renderFilters()}
        {this.renderBody()}
      </div>
    );
  }
}

export default PresenterReport;
