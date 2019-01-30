import React from "react";

const AttendeesTableHeader = () => {
  return (
    <table className="table table-bordered table-sm basic-attendee-table convenience-table">
      <thead className="card-table-head">
        <tr>
          <th className="number">#</th>
          <th className="name">Name</th>
          <th className="date">
            <span className="d-none d sm-inline">Date</span> Booked
          </th>
          <th className="type">Type</th>
          <th className="price">Price*</th>
        </tr>
      </thead>
    </table>
  );
};

export default AttendeesTableHeader;
