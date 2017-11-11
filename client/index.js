"use strict";

import $ from "jquery";

import ChartComponents from "./chart.component";
import TrackerComponents from "./tracker.component";
import UserComponents from "./user.component";

import mockTrackerData from "./mock-data";
import { debug } from "util"; //?

const STATE = {
  trackers: [],
  archivedTrackers: []
};

// render different views
// render login screen

// render dashboard
function renderDashboard() {
  $(".main-section").hide();
  $(".dashboard-container").empty(); //html('');
  // $('.tracker-container').empty();

  STATE.trackers.forEach(trackerData => {
    const component = new TrackerComponents(trackerData);
    $(".dashboard-container").append(component.getDashboardTrackerHtml());
  });

  $(".dashboard").show();
}

//render create new tracker
function renderCreateTracker() {
  $(".main-section").hide(); //need to empty everything displayed
  $(".create-tracker").show();
}

//render summary page
function renderSummaryPage() {
  $(".main-section").hide();
  $(".summary-container").empty();

  // streamline summary by displaying all vs individually for now 11/7/17
  STATE.trackers.forEach(trackerData => {
    const trackerComponent = new TrackerComponents(trackerData);
    $(".summary-container").append(trackerComponent.getTrackerSummaryHtml());
    
    const chartComponent = new ChartComponents(trackerData);
    chartComponent.renderChart();
  });

  $(".tracker-summary").show();
}

// function toggleChartType() {

//   let trackerData = STATE.trackers.find(tracker => tracker.id === id);
//   const trackerComponent = new TrackerComponents(trackerData);
//   $(".summary-container").append(trackerComponent.getTrackerSummaryHtml());

//   const chartComponent = new ChartComponents(trackerData);
//   chartComponent.renderChart();
// }  

//render individual tracker summary
function renderIndividualTrackerSummary(id) {
  $(".main-section").hide();
  $(".summary-container").empty();

  let trackerData = STATE.trackers.find(tracker => tracker.id === id);
  const trackerComponent = new TrackerComponents(trackerData);
  $(".summary-container").append(trackerComponent.getIndividualTrackerHtml());

  const chartComponent = new ChartComponents(trackerData);
  chartComponent.renderChart();

  $(".tracker-summary").show();
}

//render archive page -- change state to include archive?
function renderArchivePage() {
  $(".main-section").hide();
  $(".archive-container").empty();

  STATE.archivedTrackers.forEach(trackerData => {
    const trackerComponent = new TrackerComponents(trackerData);
    $(".archive-container").append(trackerComponent.getArchiveTrackerHtml());

    const chartComponent = new ChartComponents(trackerData);
    chartComponent.renderChart();
  });
  // console.log(STATE.archivedTrackers);
  $(".tracker-archive").show();
}

//render user profile page - ?
function renderProfilePage() {
  $(".main-section").hide();

  const userComponent = new UserComponents(userData);
  $(".profile-container").append(userComponent.getProfileHtml());

  $(".profile").show();
}

//render description in input
// function renderDescription() {
//   ${this.description}
// }

//render log out
function renderLogOutDashboard() {
  //return to landing-page
}

// Call the API for current trackers and store in STATE
function getDashboardTrackers() {
  // TODO: update the 123 to be an id when we are ready
  return $.get('/api/users/123/trackers/active').then(data => {
    // console.log(data.trackers);
    // STATE.trackers.push(...mockTrackerData);
    STATE.trackers.push(...data.trackers);
  });
}

// Call the API for archived trackers and store in STATE
function getArchivedTrackers() {
  // TODO: update the 123 to be an id when we are ready
  return $.get('/api/users/123/trackers/archived').then(data => {
    STATE.archivedTrackers.push(...data.trackers);
  });
}

function setUpHandlers() {
  //navigation buttons
  $(".dashboard-link").click(renderDashboard);
  $(".summary-link").click(renderSummaryPage);
  $(".create-link").click(renderCreateTracker);
  $(".archive-link").click(renderArchivePage);
  $(".profile-link").click(renderProfilePage);
  $(".logout-btn").click(renderLogOutDashboard);

  //dynamic buttons created within trackers
  //add mark button
  $(".main-section").on("click", ".add-mark-btn", e => {
    const trackerId = $(e.currentTarget).data("trkr-id"); //OR .attr('data-trkr-id')
    const section = $(e.currentTarget).data("section");
    $.post(`/api/users/123/trackers/${trackerId}/increment`)
      .then((data) => {
        const index = STATE.trackers.findIndex(tracker => tracker._id === data._id);
        STATE.trackers[index] = data;
        switch(section){
          case 'dashboard':
            renderDashboard();
            break;
          case 'summary': 
            renderSummaryPage();
            break;
          case 'single':  //single summary breaks, won't render
            renderIndividualTrackerSummary();
            break;
          default:
            renderDashboard();
            break;
        }
      }) 
    // STATE.trackers.push(...data.trackers);
  });

  //remove mark button
  $(".main-section").on("click", ".remove-mark-btn", e => {
    const trackerId = $(e.currentTarget).data("trkr-id"); //OR .attr('data-trkr-id')
    const section = $(e.currentTarget).data("section");
    $.post(`/api/users/123/trackers/${trackerId}/decrement`)
      .then((data) => {
        const index = STATE.trackers.findIndex(tracker => tracker._id === data._id);
        STATE.trackers[index] = data;
        switch(section){
          case 'dashboard':
            renderDashboard();
            break;
          case 'summary':
            renderSummaryPage();
            break;
          case 'single':
            renderIndividualTrackerSummary();
            break;
          default:
            renderDashboard();
            break;
        }
      }) 
    // STATE.trackers.push(...data.trackers);
  });

  //view summary button - open individual tracker
  $(".dashboard").on("click", ".view-sumry-btn", e => {
    const trackerId = $(e.currentTarget).data("trkr-id"); //OR .attr('data-trkr-id')
    renderIndividualTrackerSummary(trackerId);
  });

  //edit button - open individual tracker
  //need to be able to edit description? 
  $(".tracker-summary").on("click", ".edit-trkr-btn", e => {
    const trackerId = $(e.currentTarget).data("trkr-id"); //OR .attr('data-trkr-id')
    renderIndividualTrackerSummary(trackerId);
  });

    //add delete button

    //add archive button
    $(".tracker-summary").on("click", ".archive-btn", e => {
      const trackerId = $(e.currentTarget).data("trkr-id");
      $.post(`/users/123/trackers/${trackerId}/archive`)
      .then((data) => {
        const index = STATE.archiveTrackers.findIndex(tracker => tracker._id === data._id);
        STATE.archivedTrackers[index] = data;
        switch(section) {
          case 'summary':
            renderSummaryPage();
            break;
          case 'single':
            renderSummaryPage();
            break;
          default:
            renderSummaryPage();
            break;
        }
      })
    });


  //toggle chart type - line <> bar graph
  // $(".tracker-summary").on("click", ".toggle-chart", e => {
  //   toggleChartType();
  // })

  //add close button - close individual summary & back to summary page
  $(".tracker-summary").on("click", ".close-btn", () => {
    renderSummaryPage();
    });
};

$("document").ready(() => {
  setUpHandlers();
  //this should run after user logs in
  getDashboardTrackers().then(renderDashboard);
  getArchivedTrackers();
  // getArchivedTrackers().then(renderArchivePage);
});
