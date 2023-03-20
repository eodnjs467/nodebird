import React from "react";
import PropTypes from "prop-types";
import wrapper from "../store/configureStore";

// eslint-disable-next-line react/prop-types
function NodeBird({ Component }) {
    return (
      <Component />
    );
}

NodeBird.propType = {
    Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(NodeBird);
