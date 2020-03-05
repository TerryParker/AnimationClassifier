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
import * as uuid from 'uuid';
import UploadFileDrop from '../components/FileDrop/FileDrop';

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
      filesClassification: [],
      inputDisabled: false
    };
  }
  onFileChange(e) {
    //Updates state once files are received
    const filesReceived = e.target.files;
    this.setState({files: filesReceived})
  }
  onFileDropChange(e) {
    console.log(e)
    this.setState({files: e})
  }
  handleClick() {
      //Uploads files once "Update" button is clicked
      var files = this.state.files
      //Loops through all files in file statey
      for (let i = 0; i < files.length; i++) {
          //This command puts the file into the S3 bucket
          trackPromise( 
            Storage.put('to_be_classified/'+uuid.v4()+'.png', files[i])
            .then (result => {
              //Post result.key to lambda 
              trackPromise(
              axios.post('https://mnh5jsx02i.execute-api.us-east-2.amazonaws.com/dev/S3ImageRek', {'body':result.key}).then(response => {
                var name = response['data']['body']['Label'][0]['Name']
                var confidence = response['data']['body']['Label'][0]['Confidence']
                var permFileName = name + '.png'
                this.moveClassifiedImage({"tempFileName": result.key, "oldFileID": i, "permFileName": permFileName});
                this.setState({filesClassification: [...this.state.filesClassification, {"OldFileName": files[i].name, "FileName": permFileName, "Name": name, "Confidence": confidence}], inputDisabled: true});
                
              }).catch(error => {
                console.log(error.response)
              })
              )
            })
            .catch(err => console.log(err)) 
          );
      }
  }
  moveClassifiedImage(props){
    Storage.put(props.permFileName, this.state.files[props.oldFileID])
    .then(result => {
    })
    .catch(err => console.log(err));

    Storage.remove(props.tempFileName)
    .then(result => {
    })
    .catch(err => console.log(err))
  }

  clear(){
    window.location.reload(false);
  }

  render() {
    var files = this.state.files
    var fileArray = [];
    //Loops through all files in file statey
    for (let i = 0; i < files.length; i++) {
      //console.log(files[i].name)
      fileArray = fileArray.concat(files[i].name)
    }
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
                            onChange={(e) => this.onFileChange(e)}
                            disabled = {(this.state.inputDisabled)? "disabled" : ""}
                        />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>OR</Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <UploadFileDrop fileDropCallback = {(e) => this.onFileDropChange(e)} />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        Received:
                        <ul>
                          {
                          fileArray.map((item,key) => {
                            return(<li key={"received "+key}>{item}</li>)
                          })
                          }
                        </ul>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={3}>
                        <LoadingIndicator/>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        Results:
                        <ul>
                          {
                          this.state.filesClassification.map((item, key) => {
                            return(<li key={"results "+key}>{item.OldFileName} is {item.Name} with a confidence level of {item.Confidence}. Changed file name to {item.FileName}</li>)
                          })
                          }
                        </ul>
                      </Col>
                    </Row>
                    <Button bsstyle="info" pullRight fill onClick={(e)=>this.handleClick(e)}>
                      Upload File
                    </Button>
                    <br></br>
                    <Button bsstyle="info" fill onClick={(e)=>this.clear(e)}>
                      Clear
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