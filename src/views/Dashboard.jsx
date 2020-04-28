import React, { Component } from "react";
import { Container } from "react-bootstrap";
import StatsCard from "../components/StatsCard/StatsCard"

class Dashboard extends Component {
  render() {
    return (
      <div className="content">
        <Container fluid>
        <StatsCard />
    
        </Container>
      </div>
    );
  }
}

export default Dashboard;
