import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  FormGroup
} from "react-bootstrap";
import { Card } from "../components/Card/Card.jsx";
import Button from "../components/CustomButton/CustomButton.jsx";
import Amplify, { Storage } from 'aws-amplify';
import awsconfig from '../aws-exports';

Amplify.configure(awsconfig);




class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {files: []};
  }
  onChange(e) {
      //Updates state once files are received
      const filesReceived = e.target.files;
      this.setState({files: filesReceived})
      console.log(filesReceived)
  }

  handleClick() {
      //Uploads files once "Update" button is clicked
      var files = this.state.files
      //Loops through all files in file state
      console.log(files)
      for (var i = 0; i < files.length; i++) {
          console.log(files[i]);
          //This command puts the file into the S3 bucket 
          Storage.put('file'+i+'.png', files[i])
          .then (result => console.log(result))
          .catch(err => console.log(err)); 
      }
  }
  render() {
    return (
      <div className="content">
        <Container fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Edit Profile"
                content={
                  <form>
                    <Row>
                      <Col md={12}>
                        <FormGroup controlId="formControlsTextarea">
                        <input
                            type="file"
                            multiple
                            onChange={(e) => this.onChange(e)}
                        />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Button bsStyle="info" pullRight fill onClick={(e)=>this.handleClick(e)}>
                      Upload File
                    </Button>
                    <div className="clearfix" />
                  </form>
                }
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Upload;