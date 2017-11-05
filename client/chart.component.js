import moment from 'moment';
import $ from 'jquery';
import {Chart} from 'chart.js';

export default class ChartComponents {
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