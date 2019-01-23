import fakeSeries from "../factories/fakeSeries";
import fakeEvent from "../factories/fakeEvent";
import fakeAttendee from "../factories/fakeAttendee";
import fakeOrder from "../factories/fakeOrder";
import moment from "moment";

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

const EventbriteInterface = {
  getFakeSeries({
    events_count = 6,
    attendees_per_event = [76, 76], // a min max range
    title = "The Default Show"
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
