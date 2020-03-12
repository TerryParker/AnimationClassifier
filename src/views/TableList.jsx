import React, { Component } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";

import TableCard from "../components/Card/TableCard.jsx";
import { thArray } from "../variables/Variables.jsx";
import Amplify, { Storage } from 'aws-amplify';
import awsconfig from '../aws-exports';

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
  render() {
    return (
      <div className="content">
        <Container fluid>
          <Row>
            <Col md={12}>
              <TableCard
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
                          }else{
                            console.log(prop.key)
                            return(
                              null
                            );
                          }
                        })}
                      </tbody>
                    </Table>
                  </div>
                }
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default TableList;
