import moment from 'moment';
import $ from 'jquery';

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
      '2017-08': 10,
      '2017-09': 5,
      '2017-10': 11,
    }
  },
  {
    id: 2,
    name: 'Go to Jiu Jitsu',
    description: 'get more flow',
    createdDate: '2017-01-28 20:38:43',
    notes: '10/27 - loop choke from guard',
    tallyMarks: {
      '2017-07': 9,
      '2017-08': 8,
      '2017-09': 12,
      '2017-10': 11,
    }
  },
  {
    id: 3,
    name: 'Do Back Exercises',
    description: 'strength for bjj',
    createdDate: '2017-01-28 20:38:43',
    notes: 'exercise ball + bridge',
    tallyMarks: {
      '2017-09': 3,
      '2017-10': 4,
    }
  },
];

// render login screen
// render logout
// render dashboard
function renderDashboard() {
  $('.tracker-container').html(''); //empty()

  mockTrackerData.forEach(trackerData => {
    const component = new TrackerComponents(trackerData);
    $('.tracker-container').append(component.getTrackerHtml());
  });

  $('.main-section').hide();
  $('.dashboard').show();
}

//for current tracker need to be able to identify current month and render marks for current month
//for tracker summary, need to get # of marks for previous months and render in chart

//loop through tallyMark object & get month/year
//get current month
//after get month/year, check if it matches current month
//if current month, render tally marks
//if not current month, render blank unless new mark added 
//then 
function checkTrackerMonth() {
  //get current month
  //get array of keys > sort > check if latest month matches current month
  const trackerMonth = '';
  const currentMonth = moment(); //convert this with moment?
  const trackerMoment = moment(trackerMonth);
  const monthCompare = trackerMoment.isSame(today, 'month');
  
  for (let i = 0; i < mockTrackerData.length; i++) {
    //loop through each tracker object, get object key for tallyMarks 
    return trackerMonth = Object.keys(mockTrackerData[i].tallyMarks).sort();
    //check last item in array to see if it's current 
  }
  if (currentMonth === monthCompare) {
    return 
  }


  //check if 
}


class TrackerComponents {
  constructor(data) {
    this.trackerId = data.id;
    this.name = data.name;
    this.month = data.month;
    this.tallyMarks = data.tallyMarks;
  }

  getTallyMarks() {
    const markBlocks = [];
    const template = `<li class="mark"></li>`;
    for (let i = 0; i < this.tallyMarks; i++) {  
      markBlocks.push(template);
    }
    return markBlocks.join('');
  }
  
  //where to render description & notes? 
  getTrackerHtml() {
    const template = `
      <h3 class="tracker-name">${this.name}</h3>
        <h4 class="tracker-month">${this.month}</h4>
        <ul class="tally-marks>${this.getTallyMarks()}</ul>  
        <div class="button-row">
          <button type="button" id="add-mark-btn">Add Mark</button>
          <button data-trkr-name=${this.name} id="view-sumry-btn">View Summary</button>
        </div>
    `;
    return template;
  }
}

function setUpHandlers() {
  $('.dashboard-link').click(renderDashboard);
}

$('document').ready(() => {
  setUpHandlers();
  // renderDashboard();
});