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
    data.forEach((item) => {
      if (item.Month === "March") {
        item.Month = 0; // Modify the property directly
      } else if (item.Month === "April") {
        item.Month = 1; // Modify the property directly
      } else if (item.Month === "May") {
        item.Month = 2; // Modify the property directly
      }
    });

    const catCenters = [100, 200, 300]; // Adjusted for better spacing
    const xPos = 1;
    const sentimentColorScale = d3
      .scaleLinear()
      .domain([-1, 0, 1])
      .range(["red", "#ECECEC", "green"]);
    const subjectivityColorScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range(["#ECECEC", "#4467C4"]);

    // creating the force simulation
    d3.forceSimulation(data)
      .force(
        "y",
        d3.forceY((d) => catCenters[d.Month])
      )
      .force("x", d3.forceX(xPos).strength(0.0001))

      .force("collision", d3.forceCollide(6))
      .on("tick", () => {
        d3.select("g")
          .selectAll("circle")
          .data(data)
          .join("circle")
          .attr("r", "5")
          .style("fill", (d) => sentimentColorScale(d.Sentiment)) // Need to fix color
          .attr("cx", (d) => d.x + 350)
          .attr("cy", (d) => d.y);
      });

    // TODO:
    // ADD COLOR FOR SENTIMENT, THEN SUBJECTIVITY
    // ADD MONTH ON LEFT HAND SIDE
    // DROPDOWN FOR Color Switch
    // ADD LEGEND
    // Tweet selection and highlight when clicking

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
  };

  render() {
    return (
      <div className="mychart">
        <svg width="1200" height="900" style={{ marginLeft: 45 + "px" }}>
          <g className="container"></g>
        </svg>
      </div>
    );
  }
}

export default Child1;
