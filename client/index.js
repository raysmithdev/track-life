import moment from 'moment';
import $ from 'jquery';
import chart from 'chart.js';

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
      '2017-08-01': 10,
      '2017-09-01': 5,
      '2017-10-01': 11,
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
    }
  },
];

// render login screen

// render dashboard
function renderDashboard() {
  $('.main-section').hide();
  $('.tracker-container').html(''); //empty()

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
    const component = new TrackerComponents(trackerData);
    $('.summary-container').append(component.getTrackerSummaryHtml());
  });

  $('.tracker-summary').show();
}

//render archive page
function renderArchivePage() {
  $('.main-section').hide();
  $('.tracker-archive').show();
}

//render user profile page
function renderProfilePage() {
  $('.main-section').hide();
  $('.profile').show();
}

//log out and return to landing-page 
function renderLogOutDashboard() {
}

//can use .destroy() to remove instances of chart created 
//put data gathered from getMarksToChart() and plug into chart 
function renderChart() {
  // var ctx = $("#myChart");
  var ctx = document.getElementById('myChart').getContext('2d');
  var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',
      // The data for our dataset
      data: {
          labels: [], //months 
          datasets: [{
              label: "Marks for ${this.name}",
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
              data: [], //marks
          }]
      },
      // Configuration options go here
      options: {}
  });
}

//get last 6 months of marks to put in chart 
// function getPreviousMarks(month) {
//   const pastMonths = [];
//   const sortedKeys = Object.keys(month).sort();
//   for (let i = 0; i <= sortedKeys.length - 6; i++) {
//     return { pastMonth:  ;
//   }
//   console.log(pastMonths);
//   }
// }

//for current tracker need to be able to identify current month and render marks for current month
//for tracker summary, need to get # of marks for previous months and render in chart

//look at tallyMark object & get month/year
//get system current month 
//after get month/year, check if it matches current month
//if current month, render tally marks
//if not current month, render blank unless new mark added 
//pass in mockdata in renderDashboard as a test later 
function checkTrackerMonth(marks) { 
  const currentMonth = moment(); 
  const sortedKeys = Object.keys(marks).sort();
  const trackerMonth = sortedKeys[sortedKeys.length-1];
  const trackerMoment = moment(trackerMonth);

  const doesCurrentMonthMatch = trackerMoment.isSame(currentMonth, 'month'); 
  if (doesCurrentMonthMatch === true) {
    return { currentTrackerMonth: trackerMoment.format('MMMM YYYY'), 
            monthCount: marks[trackerMonth]
    }; 
  }
}

//look at previous month and display previous month's count in a statement 
function getPreviousCount(count) {
    const currentMonth = moment(); 
    const sortedKeys = Object.keys(count).sort();
    const previousMonth = sortedKeys[sortedKeys.length-2];
    const trackerMoment = moment(previousMonth);

    const isItMonthBefore = trackerMoment.isBefore(currentMonth, 'month'); 
    if (isItMonthBefore === true) {
      return { monthCount: count[previousMonth] }; 
    };
    //how to access the object returned? 
    // let previousMonthCount = 
}
class TrackerComponents {
  constructor(data) {
    this.trackerId = data.id;
    this.name = data.name;
    this.tallyMarks = data.tallyMarks; 
    this.currentMarks = checkTrackerMonth(this.tallyMarks);
    this.oneMonthBack = getPreviousCount(this.tallyMarks); 
    // this.pastMarks = getPreviousMarks(this.tallyMarks);    
    //how to change this after moving to class? 
  }

  getTallyMarks() {
    const markBlocks = [];
    const template = `<li class="mark"></li>`;
    for (let i = 0; i <= this.currentMarks.monthCount; i++) { 
      // console.log(this.currentMarks.monthCount); 
      markBlocks.push(template);
    }
    return markBlocks.join('');
  }
  
  //where to render description & notes? 
  //marks are rendering outside of container? 
  getTrackerHtml() {
    const template = `
      <div class="tracker-container">
        <h3 class="tracker-name">${this.name}</h3>
          <h4 class="tracker-month">${this.currentMarks.currentTrackerMonth}</h4>
            <div class="marks-container">
              <ul class="tally-marks>${this.getTallyMarks()}</ul> 
            </div> 
          <div class="button-row">
            <button type="button" id="add-mark-btn">Add Mark</button>
            <button data-trkr-name=${this.name} id="view-sumry-btn">View Summary</button>
          </div>
      </div>
      `;
    return template;
  }


  getTrackerSummaryHtml() {
    const template = `
      <div class="tracker-container">
      <h3 class="tracker-name">${this.name}</h3>
        <h4 class="tracker-month">${this.currentMarks.currentTrackerMonth}</h4>
          <div class="marks-container">
            <ul class="tally-marks>${this.getTallyMarks()}</ul> 
          </div>
          <div class="summary-statements">
          <p class="summary-sentence">You marked ${this.name} ${this.currentMarks.monthCount} times this month!</p>
            <p class="summary-sentence">You marked ${this.name} ${this.oneMonthBack.monthCount} times last month!</p>
          </div>
          <div class="chart-container">
            <canvas id="myChart"></canvas>
          </div>
        <div class="button-row">
          <button type="button" id="edit-trkr-btn">Edit</button>
          <button type="button" id="add-mark-btn">Add Mark</button>
          <button type="button" id='delete-btn">Delete<button> 
          <button type="button id="archive-btn">Archive</button>
        </div>
    </div>
    `;
  return template;
  } 
}
// class chartComponent {

// }

function setUpHandlers() {
  $('.dashboard-link').click(renderDashboard);
  $('.summary-link').click(renderSummaryPage);
  $('.create-link').click(renderCreateTracker);
  $('.archive-link').click(renderArchivePage);
  $('.profile-link').click(renderProfilePage);
  $('#logout-btn').click(renderLogOutDashboard);
}

$('document').ready(() => {
  setUpHandlers();
  // renderDashboard();
});