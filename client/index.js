import $ from "jquery";
import Cookies from "js-cookie";

import {
  renderIndexPage,
  renderLoginForm,
  renderSignUpForm,
  renderDashboard,
} from "./index.render-views";

import {
  getDashboardTrackers,
  getArchivedTrackers,
  setDashboardHandlers
} from "./dashboard";

import { setSignUpHandlers } from "./signup";
import { setLoginHandlers } from "./login";
import { debug } from "util"; //?

export const STATE = {
  trackers: [],
  archivedTrackers: [],
  jwt: "",
  currentUserId: ""
};

// LANDING PAGE
function setIndexHandlers() {
  $(".login-btn").click(renderLoginForm);
  $(".signup-btn").click(renderSignUpForm);
  $(".home-btn").click(renderIndexPage);
  // login for demo account
  // $(".main-section").on("click", ".demo-btn", e => {
  //   // auto login with demo account
  // };
}

$("document").ready(() => {
  if (window.location.pathname === "/") {
    setIndexHandlers();
    setSignUpHandlers();
    setLoginHandlers();
  }

  if (window.location.pathname === "/dashboard") {
    STATE.jwt = Cookies.get("jwt");
    STATE.currentUserId = Cookies.get("loggedInUserId");
    setDashboardHandlers();
    getDashboardTrackers().then(renderDashboard);
    getArchivedTrackers();
    // render dashboard last
    // getArchivedTrackers().then(renderArchivePage);
  }
});
