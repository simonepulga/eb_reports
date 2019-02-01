import React, { Component } from "react";
import moment from "moment";
import EB from "../interfaces/EventbriteInterface";
import AttendeesCard from "./AttendeesCard";

class AttendeesReport extends Component {
  // toggle(event_id) {
  //   let cardsVisibility = { ...this.state.cardsVisibility };
  //   cardsVisibility[event_id] = !cardsVisibility[event_id];
  //   this.setState({ cardsVisibility });
  // }

  // expandAll() {
  //   let cardsVisibility = { ...this.state.cardsVisibility };
  //   for (let key in cardsVisibility) {
  //     cardsVisibility[key] = true;
  //   }
  //   this.setState({ cardsVisibility });
  // }

  // collapseAll() {
  //   let cardsVisibility = { ...this.state.cardsVisibility };
  //   for (let key in cardsVisibility) {
  //     cardsVisibility[key] = false;
  //   }
  //   this.setState({ cardsVisibility });
  // }

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
    return (
      <div className="AttendeesReport container">
        <button
          className="btn btn-outline-secondary"
          onClick={this.props.handleExpandAll}
        >
          Expand all
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={this.props.handleCollapseAll}
        >
          Collapse all
        </button>

        {this.props.series.events.map(e => (
          <AttendeesCard
            key={e.id}
            event={e}
            visibility={this.props.cardsVisibility.children[e.id]} // mmmmaybe.
            toggleVisibility={() =>
              this.props.toggle(this.props.series.id, e.id)
            }
          />
        ))}
      </div>
    );
  }
}

export default AttendeesReport;
