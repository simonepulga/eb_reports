import moment from "moment";

export default class filters {
  soldDate(program, sold_date_filter) {
    console.log("filters/filter.soldDate() Called");
    for (let series of program) {
      for (let event of series) {
        event.attendees.filter(a => {
          if (
            (sold_date_filter.from
              ? // returns millisecs from epoch in UTC
                moment(a.created).valueOf() >=
                // must provide this as millisecs from epoch in UTC
                sold_date_filter.from
              : true) &&
            (sold_date_filter.to
              ? // returns millisecs from epoch in UTC
                moment(a.created).valueOf() <
                // must provide this as millisecs from epoch in UTC
                sold_date_filter.to
              : true)
          )
            return true;
        });
      }
      // Remove events with no attendees (we are still in the "series of program" loop)
      series.events = series.events.filter(e => e.attendees.length > 0);
    }
    // Remove serieses with no events (we are out of the loop)
    program = program.filter(s => s.events.length > 0);
    // events = events.filter(e => e.attendees.length > 0);
    // Attach all (filtered) attendees to their events
    // for (let event of events) {
    //   event.attendees = attendees.filter(a => a.event_id === event.id);
    // }
    //
    // for (let series of program) {
    //   series.events = events.filter(e => e.series_id === series.id);
    // }
    return program;
  }
}
