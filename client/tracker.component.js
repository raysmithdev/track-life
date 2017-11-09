import moment from "moment";
import $ from "jquery";

//for current tracker need to be able to identify current month and render marks for current month
//if not current month, create new month object & add a mark

//look at tallyMark object & get month/year
//get system current month
//after get month/year, check if it matches current month
//if current month, render tally marks
//if not current month, render blank unless new mark added

export default class TrackerComponents {
  constructor(data) {
    this.trackerId = data.id;
    this.name = data.name;
    this.description = data.description;
    this.notes = data.notes;
    this.tallyMarks = data.tallyMarks;
    this.currentMarks = this.checkTrackerMonth();
    this.oneMonthBack = this.getPreviousCount();
  }

  checkTrackerMonth() {
    const currentMonth = moment();
    const sortedKeys = Object.keys(this.tallyMarks).sort();
    const trackerMonth = sortedKeys[sortedKeys.length - 1];
    const trackerMoment = moment(trackerMonth);

    const doesCurrentMonthMatch = trackerMoment.isSame(currentMonth, "month");
    if (doesCurrentMonthMatch === true) {
      return {
        currentTrackerMonth: trackerMoment.format("MMMM YYYY"),
        monthCount: this.tallyMarks[trackerMonth]
      };
    }
  }

  //look at previous month and display previous month's count in a statement
  getPreviousCount() {
    const currentMonth = moment();
    const sortedKeys = Object.keys(this.tallyMarks).sort();
    const previousMonth = sortedKeys[sortedKeys.length - 2];
    const trackerMoment = moment(previousMonth);

    const isItMonthBefore = trackerMoment.isBefore(currentMonth, "month");
    if (isItMonthBefore === true) {
      return { monthCount: this.tallyMarks[previousMonth] };
    }
  }

  getTallyMarks() {
    const markBlocks = [];
    const template = `<li class="mark"></li>`;
    for (let i = 0; i <= this.currentMarks.monthCount; i++) {
      // console.log(this.currentMarks.monthCount);
      markBlocks.push(template);
    }
    return markBlocks.join("");
  }

  //marks are rendering outside of container?
  getTrackerHtml() {
    const template = `
      <div class="tracker-container dash-trkr-box">
        <h3 class="tracker-name">${this.name}</h3>
          <h4 class="tracker-month">${this.currentMarks
            .currentTrackerMonth}</h4>
            <div class="marks-container">
              <ul class="tally-marks>${this.getTallyMarks()}</ul> 
            </div> 
          <div class="dashboard-btn-row">
            <button type="button" class="add-mark-btn trkr-btn">Add Mark</button>
            <button type="button" data-trkr-id=${this
              .trackerId} class="view-sumry-btn trkr-btn">View Summary</button>
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
        <p class="description">${this.description}</p>
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
        <div class="notes-container">
          <label for="notes">Notes</label>
          <textarea class="trkr-sumry-notes">${this.notes}</textarea>
        </div>
        <div class="summary-btn-row">
          <button type="button" class="edit-trkr-btn trkr-btn">Edit?</button>
          <button type="button" class="add-mark-btn trkr-btn">Add Mark</button>
          <button type="button" class="delete-btn trkr-btn">Delete</button> 
          <button type="button" class="archive-btn trkr-btn">Archive</button>
        </div>
      </div>
    </div>
    `;
    return template;
  }

  // getTrackerSummaryHtml() {
  //   const template = `
  //     <div class="tracker-container inner-flexbox">
  //     <div class="col-1">
  //       <h3 class="tracker-name">${this.name}</h3>
  //       <h4 class="tracker-month">${this.currentMarks.currentTrackerMonth}</h4>
  //         <div class="marks-container">
  //           <ul class="tally-marks>${this.getTallyMarks()}</ul> 
  //         </div>
  //         <div class="summary-statements">
  //           <p class="summary-sentence">You marked ${this.name} ${this.currentMarks.monthCount} times this month!</p>
  //           <p class="summary-sentence">You marked ${this.name} ${this.oneMonthBack.monthCount} times last month!</p>
  //         </div>
  //     </div>
  //     <div class="col-2">
  //       <div class="chart-container">
  //         <canvas class="myChart-${this.trackerId}"></canvas>
  //       </div>
  //       <div class="summary-btn-row">
  //         <button type="button" class="edit-trkr-btn trkr-btn">Edit</button>        
  //         <button type="button" class="add-mark-btn trkr-btn">Add Mark</button>
  //         <button type="button" class="delete-btn trkr-btn">Delete</button> 
  //         <button type="button" class="archive-btn trkr-btn">Archive</button>
  //       </div>
  //     </div>
  //   </div>
  //   `;
  //   return template;
  // }

  getIndividualTrackerHtml() {
    const template = `
      <div class="tracker-container inner-flexbox">
      <div class="col-1">
        <h3 class="tracker-name">${this.name}</h3>
        <h4 class="tracker-month">${this.currentMarks.currentTrackerMonth}</h4>
        <p class="description">${this.description}</p>
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
        <div class="notes-container">
          <label for="notes">Notes</label>
          <textarea class="trkr-sumry-notes">${this.notes}</textarea>
        </div>
        <div class="summary-btn-row">
          <button type="button" class="edit-trkr-btn trkr-btn">Edit?</button>
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

  getArchiveTrackerHtml() {
    const template = `
      <div class="tracker-container inner-flexbox">
      <div class="col-1">
        <h3 class="tracker-name">${this.name}</h3>
        <h4 class="tracker-month">${this.currentMarks.currentTrackerMonth}</h4>
          <div class="marks-container">
            <ul class="tally-marks>${this.getTallyMarks()}</ul> 
          </div>
          <div class="summary-statements">
            <p class="summary-sentence">You last marked ${this.name} ${this
      .currentMarks.monthCount} times.</p>
          </div>
      </div>
      <div class="col-2">
          <div class="chart-container">
            <canvas class="myChart-${this.trackerId}"></canvas>
          </div>
        <div class="summary-btn-row">
          <button type="button" class="edit-trkr-btn trkr-btn">Edit</button>        
          <button type="button" class="delete-btn trkr-btn">Delete</button> 
          <button type="button" class="reactivate-btn trkr-btn">Reactivate</button>
          <button type="button" class="close-btn trkr-btn">Close</button>
        </div>
      </div>
    </div>
    `;
    return template;
  }
}
