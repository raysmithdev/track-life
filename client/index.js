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
import { demoUser } from "./demo";

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
}
  // Demo button
  $(".demo-btn").click(function() {
    const userName = demoUser.userName;
    const password = demoUser.password;

    $.post('/api/auth/login', {userName, password}).then((user) => {
      Cookies.set('jwt', user.authToken);
      Cookies.set('loggedInUserId', user.userId);
      window.location = '/dashboard';
    });
  });

  // Already signup? link
  $(".signedup").click(function(e) {
    e.preventDefault();
    renderLoginForm();
  })

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
  }
});
