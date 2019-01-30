import React, { Component } from "react";
import { Collapse } from "reactstrap";
import { StickyContainer, Sticky } from "react-sticky";
import AttendeesCardHeader from "./AttendeesCardHeader";
import AttendeesTableHeader from "./AttendeesTableHeader";
import AttendeesTableBody from "./AttendeesTableBody";

class AttendeesCard extends Component {
  render() {
    const { event: e, visibility, toggleVisibility } = this.props;
    return (
      <div className="card">
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
      </div>
    );
  }
}

export default AttendeesCard;
