import React, { Component } from "react";
import logo from "./logo.svg";
import "./Main.css";
import { Accordion, Icon } from "semantic-ui-react";
import { Form, Input, TextArea, Button } from 'semantic-ui-react'
import Axios from "axios";

class Main extends Component {
    state = { activeIndex: 0, allPosts: [] };

    handleClick = (e, titleProps) => {
        const { index } = titleProps;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({ activeIndex: newIndex });
    };
    componentDidMount(){
        this.getAllPosts();
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
        let data = [{"title": "dqawdqw", "content": "qaswdqwd"}, {"title": "sssss", "content": "eeeeeee"}];
        let data2 = [];
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
                                        onClick={this.handleClick}
                                    >
                                        <Icon name="dropdown" />
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
                                label='Question'
                                placeholder='Title for the post'
                            />
                        </Form.Group>
                        <Form.Field
                            id='form-textarea-control-opinion'
                            control={TextArea}
                            label='Content'
                            placeholder='Description of the post'
                        />
                        <Form.Field
                            id='form-button-control-public'
                            control={Button}
                            content='Post'
                        />
                    </Form>
                </div>
            </div>
        );
    }
}

export default Main;
