import moment from "moment-timezone";

const filters = {
  bySelection(program, matcher) {
    if (matcher === "All Shows") return program;
    return program.filter(s => s.id === matcher);
  },

  perfDate(program, perf_date_filter) {
    console.log("program before date filter", program);
    if (perf_date_filter.from) {
      console.log("FROM conversion triggered");
      perf_date_filter.from = moment.tz(
        perf_date_filter.from,
        "Australia/Melbourne"
      );
    }
    if (perf_date_filter.to) {
      console.log("TO conversion triggered");

      perf_date_filter.to = moment
        .tz(perf_date_filter.to, "Australia/Melbourne")
        .add(1, "d");
    }

    for (let series of program) {
      series.events = series.events.filter(e => {
        if (
          (perf_date_filter.from
            ? // returns millisecs from epoch in UTC
              moment(e.start.utc).valueOf() >=
              // must provide this as Australia/Melbourne timezone
              perf_date_filter.from.valueOf()
            : true) &&
          (perf_date_filter.to
            ? // returns millisecs from epoch in UTC
              moment(e.start.utc).valueOf() <
              // must provide this as Australia/Melbourne timezone
              perf_date_filter.to.valueOf()
            : true)
        ) {
          return true;
        } else {
          return false;
        }
      });
    }
    console.log("program after date filter", program);

    // Remove serieses with no events (we are out of the loop)
    program = program.filter(s => s.events.length > 0);
    console.log("program before return", program);

    return program;
  },

  soldDate(program, sold_date_filter) {
    // we can expect sold_date_filter values to be in local time,
    // and must convert to UTC for this to work
    if (sold_date_filter.from) {
      console.log("FROM conversion triggered");
      sold_date_filter.from = moment.tz(
        sold_date_filter.from,
        "Australia/Melbourne"
      );
    }
    if (sold_date_filter.to) {
      console.log("TO conversion triggered");

      sold_date_filter.to = moment
        .tz(sold_date_filter.to, "Australia/Melbourne")
        .add(1, "d");
    }

    for (let series of program) {
      for (let event of series.events) {
        event.attendees = event.attendees.filter(a => {
          if (
            (sold_date_filter.from
              ? // returns millisecs from epoch in UTC
                moment(a.created).valueOf() >=
                // must provide this as Australia/Melbourne timezone
                sold_date_filter.from.valueOf()
              : true) &&
            (sold_date_filter.to
              ? // returns millisecs from epoch in UTC
                moment(a.created).valueOf() <
                // must provide this as Australia/Melbourne timezone
                sold_date_filter.to.valueOf()
              : true)
          ) {
            // UNCOMMENT for a verbose explanation of why this attendee belongs in the list
            // console.log(
            //   "I think this attendee belongs in the filtered list: ",
            //   a
            // );
            // console.log("Its .created value is:", a.created);
            // console.log("which converts to:", moment(a.created).valueOf());
            // console.log(
            //   "I think that is greater than the FROM value, which I have as:",
            //   sold_date_filter.from.valueOf()
            // );
            // console.log(
            //   "Further, its .created stamp (again):",
            //   moment(a.created).valueOf()
            // );
            // console.log(
            //   "Which I think is lesser than the TO value, which I have as:",
            //   sold_date_filter.to.valueOf()
            // );
            // console.log("END OF THIS ATTENDEE");
            // --- END UNCOMMENT
            return true;
          } else {
            // UNCOMMENT for a verbose explanation of why this attendee does not belong in the list
            // console.log(
            //   "I DON'T think this attendee belongs in the filtered list: ",
            //   a
            // );
            // console.log("Its .created value is:", a.created);
            // console.log("which converts to:", moment(a.created).valueOf());
            // console.log(
            //   "To fit, that should be greater than the FROM value, which I have as:",
            //   sold_date_filter.from.valueOf()
            // );
            // console.log(
            //   "Further, its .created stamp (again):",
            //   moment(a.created).valueOf()
            // );
            // console.log(
            //   "Should be less than the TO value, which I have as:",
            //   sold_date_filter.to.valueOf()
            // );
            // console.log("END OF THIS ATTENDEE");
            // --- END UNCOMMENT
            return false;
          }
        });
      }
      // Remove events with no attendees (we are still in the "series of program" loop)
      series.events = series.events.filter(e => e.attendees.length > 0);
    }
    // Remove serieses with no events (we are out of the loop)
    program = program.filter(s => s.events.length > 0);

    return program;
  }
};

export default filters;
