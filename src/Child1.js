import React, { Component } from "react";
import * as d3 from "d3";
import "./Child1.css";
class Child1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "sentiment",
    };
  }
  handleColorChange = (event) => {
    const selectedOption = event.target.value;
    // Set the color based on the selected option
    this.setState({ color: selectedOption });
    console.log(this.state.color);
  };

  componentDidMount() {
    if (this.props.json_data) {
      this.renderChart();
    }
  }
  componentDidUpdate(prevProps, prevState) {
    // Compare previous color state and if changed then
    // change the d3 settings

    if (prevState.color !== this.state.color) {
      const sentimentColorScale = d3
        .scaleLinear()
        .domain([-1, 0, 1])
        .range(["red", "#ECECEC", "green"]);

      const subjectivityColorScale = d3
        .scaleLinear()
        .domain([0, 1])
        .range(["#ECECEC", "#4467C4"]);

      d3.select("g")
        .selectAll("circle")
        .style("fill", (d) =>
          this.state.color === "sentiment"
            ? sentimentColorScale(d.Sentiment)
            : subjectivityColorScale(d.Subjectivity)
        );
    } else {
      if (prevProps.json_data !== this.props.json_data) {
        this.renderChart(); // Re-render chart if json_data changes
      }
    }
  }

  destroyChart() {
    d3.select("#mychart").selectAll("*").remove();
  }

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

    const catCenters = [100, 225, 325]; // Adjusted for better spacing
    const xPos = 1;
    const sentimentColorScale = d3
      .scaleLinear()
      .domain([-1, 0, 1])
      .range(["red", "#ECECEC", "green"]);
    const subjectivityColorScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range(["#ECECEC", "#4467C4"]);

    const monthLabels = ["March", "April", "May"];
    d3.select("svg")
      .selectAll("text")
      .data(monthLabels)
      .join("text")
      .attr("x", 10)
      .attr("y", (d, i) => catCenters[i])
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text((d) => d);
    // creating the force simulation

    d3.forceSimulation(data)
      .force(
        "y",
        d3.forceY((d) => catCenters[d.Month])
      )
      .force("x", d3.forceX(xPos).strength(0.005))

      .force("collision", d3.forceCollide(6))
      .on("tick", () => {
        d3.select("g")
          .selectAll("circle")
          .data(data)
          .join("circle")
          .attr("r", "5")
          .style("fill", (d) =>
            this.state.color === "sentiment"
              ? sentimentColorScale(d.Sentiment)
              : subjectivityColorScale(d.Subjectivity)
          ) // Need to fix color
          .attr("cx", (d) => d.x + 350)
          .attr("cy", (d) => d.y);
      });

    // TODO:
    // ADD LEGEND
    // Tweet selection and highlight when clicking

    // DONE
    // ADD MONTH ON LEFT HAND SIDE DONE
    // FORCE LAYOUT - DONE
    // SEPERATION PER MONTH - DONE
    // SCALING FUNCTION Y - DONE
    // ADD COLOR FOR SENTIMENT, THEN SUBJECTIVITY - DONE
    // DROPDOWN FOR Color Switch - DONE

    // MIGHT BE USEFUL, STRUCTURE JSON
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
      <div>
        <div className="dropdown-group">
          <span> Color By:</span>
          <select onChange={this.handleColorChange}>
            <option value="sentiment">Sentiment</option>
            <option value="subjectivity">Subjectivity</option>
          </select>
        </div>
        <div className="mychart">
          <svg width="1200" height="900" style={{ marginLeft: 45 + "px" }}>
            <g className="container"></g>
          </svg>
        </div>
      </div>
    );
  }
}

export default Child1;
