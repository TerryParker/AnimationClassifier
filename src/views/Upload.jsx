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
    <Loader type="ThreeDots" color="black" height="100" width="100" />
  );  
}

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      filesUploadedSuccesful: []
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
              //console.log(result);
              this.setState({filesUploadedSuccesful: this.state.filesUploadedSuccesful.concat(result.key)});
              //Post result.key to lambda 
              var key = { "name": result.key}
              console.log(key)
              axios({
                method: 'post',
                url: 'https://mnh5jsx02i.execute-api.us-east-2.amazonaws.com/dev/S3ImageRek',
                crossdomain: true,
                headers: {
                  'Access-Control-Allow-Origin': '*',
                },
                data: key
              })
              .then((response) => {
                console.log(response);
              }, (error) => {
                console.log(error);
              });
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
                          {this.state.filesUploadedSuccesful.map((item, key) => {
                            return(<li>Succesfully Uploaded {item}</li>)
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