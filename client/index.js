import $ from "jquery";

import ChartComponents from "./chart.component";
import TrackerComponents from "./tracker.component";

import mockTrackerData from "./mock-data";
import { debug } from "util"; //?

const STATE = {
  trackers: []
};


("use strict");

// render login screen

// render dashboard
function renderDashboard() {
  console.log('render dashboard');
  $(".main-section").hide();
  $(".dashboard-container").empty(); //html('');
  // $('.tracker-container').empty();

  STATE.trackers.forEach(trackerData => {
    const component = new TrackerComponents(trackerData);
    $(".dashboard-container").append(component.getTrackerHtml());
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

//render archive page
function renderArchivePage() {
  $(".main-section").hide();
  $(".archive-container").empty();

  STATE.trackers.forEach(trackerData => {
    const trackerComponent = new TrackerComponents(trackerData);
    $(".archive-container").append(trackerComponent.getArchiveTrackerHtml());

    const chartComponent = new ChartComponents(trackerData);
    chartComponent.renderChart();
  });

  $(".tracker-archive").show();
}

//render user profile page
function renderProfilePage() {
  $(".main-section").hide();
  $(".profile").show();
}

//render log out
function renderLogOutDashboard() {
  //return to landing-page
}

// Call the API for trackers and store in STATE
function getDashboardTrackers() {
  // TODO: update the 123 to be an id when we are ready
  return $.get('/api/users/123/trackers').then(data => {
    console.log(data.trackers);
    // STATE.trackers.push(...mockTrackerData);
    STATE.trackers.push(...data.trackers);
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

  //dyanmic buttons created within trackers
  //add mark button
  $(".main-section").on("click", ".add-mark-btn", e => {
    const trackerId = $(e.currentTarget).data("trkr-id"); //OR .attr('data-trkr-id')
    const section = $(e.currentTarget).data("section");
    $.post(`/api/users/123/trackers/${trackerId}`)
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

  //add delete button
  //add archive button

  //view summary button
  $(".dashboard").on("click", ".view-sumry-btn", e => {
    const trackerId = $(e.currentTarget).data("trkr-id"); //OR .attr('data-trkr-id')
    renderIndividualTrackerSummary(trackerId);
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
  getDashboardTrackers().then(renderDashboard)
});
