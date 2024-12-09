import React, { Component } from "react";

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
    };
  }

  handleFileSubmit = (event) => {
    event.preventDefault();
    const { file } = this.state;

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          // Parse the JSON content
          const json = JSON.parse(e.target.result);

          // Check if the parsed JSON is an array
          if (Array.isArray(json)) {
            this.props.set_data(json); // Pass the array to parent component
          } else {
            console.error("Uploaded file is not a valid JSON array.");
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  render() {
    return (
      <div style={{ backgroundColor: "#f0f0f0", padding: 20 }}>
        <h2>Upload a JSON File</h2>
        <form onSubmit={this.handleFileSubmit}>
          <input
            type="file"
            accept=".json"
            onChange={(event) => this.setState({ file: event.target.files[0] })}
          />
          <button type="submit">Upload</button>
        </form>
      </div>
    );
  }
}

export default FileUpload;
