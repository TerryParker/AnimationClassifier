import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";

// import Amplify, { Storage } from 'aws-amplify';
// import awsconfig from '../aws-exports';
import MaterialTable from 'material-table';

const AWS = require('aws-sdk/global');
AWS.config.update({ accessKeyId: process.env.REACT_APP_API_KEY, secretAccessKey: process.env.REACT_APP_SECRET_KEY, region: process.env.REACT_APP_VIDEO_BUCKET_REGION });
const s3 = new AWS.S3();

const params = {
  Bucket: process.env.REACT_APP_VIDEO_BUCKET,
  Delimiter: '',
  Prefix: '',
};

class VideoTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      folders: []
    };
  }
  componentDidMount() {
    s3.listObjectsV2(params, (err, data) => {
      if (err) throw err;
      this.setState({files: data.Contents})
    })
  }
  convertArray(files) {
    var initialArray = files;
    var convertedArray = [];
    convertedArray = initialArray.filter((prop) => {
      if(prop.key === 'to_be_classified/'){
        return false; //skip
      }else{
        return true;
      }
    }).map((prop,key) => {
      //console.log(prop)
      // var reversedCurrentName = prop.Key.split("").reverse();
      // if(reversedCurrentName[0] === "/"){
      //   folderId = key;
      //   return{id: key, name: (prop.Key + " "), filesize: "", lastmodified: prop.LastModified.toString()}
      // }else if(prop.Key.includes("/")){
      //   var folderAndFile = prop.Key.split("/")
      //   return{id: key, name: folderAndFile[1], filesize: prop.Size, lastmodified: prop.LastModified.toString(), parentId: folderId, fullPath: prop.Key}
      // }else {
      //   return{id: key, name: prop.Key, filesize: prop.Size, lastmodified: prop.LastModified.toString(), fullPath: prop.Key}
      // }
      //***************************************************************
      //Get all folders
      //***************************************************************
      if(prop.Key.includes("/")){
        console.log(prop.Key)
        var folderAndFile = prop.Key.split("/")
        var currentFolder = folderAndFile[0]
        var folders = this.state.folders
        console.log(folders)
        if (!(folders.includes(currentFolder))){
          var joined = this.state.folders.concat(currentFolder);
          this.setState({folders: joined})
        }
      }
      //***************************************************************
      folders = this.state.folders
      if(prop.Key.includes("/")){
        if(folders.includes(currentFolder))
        return{id: key, name: prop.Key, filesize: prop.Size, lastmodified: prop.LastModified.toString()}
      }
    })
    return convertedArray;
  }
  render() {
    return (
      <div className="content">
        <Container fluid>
          <Row>
            <Col md={12}>
              <MaterialTable 
                columns={[
                  { title: 'Name', field: 'name' },
                  { title: 'File Size', field: 'filesize' },
                  { title: 'Last Modified', field: 'lastmodified' }
                  
                ]}
                data={this.convertArray(this.state.files)}
                parentChildData={(row, rows) => rows.find(a => a.id === row.parentId)}
                title=""
                options={{
                  actionsColumnIndex: -1,
                  pageSize: 10
                }}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default VideoTable;
