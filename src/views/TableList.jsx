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
    Storage.remove(key)
    .then(result => {
    })
    .catch(err => console.log(err))
    window.location.reload(false);
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
        return{name: prop.key, filesize: prop.size, lastmodified: prop.lastModified.toString()}
    })
    return convertedArray;
  }
  render() {
    return (
      <div className="content">
        <Container fluid>
          <Row>
            <Col md={12}>
             {/* <TableCard
                title="S3 Bucket"
                category="Here is a subtitle for this table"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <div>
                     <Table striped hover>
                      <thead>
                        <tr>
                          {thArray.map((prop, key) => {
                            return <th key={key}>{prop}</th>;
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.files.map((prop, key) => {
                          if (prop.key !== "" && prop.key !== "to_be_classified/") {
                          var string = prop.key
                          
                          if (prop.key !== "" && !(string.includes("/"))) {
                            console.log(prop.key)
                            return (
                              <tr key={key}>
                                <td>{prop.key}</td>
                                <td>{prop.size}</td>
                                <td key={key}>{prop.lastModified.toString()}</td>
                                <td><button onClick={(e) => this.handleDeleteClick(prop.key)}>Delete</button></td>
                                <td><button onClick={(e) => this.handleDownloadClick(prop.key)}>Download</button></td>
                              </tr>
                            );
                          }else if(string.includes("/")){

                          }else{
                            console.log(prop.key)
                            return(
                              null
                            );
                          }
                        })}
                      </tbody>
                    </Table> 
              />"Name","File Size","Last Modified","Delete","Download"*/}
              <MaterialTable 
                columns={[
                  { title: 'Name', field: 'name' },
                  { title: 'File Size', field: 'filesize' },
                  { title: 'Last Modified', field: 'lastmodified' },
                  
                ]}
                data={this.convertArray(this.state.files)}
                title="S3Bucket"
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default TableList;
