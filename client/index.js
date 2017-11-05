import $ from 'jquery';

import ChartComponents from './chart.component';
import TrackerComponents from './tracker.component';

'use strict';

//mock data for initial build
const mockTrackerData = [
  {
    id: 1, 
    name: 'Eat more tofu',
    description: 'it\'s good for you, I think',
    createdDate: '2017-10-22 20:38:43',
    notes: 'tofu steak recipe http://www.justmoretofu.com/steak',
    tallyMarks: {
      '2017-08-01': 7,
      '2017-09-01': 5,
      '2017-10-01': 11,
      '2017-11-01': 10,
    }
  },
  {
    id: 2,
    name: 'Go to Jiu Jitsu',
    description: 'get more flow',
    createdDate: '2017-01-28 20:38:43',
    notes: '10/27 - loop choke from guard',
    tallyMarks: {
      '2017-07-01': 9,
      '2017-08-01': 8,
      '2017-09-01': 12,
      '2017-10-01': 11,
      '2017-11-01': 2,
    }
  },
  {
    id: 3,
    name: 'Do Back Exercises',
    description: 'strength for bjj',
    createdDate: '2017-01-28 20:38:43',
    notes: 'exercise ball + bridge',
    tallyMarks: {
      '2017-09-01': 3,
      '2017-10-01': 4,
      '2017-11-01': 30,
    }
  },
];

// render login screen

//pass in mockdata in renderDashboard as a test later 
// render dashboard
function renderDashboard() {
  $('.main-section').hide();
  $('.dashboard-container').empty(); //html('');
  // $('.tracker-container').empty(); 
  
  mockTrackerData.forEach(trackerData => {
    const component = new TrackerComponents(trackerData);
    $('.dashboard-container').append(component.getTrackerHtml());
  });

  $('.dashboard').show();
}

//render create new tracker
function renderCreateTracker() {
  $('.main-section').hide();   //need to empty everything displayed
  $('.create-tracker').show();
}

//render summary page
function renderSummaryPage() {
  $('.main-section').hide();
  $('.summary-container').empty();

  mockTrackerData.forEach(trackerData => {
    const trackerComponent = new TrackerComponents(trackerData);
    $('.summary-container').append(trackerComponent.getTrackerSummaryHtml());
    
    const chartComponent = new ChartComponents(trackerData);
    chartComponent.renderChart();
  });

  $('.tracker-summary').show();
}

//render individual tracker summary
function renderIndividualTrackerSummary() {
  $('.main-section').hide();
  $('.summary-container').empty();

  mockTrackerData.forEach(trackerData => {
    const trackerComponent = new TrackerComponents(trackerData);
    $('.summary-container').append(trackerComponent.getIndividualTrackerHtml());
    
    const chartComponent = new ChartComponents(trackerData);
    chartComponent.renderChart();
  });

  $('.tracker-summary').show();
}
    
//render archive page
function renderArchivePage() {
  $('.main-section').hide();
  $('.archive-container').empty();

  mockTrackerData.forEach(trackerData => {
    const trackerComponent = new TrackerComponents(trackerData);
    $('.archive-container').append(trackerComponent.getArchiveTrackerHtml());
    
    const chartComponent = new ChartComponents(trackerData);
    chartComponent.renderChart();
  });

  $('.tracker-archive').show();
}

//render user profile page
function renderProfilePage() {
  $('.main-section').hide();
  $('.profile').show();
}

//render log out 
function renderLogOutDashboard() {
  //return to landing-page 
}

//add a mark to an existing tracker
function addMarkToTracker() {
  //check if current month exists & increment by 1
  //if current month does not exist, add new and increment by 1
}


function setUpHandlers() {
  //sidebar navigation buttons 
  $('.dashboard-link').click(renderDashboard);
  $('.summary-link').click(renderSummaryPage);
  $('.create-link').click(renderCreateTracker);
  $('.archive-link').click(renderArchivePage);
  $('.profile-link').click(renderProfilePage);
  $('.logout-btn').click(renderLogOutDashboard);

  //dyanmic buttons created within trackers

  //view summary button
  $('.dashboard').on('click', '.view-sumry-btn', () => {
    renderIndividualTrackerSummary();
  })

  //add mark button
  //add delete button
  //add archive button
  //add close button
}

$('document').ready(() => {
  setUpHandlers();
  renderDashboard();  //this should run after user logs in
});