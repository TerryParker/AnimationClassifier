import React, { Component } from 'react';
import FileDrop from 'react-file-drop';

export class UploadFileDrop extends Component {
  handleDrop = (files, event) => {
    //console.log(files, event);
    this.props.fileDropCallback(files);
  }
  render() {
    return (
      <div id="react-file-drop-demo" style={{border: '1px solid black', width: 600, color: 'black', padding: 20}}>
        <FileDrop onDrop={this.handleDrop}>
          Drop some files here!
        </FileDrop>
      </div>
    );
  }
}

export default UploadFileDrop;