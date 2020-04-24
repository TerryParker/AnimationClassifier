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
      console.log(data.Contents)
      //***************************************************************
      //Get all folders
      //***************************************************************
      //var joined = [];
      // var sources = images.filter(function(img) {
      //   if (img.src.split('.').pop() === "json") {
      //     return false; // skip
      //   }
      //   return true;
      // }).map(function(img) { return img.src; });


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
        return currentFolder + "/";
      })
      //***************************************************************
      this.setState({files: data.Contents, folders:joined})
    })
  }
  convertArray(files) {
    var folderId = 0;
    var initialArray = files;
    var convertedArray = [];
    convertedArray = initialArray.filter((prop) => {
      if(prop.Key === 'to_be_classified/'){
        return false; //skip
      }else{
        return true;
      }
    }).map((prop,key) => {
      console.log(prop.Key)
        var reversedCurrentName = prop.Key.split("").reverse();
        if(reversedCurrentName[0] === "/"){
          folderId = key;
          return{id: key, name: (prop.Key + " "), filesize: "", lastmodified: prop.LastModified.toString()}
        }else if(prop.Key.includes("/")){
          var folderAndFile = prop.Key.split("/")
          return{id: key, name: folderAndFile[1], filesize: prop.Size, lastmodified: prop.LastModified.toString(), parentId: folderId, fullPath: prop.Key}
        }else {
          return{id: key, name: prop.Key, filesize: prop.Size, lastmodified: prop.LastModified.toString(), fullPath: prop.Key}
        }
    })
    return convertedArray;
  }
  // convertArray(files) {
  //   var initialArray = files;
  //   var convertedArray = [];
  //   var index = 0;
  //   convertedArray = initialArray.filter((prop) => {
  //     if(prop.Key.includes("/")){
  //       var folderAndFile = prop.Key.split("/")
  //       var currentFolder = folderAndFile[0]
  //       currentFolder = currentFolder+"/"
  //       console.log(this.state.folders[index])
  //       if(this.state.folders[index] === currentFolder){
  //         index = index + 1;
  //         return false; //skip
  //       }else{
  //         index = index + 1;
  //         return true;
  //       }
  //     }
  //     index = index + 1;
  //     return true;
  //   }).map((prop,key) => {
  //     //console.log(prop)
  //     // var reversedCurrentName = prop.Key.split("").reverse();
  //     // if(reversedCurrentName[0] === "/"){
  //     //   folderId = key;
  //     //   return{id: key, name: (prop.Key + " "), filesize: "", lastmodified: prop.LastModified.toString()}
  //     // }else if(prop.Key.includes("/")){
  //     //   var folderAndFile = prop.Key.split("/")
  //     //   return{id: key, name: folderAndFile[1], filesize: prop.Size, lastmodified: prop.LastModified.toString(), parentId: folderId, fullPath: prop.Key}
  //     // }else {
  //     //   return{id: key, name: prop.Key, filesize: prop.Size, lastmodified: prop.LastModified.toString(), fullPath: prop.Key}
  //     // }
  //     //***************************************************************
  //     //Get all folders
  //     //***************************************************************
  //     // console.log(key)
  //     // if(prop.Key.includes("/")){
  //     //   var folderAndFile = prop.Key.split("/")
  //     //   var currentFolder = folderAndFile[0]
  //     //   if (!(this.state.folders.includes(currentFolder))){
  //     //     var joined = this.state.folders.concat(currentFolder);
  //     //     //this.setState({ folders:joined });
  //     //     return{id: key, name: prop.Key, filesize: prop.Size, lastmodified: prop.LastModified.toString()}
  //     //   }
  //     // }

  //     console.log(this.state.folders)
  //     return{id: key, name: prop.Key, filesize: prop.Size, lastmodified: prop.LastModified.toString()}
  //     //***************************************************************
  //   })
  //   return convertedArray;
  // }
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
