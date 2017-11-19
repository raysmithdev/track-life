"use strict";

import $ from "jquery";

import {
  renderDashboard,
  renderCreateTrackerPage,
  renderSummaryPage,
  renderIndividualTrackerSummary,
  renderArchivePage,
  renderProfilePage,
  renderLogOutDashboard
} from "./index.render-views";

import { debug } from "util"; //?

export const STATE = {
  trackers: [],
  archivedTrackers: []
};

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
  $(".profile-link").click(renderProfilePage);
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

  // add archive button
  $(".tracker-summary").on("click", ".archive-btn", e => {
    const trackerId = $(e.currentTarget).data("trkr-id");
    const section = $(e.currentTarget).data("section");

    $.post(`/api/users/123/trackers/${trackerId}/archive`).then(data => {
      const index = STATE.trackers.findIndex(tracker => tracker.id === data.id);
      STATE.trackers[index] = data;
      switch (section) {
        case "summary":
        //every time a button is pushed
        //need to update the STATE and pull from the state
        //look into the process 
        // getDashboardTrackers().then(renderSummaryPage);
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

  //add reactivate button
  $(".tracker-archive").on("click", ".reactivate-btn", e => {
    const trackerId = $(e.currentTarget).data("trkr-id");
    const section = $(e.currentTarget).data("section");
      //check how STATE is being managed
      //find the tracker in archivetrackers and add it back to trackers
      //OR create refresh method so it does API call to active trackers & reset the state
    $.post(`/api/users/123/trackers/${trackerId}/reactivate`).then(data => {
      const index = STATE.archiveTrackers.findIndex(
        tracker => tracker.id === data.id
      );
      STATE.archiveTrackers[index] = data; //maybe need to look at active vs archive state
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

  //add delete button

  //toggle chart type - line <> bar graph
  // $(".tracker-summary").on("click", ".toggle-chart", e => {
  //   toggleChartType();
  // })
}

$("document").ready(() => {
  setUpHandlers();
  //this should run after user logs in
  getDashboardTrackers().then(renderDashboard);
  getArchivedTrackers();
  // getArchivedTrackers().then(renderArchivePage);
});
