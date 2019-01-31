import fakeSeries from "../factories/fakeSeries";
import fakeEvent from "../factories/fakeEvent";
import fakeAttendee from "../factories/fakeAttendee";
import fakeOrder from "../factories/fakeOrder";
import moment from "moment";
import faker from "faker";
import axios from "axios";
import eventbrite from "eventbrite";
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function addNOICFields(series) {
  const inside_charge = 500;
  if (!series.events) return series;
  for (let i = 0; i < series.events.length; i++) {
    if (series.events[i].attendees && series.events[i].attendees.length > 0) {
      for (let j = 0; j < series.events[i].attendees.length; j++) {
        if (series.events[i].attendees[j].costs.gross.value > 0) {
          series.events[i].attendees[j].costs.gross.noic =
            series.events[i].attendees[j].costs.gross.value - inside_charge;
          series.events[i].attendees[j].costs.gross.noic_display = (
            series.events[i].attendees[j].costs.gross.noic / 100
          ).toLocaleString("en-AU", {
            style: "currency",
            currency: "AUD"
          });
        }
      }
    }
  }
  return series;
}

const sdk = eventbrite({
  baseURL: "https://www.eventbriteapi.com/v3",
  token: process.env.REACT_APP_EB_TOKEN
});

const getAllSerieses = (cont_token, program, resolve, reject) => {
  sdk
    .request(
      `/organizations/${
        process.env.REACT_APP_EB_ORG_ID
      }/events/?status=live&show_series_parent=true${
        cont_token ? "&continuation=" + cont_token : ""
      }`
    )
    .then(response => {
      const retrievedSerieses = program.concat(response.events);
      if (response.pagination.has_more_items) {
        getAllSerieses(
          response.pagination.continuation,
          program,
          resolve,
          reject
        );
      } else {
        resolve(retrievedSerieses);
      }
    })
    .catch(error => {
      console.log(error);
      reject(
        "Something wrong with event serieses. Please refresh the page and try again."
      );
    });
};

const getAllEvents = (cont_token, events, resolve, reject) => {
  sdk
    .request(
      `/organizations/${
        process.env.REACT_APP_EB_ORG_ID
      }/events/?status=live&show_series_parent=false${
        cont_token ? "&continuation=" + cont_token : ""
      }`
    )
    .then(response => {
      const retrievedEvents = events.concat(response.events);
      if (response.pagination.has_more_items) {
        getAllEvents(response.pagination.continuation, events, resolve, reject);
      } else {
        resolve(retrievedEvents);
      }
    })
    .catch(error => {
      console.log(error);
      reject(
        "Something wrong with events. Please refresh the page and try again."
      );
    });
};

const getAllAttendees = (cont_token, attendees, resolve, reject) => {
  sdk
    .request(
      `/organizations/${
        process.env.REACT_APP_EB_ORG_ID
      }/attendees/?status=attending${
        cont_token ? "&continuation=" + cont_token : ""
      }`
    )
    .then(response => {
      const retrievedAttendees = attendees.concat(response.attendees);
      if (response.pagination.has_more_items) {
        getAllAttendees(
          response.pagination.continuation,
          attendees,
          resolve,
          reject
        );
      } else {
        resolve(retrievedAttendees);
      }
    })
    .catch(error => {
      console.log(error);
      reject(
        "Something wrong with attendees. Please refresh the page and try again."
      );
    });
};

