import moment from "moment";
import $ from "jquery";
import { Chart } from "chart.js";
import annotations from "chartjs-plugin-annotation";

export default class ChartComponents {
  constructor(data) {
    this.trackerId = data.id;
    this.name = data.name;
    this.tallyMarks = data.tallyMarks;
    this.previousMarks = this.getPreviousMarks();
    this.averageMarks = this.calculateAvgMarks();
    this.totalMarks = this.getTotalMarks();
  }

  // get up to last 6 months of marks to put in chart
  getPreviousMarks() {
    const sortedKeys = Object.keys(this.tallyMarks).sort();
    const pastMonths = [];
    const pastMarks = [];
    let i = 0;

    while (i < sortedKeys.length && i < 6) {
      pastMonths.push(moment(sortedKeys[i]).format("MMM YY"));
      pastMarks.push(this.tallyMarks[sortedKeys[i]]);
      i++;
    }
    return { month: pastMonths, count: pastMarks };
  }

  // to set max value for y axis -- need to cap at 6 months
  getTotalMarks() {
    const sortedKeys = Object.keys(this.tallyMarks).sort();
    const tallyMarks = this.tallyMarks;

    let totalCount = sortedKeys.reduce(function (sum, value) {
      return sum + tallyMarks[value];
    }, 0)
    return { total: totalCount };
  }

  // calcuate average -- need to cap at 6 months
  calculateAvgMarks() {
    const sortedKeys = Object.keys(this.tallyMarks).sort();
    const tallyMarks = this.tallyMarks;

    let avgMarks =
      sortedKeys.reduce(function(sum, value) {
        return sum + tallyMarks[value];
      }, 0) / sortedKeys.length;
    return { count: avgMarks.toFixed(), numOfMonths: sortedKeys.length };
  }

  //can use .destroy() to remove instances of chart created
  renderChart() {
    var ctx = document
      .getElementsByClassName(`myChart-${this.trackerId}`)[0]
      .getContext("2d");
    var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: "bar", //or 'line'
      // The data for our dataset
      data: {
        // month & year 
        labels: this.previousMarks.month,
        datasets: [
          {
            label: `Marks for ${this.name}`,
            backgroundColor: "rgba(79, 195, 247, 0.3)",
            borderColor: "rgb(0, 147, 196)",
            borderWidth: 1,
            //number of marks per month
            data: this.previousMarks.count
          }
        ]
      },
      // Configuration options go here
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                max: this.getTotalMarks.total
              }
            }
          ]
        },
        responsive: true,
        // add average line
        annotation: {
          annotations: [
            {
              drawTime: "afterDraw",
              id: "average",
              type: "line",
              mode: "horizontal",
              scaleID: "y-axis-0",
              value: this.averageMarks.count,
              borderColor: "#008ba3",
              borderWidth: 2,
              label: {
                backgroundColor: "#c8a415",
                fontSize: 13,
                fontStyle: "normal",
                cornerRadius: 3,
                position: top,
                enabled: true,
                content: `average: ${this.averageMarks.count}`
              }
            }
          ]
        }
      }
    });
  }
}
