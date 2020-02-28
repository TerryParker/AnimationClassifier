import React, { Component } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";

import Card from "../components/Card/Card.jsx";
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
    .then(result => {console.log(result); this.setState({files: result})})
    .catch(err => console.log(err));

  }
  render() {
    return (
      <div className="content">
        <Container fluid>
          <Row>
            <Col md={12}>
              <Card
                title="S3 Bucket"
                category="Here is a subtitle for this table"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <div>
                  <a href="/admin/table" style={{position: 'absolute', right: '50px'}} className="pe-7s-refresh-2">  Refresh</a>
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
                        console.log(prop.key)
                        return (
                          <tr key={key}>
                            <td>{prop.key}</td>
                            <td>{prop.size}</td>
                            <td key={key}>{prop.lastModified.toString()}</td>
                          </tr>
                        );
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
