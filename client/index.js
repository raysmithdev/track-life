import $ from "jquery";
import Cookies from "js-cookie";

import {
  renderIndexPage,
  renderLoginForm,
  renderSignUpForm,
  renderDashboard,
  renderCreateTrackerPage,
  renderSummaryPage,
  renderIndividualTrackerSummary,
  renderArchivePage,
  renderLogOutDashboard
} from "./index.render-views";

import { setSignUpHandlers } from "./signup";
import { setLoginHandlers } from "./login";
import { debug } from "util"; //?

export const STATE = {
  trackers: [],
  archivedTrackers: [],
  jwt: "",
  currentUserId: ""
};

const redirectOnAuthFailure = err => {
  if (err.status === 401) {
    window.location = "/";
  }
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

// DASHBOARD

// Call the API for current trackers and store in STATE
function getDashboardTrackers() {
  // console.log(`Bearer ${Cookies.get('jwt')}`);
  return $.ajax({
    url: `/api/users/${STATE.currentUserId}/trackers/active`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${Cookies.get("jwt")}`
    },
    dataType: "json"
  })
    .then(data => {
      STATE.trackers.push(...data.trackers);
    })
    .catch(redirectOnAuthFailure);
}

function getArchivedTrackers() {
  return $.ajax({
    url: `/api/users/${STATE.currentUserId}/trackers/archived`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${Cookies.get("jwt")}`
    },
    dataType: "json"
  })
  .then(data => {
    STATE.archivedTrackers.push(...data.trackers);
  })
  .catch(redirectOnAuthFailure);
}

function setUpHandlers() {
  //navigation buttons
  $(".dashboard-link").click(renderDashboard);
  $(".summary-link").click(renderSummaryPage);
  $(".create-link").click(renderCreateTrackerPage);
  $(".archive-link").click(renderArchivePage);
  // $(".profile-link").click(renderProfilePage);
  $(".logout-btn").click(renderLogOutDashboard);

  //dynamic buttons created within trackers
  //add mark button
  $(".main-section").on("click", ".add-mark-btn", e => {
    const trackerId = $(e.currentTarget).data("trkr-id"); //OR .attr('data-trkr-id')
    const section = $(e.currentTarget).data("section");

    $.ajax({
      url: `/api/users/${STATE.currentUserId}/trackers/${trackerId}/increment`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`
      },
      dataType: "json"
    })
    .then(data => {
      const index = STATE.trackers.findIndex(tracker => tracker.id === data.id);
      STATE.trackers[index] = data;
      switch (section) {
        case "dashboard":
          renderDashboard();
          break;
        case "summary":
          renderSummaryPage();
          break;
        case "single": //single summary breaks, won't render
          renderIndividualTrackerSummary(data.id);
          break;
        default:
          renderDashboard();
          break;
      }
    })
    .catch(redirectOnAuthFailure);
  });

  //remove mark button
  $(".main-section").on("click", ".remove-mark-btn", e => {
    const trackerId = $(e.currentTarget).data("trkr-id"); //OR .attr('data-trkr-id')
    const section = $(e.currentTarget).data("section");

    $.ajax({
      url: `/api/users/${STATE.currentUserId}/trackers/${trackerId}/decrement`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`
      },
      dataType: "json"
    })
    .then(data => {
      const index = STATE.trackers.findIndex(tracker => tracker.id === data.id);
      STATE.trackers[index] = data;
      switch (section) {
        case "dashboard":
          renderDashboard();
          break;
        case "summary":
          renderSummaryPage();
          break;
        case "single":
          renderIndividualTrackerSummary(data.id);
          break;
        default:
          renderDashboard();
          break;
      }
    })
    .catch(redirectOnAuthFailure);
  });

  // view summary button - open individual tracker
  $(".dashboard").on("click", ".view-sumry-btn", e => {
    const trackerId = $(e.currentTarget).data("trkr-id"); //OR .attr('data-trkr-id')
    renderIndividualTrackerSummary(trackerId);
  });

  // edit button - open individual tracker view
  $(".tracker-summary").on("click", ".edit-trkr-btn", e => {
    const trackerId = $(e.currentTarget).data("trkr-id"); //OR .attr('data-trkr-id')
    renderIndividualTrackerSummary(trackerId);
  });

  // save input fields on blur in individual summary view
  $(".tracker-summary").on("blur", ".edit-trkr-field", e => {
    const trackerId = $(e.currentTarget).data("trkr-id");
    const fieldName = $(e.currentTarget).data("field-name");
    const fieldValue = $(e.currentTarget).val();
    const updatedData = {};
    updatedData[fieldName] = fieldValue;

    const index = STATE.trackers.findIndex(tracker => tracker.id === trackerId);
    const updatedTracker = STATE.trackers[index];
    updatedTracker[fieldName] = fieldValue;

    $.ajax({
      method: "PUT",
      url: `/api/users/${STATE.currentUserId}/trackers/${trackerId}`,
      data: JSON.stringify(updatedData),
      contentType: "application/json",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`
      },
      dataType: "json"
    })
    .catch(redirectOnAuthFailure);
  });

  // close button
  $(".tracker-summary").on("click", ".close-btn", () => {
    renderSummaryPage();
  });

  // archive button
  $(".tracker-summary").on("click", ".archive-btn", e => {
    const trackerId = $(e.currentTarget).data("trkr-id");
    const section = $(e.currentTarget).data("section");

    $.ajax({
      url: `/api/users/${STATE.currentUserId}/trackers/${trackerId}/archive`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`
      },
      dataType: "json"
    })
    .then(data => {
      const index = STATE.trackers.findIndex(tracker => tracker.id === data.id);
      //look at index position & remove 1 item following
      STATE.trackers.splice(index, 1); 
      //push data that comes back from API
      STATE.archivedTrackers.push(data); 

      switch (section) {
        case "summary":
          renderSummaryPage();
          break;
        case "single":
          renderSummaryPage();
          break;
        default:
          renderSummaryPage();
          break;
      }
    })
    .catch(redirectOnAuthFailure);
  });

  // reactivate button
  $(".tracker-archive").on("click", ".reactivate-btn", e => {
    const trackerId = $(e.currentTarget).data("trkr-id");
    $.ajax({
      url: `/api/users/${STATE.currentUserId}/trackers/${trackerId}/reactivate`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`
      },
      dataType: "json"
    })
    .then(data => {
      // console.log("state =", STATE, data);
      const index = STATE.archivedTrackers.findIndex(
        tracker => tracker.id === data.id
      );

      STATE.archivedTrackers.splice(index, 1);
      STATE.trackers.push(data);

      renderArchivePage();
    })
    .catch(redirectOnAuthFailure);
  });

  //add delete button
  //toggle chart type - line <> bar graph
  // $(".tracker-summary").on("click", ".toggle-chart", e => {
  //   toggleChartType();
  // })
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
    setUpHandlers();
    getDashboardTrackers().then(renderDashboard);
    getArchivedTrackers();
    // render dashboard last
    // getArchivedTrackers().then(renderArchivePage);
  }
});
