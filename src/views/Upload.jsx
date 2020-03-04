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
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import Loader from 'react-loader-spinner';
import axios from 'axios';

Amplify.configure(awsconfig);

const LoadingIndicator = props => {
  const { promiseInProgress } = usePromiseTracker();
  
  return (
    promiseInProgress && 
    <Loader type="ThreeDots" color="black" height={100} width={100} />
  );  
}

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      filesClassification: []
    };
  }
  onChange(e) {
      //Updates state once files are received
      const filesReceived = e.target.files;
      this.setState({files: filesReceived})
  }

  handleClick() {
      //Uploads files once "Update" button is clicked
      var files = this.state.files
      //Loops through all files in file statey
      for (var i = 0; i < files.length; i++) {
          console.log(files[i]);
          //This command puts the file into the S3 bucket
          trackPromise( 
            Storage.put('file'+i+'.png', files[i])
            .then (result => {
              //Post result.key to lambda 
              axios.post('https://mnh5jsx02i.execute-api.us-east-2.amazonaws.com/dev/S3ImageRek', {'body':result.key}).then(response => {
                console.log(response['data']['body']['Label'][0])
                var name = response['data']['body']['Label'][0]['Name']
                var confidence = response['data']['body']['Label'][0]['Confidence']
                this.setState({filesClassification: [...this.state.filesClassification, {"FileName": result.key, "Name": name, "Confidence": confidence}]});
              }).catch(error => {
                console.log(error.response)
              })
            })
            .catch(err => console.log(err)) 
          );
      }
  }
  render() {
    return (
      <div className="content">
        <Container fluid>
          <Row>
            <Col md={12}>
              <Card
                content={
                  <form>
                    <Row>
                      <Col md={6}>
                        <FormGroup controlId="formControlsTextarea">
                        <input
                            type="file"
                            multiple
                            onChange={(e) => this.onChange(e)}
                        />
                        </FormGroup>
                        <ul>
                          {console.log(this.state.filesClassification)}
                          {this.state.filesClassification.map((item, key) => {
                            return(<li key={key}>{item.FileName} is {item.Name} with a confidence level of {item.Confidence}</li>)
                          })}
                        </ul>
                      </Col>
                      <Col md={3}>
                        <LoadingIndicator/>
                      </Col>
                    </Row>
                    <Button bsstyle="info" pullRight fill onClick={(e)=>this.handleClick(e)}>
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