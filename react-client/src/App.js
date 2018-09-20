import React, { Component } from 'react';
import './App.css';
import Axios from 'axios';
import Main from '../src/Main';
import moment from 'moment';
import { Button, Form, Modal, Header } from 'semantic-ui-react'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      loggerInUser: '',
      user: '',
      pass: '',
      newName:'',
      newPass:'',
      newCPass:'',
      allname: []
    };
    this.handleClick = this.handleClick.bind(this);

  }
  open = () => this.setState({ modalOpen: true })
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
  componentWillMount() {
    let user = sessionStorage.getItem('user');
    if (user) {
      this.setState({loggerInUser: user});
    }
  }
  async handleClick(e) {
    e.preventDefault();
    if (this.state.user !== '') {
      var userObj = {
        name: this.state.user,
        pass: this.state.pass,
        time: moment().format('MMMM Do YYYY, h:mm:ss a')
      };
      try {
        const response = await Axios.post(`http://localhost:3001/users/login`, userObj);
        if (response.data && response.data.response) {
          this.setState({ loggerInUser: userObj.name });
          sessionStorage.setItem('user', userObj.name);
      }
      }
      catch (error) {
        console.log(error);
      }
    }

  }
  handleLogout = () => {
    sessionStorage.clear();
    this.setState({loggerInUser: ''});
  }
  handleRegister = async () => {
    if(this.state.newPass === this.state.newCPass) {
      let newUser = {
        'name': this.state.newName,
        'pass': this.state.newPass
      }
      Axios.post(`http://localhost:3001/users`, newUser)
      .then((res) => {
        this.setState({ modalOpen: false })
      })
      .catch((error) => {
        console.log(error)
      })


    }
  }
  render() {
    const {modalOpen} = this.state;
    if (!this.state.loggerInUser) {
      return (
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">CSE 591 Topic: Adaptive Web </h1>
            <h1 className="App-title">Please login to continue :) </h1>
          </header>
          <Form className="login-form">
            <Form.Field required>
              <label>User Name</label>
              <input placeholder='User Name' type="text" onChange={(e) => this.setState({ user: e.target.value })} />
            </Form.Field>
            <Form.Field required>
              <label>Password </label>
              <input placeholder='Password' type="password" onChange={(e) => this.setState({ pass: e.target.value })} />
            </Form.Field>
            <Button primary onClick={this.handleClick} >Login</Button>
          </Form>
          <br></br>
          <span>- OR -</span>
          <br></br>
          <Button secondary onClick={this.open} className="register-btn">Register</Button>
          <Modal centered={false} open={modalOpen}>
            <Modal.Header>Select a Photo</Modal.Header>
            <Modal.Content >
              <Modal.Description>
                <Header>Default Profile Image</Header>
                <Form>
                  <Form.Field required>
                    <label>User Name</label>
                    <input placeholder='User Name' type="text" onChange={(e) => this.setState({ newName: e.target.value })}/>
                  </Form.Field>
                  <Form.Field required>
                    <label>Password</label>
                    <input placeholder='Password' type="password" onChange={(e) => this.setState({ newPass: e.target.value })}/>
                  </Form.Field>
                  <Form.Field required>
                  <label>Confirm Password</label>
                    <input placeholder='Confirm password' type="password" onChange={(e) => this.setState({ newCPass: e.target.value })}/>
                  </Form.Field>
                  <Button primary onClick={this.handleRegister} >Register</Button>
                </Form>
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </div>)
    } else {
      return (<Main user={this.state.loggerInUser} logout={this.handleLogout.bind(this)}></Main>)
    }
  }
}

export default App;
