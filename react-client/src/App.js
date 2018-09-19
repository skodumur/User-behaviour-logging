import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Axios from 'axios';
import Main from '../src/Main';
import { Button, Form } from 'semantic-ui-react'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      user: '',
      pass: '',
      allname: []
    };
    this.handleClick = this.handleClick.bind(this);

  }

  async getAllUsers() {
    try {
      const getResponse = await Axios.get(`http://localhost:3001/users`);
      console.log(getResponse);
      this.setState({ allname: getResponse.data.users });
    }
    catch (error) {
      console.log(error);
    }
  }
  async handleClick(e) {
    e.preventDefault();
    if (this.state.user !== '') {
      var userObj = {
        name: this.state.user,
        pass: this.state.pass
      };
      try {
        const response = await Axios.post(`http://localhost:3001/users/login`, userObj);
        if (response.data && response.data.response) {
          this.setState({ isLoggedIn: userObj.name });
      }
      }
      catch (error) {
        console.log(error);
      }
    }

  }
  render() {
    console.log(this.state.isLoggedIn);
    if (this.state.isLoggedIn) {
    return (
      <div className="App">
        <header className="App-header">
            <h1 className="App-title">CSE 591 Topic: Adaptive Web </h1>
            <h1 className="App-title">Please login to continue :) </h1>
        </header>
          <Form className="login-form">
            <Form.Field>
              <label>User Name</label>
              <input placeholder='User Name' type="text" value={this.state.user} onChange={(e) => this.setState({ user: e.target.value })} />
            </Form.Field>
            <Form.Field>
              <label>Password </label>
              <input placeholder='Password' type="password" value={this.state.pass} onChange={(e) => this.setState({ pass: e.target.value })} />
            </Form.Field>
            <Button onClick={this.handleClick} >Submit</Button>
          </Form>
        </div>)
    } else {
      return (<Main></Main>)
    }
  }
}

export default App;