const EventbriteInterface = {
  getTest() {
    // sdk
    //   .request(`/organizations/${process.env.REACT_APP_EB_ORG_ID}/events/`)
    //   .then(res => {
    //     console.log("res", res);
    //   });
  },

  async getRealProgram(filters = { sold_date_filter: {} }) {
    try {
      const programPromise = new Promise((resolve, reject) => {
        getAllSerieses(false, [], resolve, reject);
      }).then(response => {
        return response;
      });
      const eventsPromise = new Promise((resolve, reject) => {
        getAllEvents(false, [], resolve, reject);
      }).then(response => {
        return response;
      });
      const attendeesPromise = new Promise((resolve, reject) => {
        getAllAttendees(false, [], resolve, reject);
      }).then(response => {
        return response;
      });
      let [program, events, attendees] = await Promise.all([
        programPromise,
        eventsPromise,
        attendeesPromise
      ]);

      // 👇 We will probs extract this to its own function that takes
      // [program, events, attendees] from above plus a filter and
      // returns a program we can use.

      if (Object.values(filters.sold_date_filter).length > 0) {
        attendees = attendees.filter(a => {
          if (
            (filters.sold_date_filter.from
              ? // returns millisecs from epoch in UTC
                moment(a.created).valueOf() >=
                // must provide this as millisecs from epoch in UTC
                filters.sold_date_filter.from
              : true) &&
            (filters.sold_date_filter.to
              ? // returns millisecs from epoch in UTC
                moment(a.created).valueOf() <
                // must provide this as millisecs from epoch in UTC
                filters.sold_date_filter.to
              : true)
          )
            return true;
        });
      }

      // Attach all (filtered) attendees to their events
      for (let event of events) {
        event.attendees = attendees.filter(a => a.event_id === event.id);
      }
      // Remove events with no attendees
      events = events.filter(e => e.attendees.length > 0);
      //
      for (let series of program) {
        series.events = events.filter(e => e.series_id === series.id);
      }
      program = program.filter(s => s.events.length > 0);

      // KEEP THIS VERSION: it shows performances with 0 sales too.
      // for (let series of program) {
      //   series.events = events.filter(e => e.series_id === series.id);
      //   for (let event of series.events) {
      //     event.attendees = attendees.filter(a => a.event_id === event.id);
      //   }
      // }
      // if(sold_date_filter) {
      //   program.series
      // }
      // 👆
      return program;
    } catch (error) {
      console.log(error);
    }
  },

  async getFakeProgram({
    serieses_count = 4,
    events_per_series = 6,
    attendees_per_event = [5, 10], // a min max range}
    delay = 0 // a delay to simulate an API response, in seconds
  }) {
    let program = [];
    for (let i = 0; i < serieses_count; i++) {
      program.push(
        this.getFakeSeries({
          events_count: events_per_series,
          attendees_per_event
        })
      );
    }
    await new Promise(resolve => setTimeout(resolve, delay * 1000));
    return program;
  },

  getFakeSeries({
    events_count = 6,
    attendees_per_event = [76, 76], // a min max range
    title = faker.commerce.productName()
  }) {
    let series = fakeSeries({ title });
    series.events = [];
    for (let e = 0; e < events_count; e++) {
      let event = fakeEvent({
        title,
        series_id: series.id,
        date: moment()
          .add(e, "days")
          .format("YYYY-MM-DD")
      });
      let attendees_at_this_event = getRandomArbitrary(
        attendees_per_event[0],
        attendees_per_event[1]
      );
      event.attendees = [];
      event.orders = [];
      for (let a = 0; a < attendees_at_this_event; a++) {
        const fakeAtt = fakeAttendee({});
        event.attendees.push(fakeAtt);
        event.orders.push(fakeOrder({ order_id: fakeAtt.order_id }));
      }
      series.events.push(event);
    }
    series = addNOICFields(series);
    return series;
  }
};
export default EventbriteInterface;

export function getMaybeSeriesOrEvent(id) {
  return { is_series_parent: true, is_series: true };
}

export function getAttendees(events) {
  // return generateFakeAttendees({
  //   performances: 3,
  //   attendees_per_performance: 2
  // });
}

export function getEventsIDs(subject) {
  // Case 1: it's a series, so grab all the ids of its children events.
  if (subject.is_series_parent) {
    return getSeriesEvents(subject.id); // returns array of event ids
    // Case 2: it's a child of a series, so we grab the ids of all its parent's children (siblings).
  } else if (subject.is_series && !subject.is_series_parent) {
    return getSeriesEvents(subject.series_id);
    // Case 3: it's just a stand-alone event, we just grab its id.
  } else {
    return [subject.id];
  }
}

function getSeriesEvents(id) {
  return [12345, 54321, 12121, 54545];
}
