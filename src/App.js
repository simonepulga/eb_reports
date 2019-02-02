import React, { Component } from "react";
import AttendeesReport from "./components/AttendeesReport";
import PresenterReport from "./components/PresenterReport";

class App extends Component {
  state = {};

  render() {
    // return <AttendeesReport standalone fakedata />;
    return <PresenterReport fakedata />;
  }
}

export default App;
console.log("he");
console.log("he");
