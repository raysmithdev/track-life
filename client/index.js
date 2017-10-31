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
// render logout
// render dashboard
function renderDashboard() {
  $('.tracker-container').html(''); //empty()

  mockTrackerData.forEach(trackerData => {
    const component = new TrackerComponents(trackerData);
    $('.dashboard-container').append(component.getTrackerHtml());
  });

  $('.main-section').hide();
  $('.dashboard').show();
}

//for current tracker need to be able to identify current month and render marks for current month
//for tracker summary, need to get # of marks for previous months and render in chart

//look at tallyMark object & get month/year
//get system current month 
//after get month/year, check if it matches current month
//if current month, render tally marks
//if not current month, render blank unless new mark added 

function checkTrackerMonth(marks) { 
  const currentMonth = moment(); 
  const sortedKeys = Object.keys(marks).sort();
  const trackerMonth = sortedKeys[sortedKeys.length-1];
  const trackerMoment = moment(trackerMonth);
  const doesCurrentMonthMatch = trackerMoment.isSame(currentMonth, 'month'); //this is the boolean
    
  if (doesCurrentMonthMatch === true) {
    return { latestMonth: trackerMoment.format('MMMM YYYY'), 
            monthCount: marks[trackerMonth]
    }; 
  }
}
//pass in mockdata in renderDashboard as a test later 

class TrackerComponents {
  constructor(data) {
    this.trackerId = data.id;
    this.name = data.name;
    this.tallyMarks = data.tallyMarks; 
    this.latestMark = checkTrackerMonth(this.tallyMarks);
  }

  getTallyMarks() {
    const markBlocks = [];
    const template = `<li class="mark"></li>`;
    for (let i = 0; i < this.latestMark.monthCount; i++) { 
      console.log(this.latestMark.monthCount); 
      markBlocks.push(template);
      console.log(markBlocks);
    }
    return markBlocks.join('');
  }
  
  //where to render description & notes? 
  getTrackerHtml() {
    const template = `
    <div class="tracker-container">
      <h3 class="tracker-name">${this.name}</h3>
        <h4 class="tracker-month">${this.latestMark.latestMonth}</h4>
        <ul class="tally-marks>${this.getTallyMarks()}</ul>  
        <div class="button-row">
          <button type="button" id="add-mark-btn">Add Mark</button>
          <button data-trkr-name=${this.name} id="view-sumry-btn">View Summary</button>
        </div>
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