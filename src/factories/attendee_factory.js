import faker from "faker";
import moment from "moment";

export function generateFakeAttendees({
  performances,
  attendees_per_performance
}) {
  let result = [];
  for (let p = 0; p < performances; p++) {
    for (let a = 0; a < attendees_per_performance; a++) {
      result.push(fakeAttendee({ performance_id: p, sales_count: a + 1 }));
    }
  }
  return result;
}

//sales_count is a custom property - we need to add it to the eb response when fetching from the live api
export function fakeAttendee({ performance_id, sales_count }) {
  const patron_name = faker.name.findName();
  const patron_email = faker.internet.email();
  const performance_date = moment()
    .add(performance_id, "days")
    .format("YYYY-MM-DD");

  function uniqueID() {
    return (
      Date.now().toString(36) +
      Math.random()
        .toString(36)
        .substr(2, 5)
    );
  }

  return {
    //sales_count is a custom property - we need to add it to the eb response when fetching from the live api
    sales_count: sales_count,
    costs: {
      base_price: {
        display: "A$0.00",
        currency: "AUD",
        value: 0,
        major_value: "0.00"
      },
      eventbrite_fee: {
        display: "A$0.00",
        currency: "AUD",
        value: 0,
        major_value: "0.00"
      },
      gross: {
        display: "A$0.00",
        currency: "AUD",
        value: 0,
        major_value: "0.00"
      },
      payment_fee: {
        display: "A$0.00",
        currency: "AUD",
        value: 0,
        major_value: "0.00"
      },
      tax: {
        display: "A$0.00",
        currency: "AUD",
        value: 0,
        major_value: "0.00"
      }
    },
    id: uniqueID(),
    changed: "2019-01-14T01:52:15Z",
    created: "2019-01-14T01:18:35Z",
    profile: {
      first_name: "Producer",
      last_name: "Guest",
      email: patron_email,
      name: patron_name
    },
    barcodes: [
      {
        status: "unused",
        barcode: "8827555271100556151002",
        created: "2019-01-14T01:18:35Z",
        changed: "2019-01-14T01:52:15Z",
        checkin_type: 0,
        is_printed: false
      }
    ],
    checked_in: false,
    cancelled: false,
    refunded: false,
    affiliate: null,
    guestlist_id: null,
    invited_by: null,
    status: "Attending",
    ticket_class_name: "Comp",
    event: {
      name: {
        text: "The Super Secret Test Show",
        html: "The Super Secret Test Show"
      },
      id: performance_id,
      start: {
        timezone: "Australia/Melbourne",
        local: `${performance_date}T19:00:00`
      },
      created: "2019-01-11T03:58:45Z",
      changed: "2019-01-17T00:13:47Z",
      capacity: 76,
      status: "live",
      currency: "AUD"
    },
    order: {
      costs: {
        base_price: {
          display: "A$0.00",
          currency: "AUD",
          value: 0,
          major_value: "0.00"
        },
        eventbrite_fee: {
          display: "A$0.00",
          currency: "AUD",
          value: 0,
          major_value: "0.00"
        },
        gross: {
          display: "A$0.00",
          currency: "AUD",
          value: 0,
          major_value: "0.00"
        },
        payment_fee: {
          display: "A$0.00",
          currency: "AUD",
          value: 0,
          major_value: "0.00"
        },
        tax: {
          display: "A$0.00",
          currency: "AUD",
          value: 0,
          major_value: "0.00"
        }
      },
      resource_uri: "https://www.eventbriteapi.com/v3/orders/882755527/",
      id: "882755527",
      name: patron_name,
      email: patron_email,
      status: "placed"
    }
  };
}
