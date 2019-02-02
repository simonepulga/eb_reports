import React, { Component } from "react";
import { Collapse } from "reactstrap";
import { StickyContainer, Sticky } from "react-sticky";
import AttendeesCardHeader from "./AttendeesCardHeader";
import AttendeesTableHeader from "./AttendeesTableHeader";
import AttendeesTableBody from "./AttendeesTableBody";

class AttendeesCard extends Component {
  toStickOrNotToStick() {
    const { event: e, visibility, toggleVisibility } = this.props;

    if (visibility) {
      return (
        <StickyContainer>
          <Sticky>
            {({ style }) => (
              <div style={style}>
                <div onClick={toggleVisibility}>
                  <AttendeesCardHeader event={e} />
                </div>
                <Collapse isOpen={visibility}>
                  <AttendeesTableHeader />
                </Collapse>
              </div>
            )}
          </Sticky>
          <Collapse isOpen={visibility}>
            <AttendeesTableBody event={e} />
          </Collapse>
        </StickyContainer>
      );
    } else {
      return (
        <React.Fragment>
          <div>
            <div onClick={toggleVisibility}>
              <AttendeesCardHeader event={e} />
            </div>
            <Collapse isOpen={visibility}>
              <AttendeesTableHeader />
            </Collapse>
          </div>
          <Collapse isOpen={visibility}>
            <AttendeesTableBody event={e} />
          </Collapse>
        </React.Fragment>
      );
    }
  }
  render() {
    return <div className="card">{this.toStickOrNotToStick()}</div>;
  }
}

export default AttendeesCard;
