'use strict';

//mock data for initial build
const mockData = [
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
  $('.tracker-container').empty();  //.html('');

  mockData.forEach(trackerData => {
    const component = new TrackerComponents(trackerData);
    $('.tracker-container').append(component.getTrackerHtml());
  });

  $('.main-section').hide();
  $('.dashboard').show();
}
// render create new tracker 
// render tracker summary page
// render chart
// render user profile page
// render archive page

//for current tracker need to be able to identify current month and render marks for current month
//for tracker summary, need to get # of marks for previous months and render in chart
class TrackerComponents {
  constructor(data) {
    this.trackerId = data.id;
    this.name = data.name;
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
  $('.summary-link').on('click', ) //what is the difference?
}

$('document').ready(() => {
  setUpHandlers();
  renderDashboard();
});