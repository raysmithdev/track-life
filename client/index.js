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

//render log out 
function renderLogOutDashboard() {
  //return to landing-page 
}

//add a mark to an existing tracker
function addMarkToTracker() {
  //check if current month exists & increment by 1
  //if current month does not exist, add new and increment by 1
}

//for current tracker need to be able to identify current month and render marks for current month
//if not current month, create new month object & add a mark

//look at tallyMark object & get month/year
//get system current month 
//after get month/year, check if it matches current month
//if current month, render tally marks
//if not current month, render blank unless new mark added 

class TrackerComponents {
  constructor(data) {
    this.trackerId = data.id;
    this.name = data.name;
    this.tallyMarks = data.tallyMarks; 
    this.currentMarks = this.checkTrackerMonth();
    this.oneMonthBack = this.getPreviousCount(); 
  }

  checkTrackerMonth() { 
    const currentMonth = moment(); 
    const sortedKeys = Object.keys(this.tallyMarks).sort();
    const trackerMonth = sortedKeys[sortedKeys.length-1];
    const trackerMoment = moment(trackerMonth);
  
    const doesCurrentMonthMatch = trackerMoment.isSame(currentMonth, 'month'); 
    if (doesCurrentMonthMatch === true) {
      return { currentTrackerMonth: trackerMoment.format('MMMM YYYY'), 
              monthCount: this.tallyMarks[trackerMonth]
      }; 
    }
  }

  //look at previous month and display previous month's count in a statement 
  getPreviousCount() {
    const currentMonth = moment(); 
    const sortedKeys = Object.keys(this.tallyMarks).sort();
    const previousMonth = sortedKeys[sortedKeys.length-2];
    const trackerMoment = moment(previousMonth);

    const isItMonthBefore = trackerMoment.isBefore(currentMonth, 'month'); 
    if (isItMonthBefore === true) {
      return { monthCount: this.tallyMarks[previousMonth] }; 
    };
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
  getIndividualTrackerSummary() {

  }

  //marks are rendering outside of container? 
  getTrackerHtml() {
    const template = `
      <div class="tracker-container dash-trkr-box">
        <h3 class="tracker-name">${this.name}</h3>
          <h4 class="tracker-month">${this.currentMarks.currentTrackerMonth}</h4>
            <div class="marks-container">
              <ul class="tally-marks>${this.getTallyMarks()}</ul> 
            </div> 
          <div class="dashboard-btn-row">
            <button type="button" class="add-mark-btn trkr-btn">Add Mark</button>
            <button type="button" class="view-sumry-btn trkr-btn">View Summary</button>
          </div>
      </div>
      `;
    return template;
  }

  getTrackerSummaryHtml() {
    const template = `
      <div class="tracker-container inner-flexbox">
      <div class="col-1">
        <h3 class="tracker-name">${this.name}</h3>
        <h4 class="tracker-month">${this.currentMarks.currentTrackerMonth}</h4>
          <div class="marks-container">
            <ul class="tally-marks>${this.getTallyMarks()}</ul> 
          </div>
          <div class="summary-statements">
          <p class="summary-sentence">You marked ${this.name} ${this.currentMarks.monthCount} times this month!</p>
            <p class="summary-sentence">You marked ${this.name} ${this.oneMonthBack.monthCount} times last month!</p>
          </div>
      </div>
      <div class="col-2">
          <div class="chart-container">
            <canvas class="myChart-${this.trackerId}"></canvas>
          </div>
        <div class="summary-btn-row">
          <button type="button" class="edit-trkr-btn trkr-btn">Edit</button>        
          <button type="button" class="add-mark-btn trkr-btn">Add Mark</button>
          <button type="button" class="delete-btn trkr-btn">Delete</button> 
          <button type="button" class="archive-btn trkr-btn">Archive</button>
          <button type="button" class="close-btn trkr-btn">Close</button>
        </div>
      </div>
    </div>
    `;
  return template;
  } 

  getIndividualTrackerHtml() {
    const template = `
      <div class="tracker-container inner-flexbox">
      <div class="col-1">
        <h3 class="tracker-name">${this.name}</h3>
        <h4 class="tracker-month">${this.currentMarks.currentTrackerMonth}</h4>
          <div class="marks-container">
            <ul class="tally-marks>${this.getTallyMarks()}</ul> 
          </div>
          <div class="summary-statements">
          <p class="summary-sentence">You marked ${this.name} ${this.currentMarks.monthCount} times this month!</p>
            <p class="summary-sentence">You marked ${this.name} ${this.oneMonthBack.monthCount} times last month!</p>
          </div>
      </div>
      <div class="col-2">
          <div class="chart-container">
            <canvas class="myChart-${this.trackerId}"></canvas>
          </div>
        <div class="summary-btn-row">
          <button type="button" class="edit-trkr-btn trkr-btn">Edit</button>
          <button type="button" class="add-mark-btn trkr-btn">Add Mark</button>
          <button type="button" class="delete-btn trkr-btn">Delete</button> 
          <button type="button" class="archive-btn trkr-btn">Archive</button>
          <button type="button" class="close-btn trkr-btn">Close</button>
        </div>
      </div>
    </div>
    `;
  return template;
  } 
}

class ChartComponents {
  constructor(data) {
    this.trackerId = data.id;
    this.name = data.name;
    this.tallyMarks = data.tallyMarks;
    this.previousMarks = this.getPreviousMarks();
  }
// get last 6 months of marks to put in chart 
  getPreviousMarks() {
    const sortedKeys = Object.keys(this.tallyMarks).sort();
    const pastMonths = [];
    const pastMarks = [];
    let i = 0; 

    while (i < sortedKeys.length && i < 6) {
      pastMonths.push(moment(sortedKeys[i]).format('MMM YY'));
      pastMarks.push(this.tallyMarks[sortedKeys[i]]); 
      i++
    }
    return {month: pastMonths, count: pastMarks};
  }

  //can use .destroy() to remove instances of chart created 
  //put data gathered from getMarksToChart() and plug into chart 
  renderChart() {
    var ctx = document.getElementsByClassName(`myChart-${this.trackerId}`)[0].getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar', //or 'line'
        // The data for our dataset
        data: {
            labels: this.previousMarks.month, //months 
            datasets: [{
                label: `Marks for ${this.name}`,
                backgroundColor: 'rgba(79, 195, 247, 0.3)',
                borderColor: 'rgb(0, 147, 196)',
                borderWidth: 1,
                data: this.previousMarks.count, //marks
            }]
        },
        // Configuration options go here
        options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                      //look up the setting for highest y axis value 
                      //take highest value of the marks and + 2 
                  }
              }]
          },
          title: {
            display: true,
            text: 'Last 6 Months'
          },
          responsive: true,
        }
    });
  }
}

function setUpHandlers() {
  //sidebar navigation buttons 
  $('.dashboard-link').click(renderDashboard);
  $('.summary-link').click(renderSummaryPage);
  $('.create-link').click(renderCreateTracker);
  $('.archive-link').click(renderArchivePage);
  $('.profile-link').click(renderProfilePage);
  $('#logout-btn').click(renderLogOutDashboard);

  //dyanmic buttons created within trackers

  //view summary button
  $('.dashboard').on('click', '.view-sumry-btn', () => {
    renderSummaryPage();
  })

  //add mark button
}

$('document').ready(() => {
  setUpHandlers();
  renderDashboard();  //this should run after user logs in
});