import React from 'react';
import logo from './logo.svg';
import './App.css';
import Amplify from 'aws-amplify';
import S3ImageUpload from './s3Upload/S3Uploaded.js';

function App() {
  return (
    <center>
    <S3ImageUpload />
    </center>
  );
}

export default App;
