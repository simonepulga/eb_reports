import utils from "../utils/utils";

export default function fakeAttendee({
  event_id = utils.uniqueID(),
  order_id = utils.uniqueID(),
  person = utils.fakePerson()
}) {
  return {
    team: null,
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
        display: "A$35.00",
        currency: "AUD",
        value: 3500,
        major_value: "35.00"
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
    resource_uri:
      "https://www.eventbriteapi.com/v3/events/54744465169/attendees/1100594112/",
    id: utils.uniqueID(),
    changed: "2019-01-14T03:16:00Z",
    created: "2019-01-14T03:15:59Z",
    quantity: 1,
    variant_id: null,
    profile: {
      first_name: person.first,
      last_name: person.last,
      email: person.email,
      name: person.name,
      addresses: {
        home: {},
        ship: {},
        work: {},
        bill: {},
        fulfillment: {}
      }
    },
    barcodes: [
      {
        status: "unused",
        barcode: "8827853851100594112001",
        created: "2019-01-14T03:16:00Z",
        changed: "2019-01-14T03:16:00Z",
        checkin_type: 0,
        is_printed: false
      }
    ],
    answers: [],
    checked_in: false,
    cancelled: false,
    refunded: false,
    affiliate: null,
    guestlist_id: null,
    invited_by: null,
    status: "Attending",
    ticket_class_name: "Full",
    delivery_method: "electronic",
    event_id: event_id,
    order_id: order_id,
    ticket_class_id: "101745713"
  };
}
