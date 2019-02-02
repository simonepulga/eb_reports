import React, { Component } from "react";
import moment from "moment";

class AttendeesTableBody extends Component {
  dealWIthDate(date) {
    return (
      <React.Fragment>
        {moment
          .utc(date)
          .local()
          .format("DD/MM/YY")}{" "}
        <span className="d-block d-sm-inline">
          {moment
            .utc(date)
            .local()
            .format("h:mm A")}
        </span>
      </React.Fragment>
    );
    // return moment(date).format("DD/MM/YY h:MM A");
  }

  render() {
    const e = this.props.event;
    return (
      <table className="table table-bordered table-sm basic-attendee-table">
        <tbody>
          {e.attendees.map((a, b) => (
            <tr key={a.id}>
              <td className="number">{++b}</td>
              <td className="name">{a.profile.name}</td>
              <td className="date">{this.dealWIthDate(a.created)}</td>
              <td className="type">{a.ticket_class_name}</td>
              <td className="price">{a.costs.gross.display}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default AttendeesTableBody;
