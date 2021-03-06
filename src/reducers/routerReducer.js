import React from "react";
import { connect } from "react-redux";
import { Route as OriginalRoute } from "react-router-dom";

export default function routerReducer(state, { type, match }) {
  if (state === undefined) {
    return { match: null };
  }
  if (type === "ROUTE") {
    return { match: match };
  }
  if (type === "LOADING") {
    return { ...state };
  }
  return state;
}

const actionRouteToRedux = (match) => {
  return {
    type: "ROUTE",
    match,
  };
};

let CRoute = (
  p //action - actionCreator to push into redux
) => (
  <OriginalRoute
    {...p}
    component={(pp) => {
      let OriginalPage = p.component;
      p.action(pp.match);
      return <OriginalPage {...pp} />;
    }}
  />
);

export const Route = connect(null, { action: actionRouteToRedux })(CRoute);
