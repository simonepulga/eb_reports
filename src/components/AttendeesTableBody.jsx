import React, { Component } from "react";

class AttendeesTableBody extends Component {
  render() {
    const e = this.props.event;
    return (
      <table className="table table-bordered table-sm basic-attendee-table">
        <tbody>
          {e.attendees.map((a, b) => (
            <tr key={a.id}>
              <td className="number">{++b}</td>
              <td className="name">{a.profile.name}</td>
              <td className="date" />
              <td className="type">{a.ticket_class_name}</td>
              <td className="price">{a.costs.gross.noic_display}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default AttendeesTableBody;
