import $ from "jquery";
import Cookies from 'js-cookie';

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

import { setSignUpHandlers } from './signup';
import { setLoginHandlers } from "./login";
import { debug } from "util"; //?

export const STATE = {
  trackers: [],
  archivedTrackers: [],
  jwt: '',
  currentUserId: '',
};

// LANDING PAGE
function setIndexHandlers() {
  $('.login-btn').click(renderLoginForm);
  $('.signup-btn').click(renderSignUpForm);
  $('.home-btn').click(renderIndexPage);

  // login for demo account
  // $(".main-section").on("click", ".demo-btn", e => {
  //   // auto login with demo account
  // };
};

// DASHBOARD 

// Call the API for current trackers and store in STATE
function getDashboardTrackers() {
  // TODO: update the 123 to be an id when we are ready
  return $.get("/api/users/123/trackers/active").then(data => {
    // console.log(data.trackers);
    // STATE.trackers.push(...mockTrackerData);
    STATE.trackers.push(...data.trackers);
  });
}

function getArchivedTrackers() {
  // TODO: update the 123 to be an id when we are ready
  return $.get("/api/users/123/trackers/archived").then(data => {
    STATE.archivedTrackers.push(...data.trackers);
  });
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

    $.post(`/api/users/123/trackers/${trackerId}/increment`).then(data => {
      const index = STATE.trackers.findIndex(
        tracker => tracker.id === data.id
      );
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
    });
    // STATE.trackers.push(...data.trackers);
  });

  //remove mark button
  $(".main-section").on("click", ".remove-mark-btn", e => {
    const trackerId = $(e.currentTarget).data("trkr-id"); //OR .attr('data-trkr-id')
    const section = $(e.currentTarget).data("section");

    $.post(`/api/users/123/trackers/${trackerId}/decrement`).then(data => {
      const index = STATE.trackers.findIndex(
        tracker => tracker.id === data.id
      );
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
    });
    // STATE.trackers.push(...data.trackers);
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

    // change :userId when ready? 
    $.ajax({
      method: 'PUT',
      url: `/api/users/123/trackers/${trackerId}`,
      data: JSON.stringify(updatedData),
      contentType: 'application/json', 
    })
  });

  // close button
  $(".tracker-summary").on("click", ".close-btn", () => {
    renderSummaryPage();
  });

  // archive button
  $(".tracker-summary").on("click", ".archive-btn", e => {
    const trackerId = $(e.currentTarget).data("trkr-id");
    const section = $(e.currentTarget).data("section");

    $.post(`/api/users/123/trackers/${trackerId}/archive`).then(data => {
      const index = STATE.trackers.findIndex(tracker => tracker.id === data.id);

      STATE.trackers.splice(index, 1); //look at index position & remove 1 item following
      STATE.archivedTrackers.push(data); //push data that comes back from API 

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
    });
  });

  // reactivate button
  $(".tracker-archive").on("click", ".reactivate-btn", e => {
    const trackerId = $(e.currentTarget).data("trkr-id");

    $.post(`/api/users/123/trackers/${trackerId}/reactivate`).then(data => {
      console.log('state =', STATE, data);
      const index = STATE.archivedTrackers.findIndex(tracker => tracker.id === data.id);

      STATE.archivedTrackers.splice(index, 1);
      STATE.trackers.push(data);

      renderArchivePage();
    });
  });

  //add delete button

  //toggle chart type - line <> bar graph
  // $(".tracker-summary").on("click", ".toggle-chart", e => {
  //   toggleChartType();
  // })
}

$("document").ready(() => {
  if(window.location.pathname === '/') {
    setIndexHandlers();
    setSignUpHandlers();
    setLoginHandlers();
  }

  if(window.location.pathname === 'dashboard') {
    
    STATE.jwt = Cookies.get('jwt');
    STATE.currentUserId = Cookies.get('loggedInUser');
    console.log('test from dashboard');
    // setUpHandlers();
    // getDashboardTrackers().then(renderDashboard);
    // getArchivedTrackers();
    // getArchivedTrackers().then(renderArchivePage);
  }


});
