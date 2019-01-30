import React, { Component } from "react";
import moment from "moment";

class AttendeesCardHeader extends Component {
  render() {
    const e = this.props.event;
    return (
      <div className="card-header cursor-pointer">
        <div className="row">
          <div className="col-9">
            {moment(e.start.local).format("ddd D MMM YYYY - h:mma")}
          </div>
          <div className="col-3 text-right">
            <span className="d-none d-sm-inline">Total</span>{" "}
            {e.attendees.length} / {e.capacity}
          </div>
        </div>
      </div>
    );
  }
}

export default AttendeesCardHeader;
