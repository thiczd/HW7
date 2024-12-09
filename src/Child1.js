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
    console.log(this.props.json_data); // Use this data as default. When the user will upload data this props will provide you the updated data
  }

  destroyChart = () => {
    d3.select("#mychart").selectAll("*").remove();

    d3.select("#mychart").append("g");
  };

  renderChart = () => {};

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
