import React, { Component } from "react";
import * as d3 from "d3";
import "./Child1.css";
class Child1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "sentiment",
      tweets: [],
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
    const svg = d3.select("g");
    if (prevState.color !== this.state.color) {
      const sentimentColorScale = d3
        .scaleLinear()
        .domain([-1, 0, 1])
        .range(["red", "#ECECEC", "green"]);

      const subjectivityColorScale = d3
        .scaleLinear()
        .domain([0, 1])
        .range(["#ECECEC", "#4467C4"]);

      svg
        .selectAll("circle")
        .style("fill", (d) =>
          this.state.color === "sentiment"
            ? sentimentColorScale(d.Sentiment)
            : subjectivityColorScale(d.Subjectivity)
        );
      svg
        .selectAll("rect")
        .style("fill", (d) =>
          this.state.color === "sentiment"
            ? sentimentColorScale(d)
            : subjectivityColorScale(d)
        );
    }

    if (this.state.color === "subjectivity") {
      svg.selectAll("text").remove();
      svg.append("text").text("Subjective").attr("x", 650).attr("y", 60);
      svg.append("text").text("Objective").attr("x", 650).attr("y", 345);
    } else {
      svg.selectAll("text").remove();
      svg.append("text").text("Positive").attr("x", 650).attr("y", 60);
      svg.append("text").text("Negative").attr("x", 650).attr("y", 345);
    }
    if (prevProps.json_data !== this.props.json_data) {
      this.renderChart(); // Re-render chart if json_data changes
    }
  }

  destroyChart() {
    d3.select("#mychart").selectAll("*").remove();
  }

  updateTweet(element) {
    console.log("displaying", element);
    this.setState((prevState) => ({
      tweets: [...prevState.tweets, element.RawTweet], // Append the newTweet to the array
    }));
  }

  renderChart = () => {
    if (!this.props.json_data || this.props.json_data.length === 0) {
      return; // Exit the function if there's no data prevent legend and axis to be rendered unnecessarily
    }

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
          .attr("cy", (d) => d.y)
          .on("click", (event, d) => {
            d3.select(event.target).attr("stroke", "black");
            console.log(d);
            this.updateTweet(d);
          });
      });

    // create legend with 20 squares stacked vertically
    var svg = d3.select("g");

    const values = d3.range(20).map((d) => 1 - (d / 19) * 2);

    svg
      .selectAll("rect")
      .data(values)
      .enter()
      .append("rect")
      .attr("x", 600)
      .attr("y", (d, i) => 50 + i * 15) // Spaced vertically
      .attr("width", 30)
      .attr("height", 10)
      .attr("stroke", "black")
      .style("fill", (d) =>
        this.state.color === "sentiment"
          ? sentimentColorScale(d)
          : subjectivityColorScale(d)
      ); // Need to fix color
    svg.append("text").text("Positive").attr("x", 650).attr("y", 60);
    svg.append("text").text("Negative").attr("x", 650).attr("y", 345);

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
        {this.props.json_data && this.props.json_data.length > 0 && (
          <div className="dropdown-group">
            <span> Color By:</span>
            <select onChange={this.handleColorChange}>
              <option value="sentiment">Sentiment</option>
              <option value="subjectivity">Subjectivity</option>
            </select>
          </div>
        )}
        <div className="mychart">
          <svg width="1200" height="400" style={{ marginLeft: 45 + "px" }}>
            <g className="container"></g>
          </svg>
        </div>
        <ul style={{ margin: "12px" }}>
          {this.state.tweets.map((tweet, index) => (
            <li key={index} style={{ marginBottom: "4px" }}>
              {tweet}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Child1;
