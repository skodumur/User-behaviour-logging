import React, { Component } from "react";
import moment from "moment";
import "./Main.css";
import { Accordion, Icon } from "semantic-ui-react";
import { Form, Input, TextArea, Button } from 'semantic-ui-react'
import Axios from "axios";
import _ from 'lodash';

class Main extends Component {
    state = { activeIndex: 0, allPosts: [], newTitle: '', newContent: '' };
    logs = [];
    lastTime ;
    handleClick = (e, titleProps) => {
        const { index } = titleProps;
        const { activeIndex } = this.state;
        if (!activeIndex || index != activeIndex) {
            this.logs.push({
                type: "view",
                time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                owner: this.props.user,
                value: Date.now() - this.lastTime,
                question: activeIndex || 1
            });
        }
        const newIndex = activeIndex === index ? -1 : index;
        this.setState({ activeIndex: newIndex });
        this.logs.push({
            type: "click",
            time: moment().format('MMMM Do YYYY, h:mm:ss a'),
            owner: this.props.user,
            value: 0,
            question: index
        });
    };
    async createPost(e) {
        e.preventDefault();
        // if (this.state.newTitle !== '' && this.state.newContent !== '' ) {
        //   var postObj = {
        //     "title":this.state.title,
        //     "content":this.state.content,
        //     "author":this.props.user,
        //     "date":moment().format('MMMM Do YYYY, h:mm:ss a'),
        //     "upvotes":1,
        //     "downvotes":0
        // };
        //   try {
        //     const response = await Axios.post(`http://localhost:3001/users/login`, userObj);
        //     if (response.data && response.data.response) {
        //       this.setState({ isLoggedIn: userObj.name });
        //   }
        //   }
        //   catch (error) {
        //     console.log(error);
        //   }
        // }
    
      }
    componentDidMount() {
        this.lastTime = Date.now();
        this.getAllPosts();
        setInterval(() => {
            if (this.logs.length) {
                console.log(this.logs);
                let arr = _.clone(this.logs);
                this.logs = [];
                Axios.post(`http://localhost:3001/events/`, arr)
                    .then((response) => {
                        console.log("success :", response.data);
                    })
                    .catch((error) =>  {
                        console.log(error);
                    })
            }
        }, 3000)
    }
      async getAllPosts() {
        try {
          const getResponse = await Axios.get(`http://localhost:3001/posts`);
          this.setState({ allPosts: getResponse.data.posts });
        }
        catch (error) {
          console.log(error);
        }
      }
    render() {
        const { activeIndex, allPosts } = this.state;
        return (
            <div>
                <div className="accordion-div">
                    <Accordion styled>
                        {allPosts.map((name, index) => {
                            return (
                                <div key={index}>
                                    <Accordion.Title
                                        active={activeIndex === index}
                                        index={index}
                                        onClick={this.handleClick}>
                                        <Icon name="dropdown" />
                                        <label>{allPosts[index].id}. </label>
                                        <label dangerouslySetInnerHTML={{__html: allPosts[index].title}}></label>
                                    </Accordion.Title>
                                    <Accordion.Content active={activeIndex === index}>
                                    <p dangerouslySetInnerHTML={{__html: allPosts[index].content}}></p>
                                    </Accordion.Content>
                                </div>
                            );
                        })}
                    </Accordion>
                </div>
                <div className="new-post">
                    <Form>
                        <Form.Group widths='equal'>
                            <Form.Field
                                id='form-input-control-first-name'
                                control={Input}
                                onChange={(e) => this.setState({ newTitle: e.target.value })}
                                label='Question'
                                placeholder='Title for the post'
                            />
                        </Form.Group>
                        <Form.Field
                            id='form-textarea-control-opinion'
                            control={TextArea}
                            onChange={(e) => this.setState({ newContent: e.target.value })}
                            label='Content'
                            placeholder='Description of the post'
                        />
                        <Form.Field
                            id='form-button-control-public'
                            control={Button}
                            onClick={this.createPost}
                            content='Post'
                        />
                    </Form>
                </div>
            </div>
        );
    }
}

export default Main;
