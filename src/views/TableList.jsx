import React, { Component } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";

import TableCard from "../components/Card/TableCard.jsx";
import { thArray } from "../variables/Variables.jsx";
import Amplify, { Storage } from 'aws-amplify';
import awsconfig from '../aws-exports';
import MaterialTable from 'material-table';

Amplify.configure(awsconfig);

class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = {files: []};
  }
  componentDidMount() {
    Storage.list('')
    .then(result => {this.setState({files: result})})
    .catch(err => console.log(err));

  }
  handleDownloadClick(key) {
    Storage.get(key)
    .then(result => {window.open(result, '_blank');})
    .catch(err => console.log(err));
  }
  handleDeleteClick(key) {
    //console.log(key)
    Storage.remove(key)
    .then(result => {
      //console.log(result)
      window.location.reload(false);
    })
    .catch(err => console.log(err))
  }
  convertArray(files) {
    var folderId = 0;
    var initialArray = files;
    var convertedArray = [];
    convertedArray = initialArray.filter((prop) => {
      if(prop.key === 'to_be_classified/'){
        return false; //skip
      }else{
        return true;
      }
    }).map((prop,key) => {
        var reversedCurrentName = prop.key.split("").reverse();
        if(reversedCurrentName[0] === "/"){
          folderId = key;
          return{id: key, name: (prop.key + " "), filesize: "", lastmodified: prop.lastModified.toString()}
        }else if(prop.key.includes("/")){
          var folderAndFile = prop.key.split("/")
          return{id: key, name: folderAndFile[1], filesize: prop.size, lastmodified: prop.lastModified.toString(), parentId: folderId, fullPath: prop.key}
        }else {
          return{id: key, name: prop.key, filesize: prop.size, lastmodified: prop.lastModified.toString(), fullPath: prop.key}
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
                title="S3Bucket"
                actions={[
                  rowData => ({
                    icon: 'delete',
                    tooltip: 'Delete',
                    onClick: (event, rowData) => this.handleDeleteClick(rowData.fullPath),
                    hidden: rowData.filesize === ""
                  }),
                  rowData => ({
                    icon: 'clouddownload',
                    tooltip: 'Download',
                    onClick: (event, rowData) => this.handleDownloadClick(rowData.fullPath),
                    hidden: rowData.filesize === ""
                  })
                ]}
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

export default TableList;
