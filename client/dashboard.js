import $ from "jquery";
import Cookies from "js-cookie";

import {
  renderDashboard,
  renderCreateTrackerPage,
  renderSummaryPage,
  renderIndividualTrackerSummary,
  renderArchivePage,
  renderLogOutDashboard
} from "./index.render-views";

import { STATE } from "./index";

// DASHBOARD

const redirectOnAuthFailure = err => {
  if (err.status === 401) {
    window.location = "/";
  }
};

// Call the API for current trackers and store in STATE
export function getDashboardTrackers() {
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

export function getArchivedTrackers() {
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

// DASHBOARD HANDLERS
export function setDashboardHandlers() {
  // NAVIGATION BUTTONS
  $(".dashboard-link").click(renderDashboard);
  $(".summary-link").click(renderSummaryPage);
  $(".create-link").click(renderCreateTrackerPage);
  $(".archive-link").click(renderArchivePage);
  // $(".profile-link").click(renderProfilePage);
  $(".logout-btn").click(renderLogOutDashboard);

  // DYNAMIC BUTTONS CREATED WITHIN TRACKERS

  // ADD MARK BUTTON
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

  // REMOVE MARK BUTTON
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

  // VIEW BUTTON - OPENS INDIVIDUAL TRACKER SUMMARY
  $(".dashboard").on("click", ".view-sumry-btn", e => {
    const trackerId = $(e.currentTarget).data("trkr-id"); //OR .attr('data-trkr-id')
    renderIndividualTrackerSummary(trackerId);
  });

  // EDIT BUTTON - OPENS INDIVIDUAL TRACKER SUMMARY VIEW
  $(".tracker-summary").on("click", ".edit-trkr-btn", e => {
    const trackerId = $(e.currentTarget).data("trkr-id"); //OR .attr('data-trkr-id')
    renderIndividualTrackerSummary(trackerId);
  });

  // SAVE INPUT FIELDS ON BLUR (NAME/DESCRIPTION/NOTES)
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

  // CLOSE BUTTON
  $(".tracker-summary").on("click", ".close-btn", () => {
    renderSummaryPage();
  });

  // ARCHIVE BUTTON
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

  // REACTIVATE BUTTON
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

  // CREATE TRACKER BUTTON
  $(".main-section").on('submit', '.create-form', e => {
  // $((".create-form").submit((e) => {
    console.log('form submit!');
    e.preventDefault();
    const userId = Cookies.get("loggedInUserId");
    const name = $('.new-trkr-name').val();
    const description = $('.new-trkr-description').val();
    const notes = $('.new-trkr-notes').val();

    console.log('userId ->', userId);
    console.log('form sections ->', name, description, notes);

    $.ajax({
      url: `/api/users/${userId}/trackers`,
      method: "POST",
      data: JSON.stringify({name, description, notes}),
      contentType: "application/json",
      headers: {
        Authorization: `Bearer ${Cookies.get("jwt")}`
      },
      dataType: "json"
    })
    .then(newTracker => {
      STATE.trackers.push(newTracker);
      console.log('after create new tracker ->',STATE);
      renderDashboard(); 
    })
    .catch(redirectOnAuthFailure);
  });

  //add delete button
  //toggle chart type - line <> bar graph
  // $(".tracker-summary").on("click", ".toggle-chart", e => {
  //   toggleChartType();
  // })
}