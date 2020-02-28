import React from 'react';
import Amplify, { Storage } from 'aws-amplify';
import awsconfig from '../aws-exports';

Amplify.configure(awsconfig);



class S3ImageUpload extends React.Component {
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
            <div>
                <input
                    type="file"
                    onChange={(e) => this.onChange(e)}
                    multiple
                />
                <button onClick={(e)=>this.handleClick(e)}>Update</button>
            </div>
            
        )
    }
  }
  export default S3ImageUpload;