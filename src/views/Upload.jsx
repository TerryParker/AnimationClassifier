/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup
} from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
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
  }

  handleClick() {
      //Uploads files once "Update" button is clicked
      var files = this.state.files
      //Loops through all files in file state
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
        <Grid fluid>
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
                          {/* <FormControl
                            rows="5"
                            componentClass="textarea"
                            bsClass="form-control"
                            placeholder="Here can be your description"
                            defaultValue="Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo."
                          /> */}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Button bsStyle="info" pullRight fill type="submit" onClick={(e)=>this.handleClick(e)}>
                      Upload File
                    </Button>
                    <div className="clearfix" />
                  </form>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Upload;
