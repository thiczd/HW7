import React, { Component } from "react";
import * as d3 from "d3";
import "./Child1.css";
class Child1 extends Component {
  componentDidMount() {
    this.renderChart();
  }

  componentDidUpdate() {
    // console.log(this.props.csv_data);
    this.destroyChart();

    this.renderChart();
    // console.log(this.props.json_data); // proper JSON data passed
  }

  destroyChart = () => {
    d3.select("#mychart").selectAll("*").remove();

    d3.select("#mychart").append("g");
  };

  renderChart = () => {
    const data = this.props.json_data.slice(0, 300);

    // CREATE FORCE LAYOUT, FOR EACH MONTH
    //
    //   {
    //       "RawTweet":"my tweet",
    //       "Month":"March",
    //       "Dimension 1":-26.635721,
    //       "Dimension 2":-14.823018,
    //       "Sentiment":-0.192255892,
    //       "Subjectivity":0.516666667,
    //       "idx":1
    //   },
    // Array of Json OBJECT
    /////////////////////////////
    // Organize per month
    // Separate array for March, April, May
    const marchData = data.filter((item) => {
      return item.Month === "March";
    });
    console.log("March:");
    console.log(marchData);
    const aprilData = data.filter((item) => {
      return item.Month === "April";
    });
    console.log("April:");
    console.log(aprilData);
    const mayData = data.filter((item) => {
      return item.Month === "May";
    });
    console.log("May:");
    console.log(mayData);

    ////////////////////////////////////
    // Plot each array month into its own chart
    // forcelayout
    ////////////////////////////////////
    // Plot for sentimnet first then add
    // subjectivity
  };

  render() {
    return (
      <div className="mychart">
        <svg width="1000" height="900" style={{ marginLeft: 45 + "px" }}>
          <g className="container"></g>
          <g className="bar-chart"></g>
        </svg>
      </div>
    );
  }
}

export default Child1;
