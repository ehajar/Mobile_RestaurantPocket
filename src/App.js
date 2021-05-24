import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import Qr from "./components/qr";
import Menu from "./components/Menu";

const App = () => {
  return (
    <Router>
      <Route path="/qr" component={Qr} />
      <Route path="/menu" component={Menu} />
    </Router>
  );
};

export default App;
