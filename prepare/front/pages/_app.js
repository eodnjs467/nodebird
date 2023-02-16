import React, { useState } from "react";
import PropTypes from "prop-types";
import wrapper from "../store/configureStore";

function NodeBird({ Component }) {
    return (
      <Component />
    );
}

NodeBird.propType = {
    Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(NodeBird);
