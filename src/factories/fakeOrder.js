import utils from "../utils/utils";

export default function fakeOrder({
  order_id = utils.uniqueID(),
  event_id = utils.uniqueID(),
  person = utils.fakePerson()
}) {
  return {
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
    resource_uri: "https://www.eventbriteapi.com/v3/orders/882785385/",
    id: order_id,
    changed: "2019-01-14T03:16:00Z",
    created: "2019-01-14T03:15:59Z",
    name: person.name,
    first_name: person.first,
    last_name: person.last,
    email: person.email,
    status: "placed",
    time_remaining: null,
    event_id: event_id
  };
}
