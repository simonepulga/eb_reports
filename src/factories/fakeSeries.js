import utils from "../utils/utils";

export default function fakeSeries({ title = "The Default Show" }) {
  return {
    name: {
      text: title,
      html: title
    },
    description: {
      text:
        "This event is only used for internal testing by The Butterfly Club.\nIf you are a member of the general public and somehow have ended up on this page, there is nothing useful here for you :-)",
      html:
        "<P>This event is only used for internal testing by The Butterfly Club.</P>\n<P>If you are a member of the general public and somehow have ended up on this page, there is nothing useful here for you :-)</P>"
    },
    id: utils.uniqueID(),
    url:
      "https://www.eventbrite.com.au/e/the-super-secret-test-show-tickets-54744277608",
    start: {
      timezone: "Australia/Melbourne",
      local: "2019-03-11T19:00:00",
      utc: "2019-03-11T08:00:00Z"
    },
    end: {
      timezone: "Australia/Melbourne",
      local: "2019-03-16T20:00:00",
      utc: "2019-03-16T09:00:00Z"
    },
    organization_id: "66599941881",
    created: "2019-01-11T03:48:08Z",
    changed: "2019-01-17T00:13:49Z",
    capacity: 76,
    capacity_is_custom: true,
    status: "live",
    currency: "AUD",
    listed: false,
    shareable: false,
    invite_only: false,
    online_event: false,
    show_remaining: false,
    tx_time_limit: 480,
    hide_start_date: false,
    hide_end_date: false,
    locale: "en_AU",
    is_locked: false,
    privacy_setting: "unlocked",
    is_series: true,
    is_series_parent: true,
    is_reserved_seating: false,
    show_pick_a_seat: false,
    show_seatmap_thumbnail: false,
    show_colors_in_seatmap_thumbnail: false,
    source: "create_2.0",
    is_free: false,
    version: null,
    logo_id: "54969766",
    organizer_id: "18498890086",
    venue_id: "28739449",
    category_id: "105",
    subcategory_id: null,
    format_id: "6",
    resource_uri: "https://www.eventbriteapi.com/v3/series/54744277608/",
    logo: {
      crop_mask: {
        top_left: {
          x: 0,
          y: 0
        },
        width: 2160,
        height: 1080
      },
      original: {
        url:
          "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F54969766%2F66599941881%2F1%2Foriginal.20190111-035100?auto=compress&s=8dccb0a56d384709f05fc9e013e9bd70",
        width: 2160,
        height: 1080
      },
      id: "54969766",
      url:
        "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F54969766%2F66599941881%2F1%2Foriginal.20190111-035100?h=200&w=450&auto=compress&rect=0%2C0%2C2160%2C1080&s=4016c0a6773bd51a8054c8accb91c088",
      aspect_ratio: "2",
      edge_color: "#933363",
      edge_color_set: true
    }
  };
}
