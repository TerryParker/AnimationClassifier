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
      //***************************************************************
      //Get all folders
      //***************************************************************
      var prevFolder = "";
      var joined = data.Contents.filter((prop,key) => {
        if(prop.Key.includes("/")){

          var folderAndFile = prop.Key.split("/")
          var currentFolder = folderAndFile[0]
          if (prevFolder !== currentFolder){
            prevFolder = currentFolder
            return true;
          }else return false;
        }else return false;
      }).map((prop,key) => {
        var folderAndFile = prop.Key.split("/")
        var currentFolder = folderAndFile[0]
        return currentFolder + ":" + key;
      })
      //***************************************************************
      this.setState({files: data.Contents, folders:joined})
    })
  }
  convertArray(files) {
    var initialArray = files;
    var convertedArray = [];
    var folderArray = [];
    //*************************************************** */
    //Initialize folders in convertedArray
    //*************************************************** */
    folderArray = this.state.folders.map((prop,key) => {
      var tempID = prop.split(":")
      return{id: tempID[1], name: (tempID[0] + " "), filesize: "", lastmodified: ""}
    })
    //*************************************************** */
    //Initialize files in convertedArray
    //*************************************************** */
    convertedArray = initialArray.filter((prop) => {
      if(prop.Key === 'to_be_classified/'){
        return false; //skip
      }else{
        return true;
      }
    }).map((prop,key) => {
        if(prop.Key.includes("/")){
          var folderAndFile = prop.Key.split("/")
          var parentID = ""
          this.state.folders.forEach((prop,key) => {
            if (prop.includes(folderAndFile[0])){
              var temp = prop.split(":")
              parentID = temp[1]
            }
          })
          return{id: key, name: folderAndFile[1], filesize: prop.Size, lastmodified: prop.LastModified.toString(), parentId: parentID, fullPath: prop.Key}
        }else {
          return{id: key, name: prop.Key, filesize: prop.Size, lastmodified: prop.LastModified.toString(), fullPath: prop.Key}
        }
    })
    var result = [...folderArray, ...convertedArray]
    return result;
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
