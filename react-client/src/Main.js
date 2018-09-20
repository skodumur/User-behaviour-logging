import React, { Component } from "react";
import moment from "moment";
import "./Main.css";
import { Form, Input, TextArea, Button, Accordion, Icon } from 'semantic-ui-react'
import Axios from "axios";
import _ from 'lodash';
import UserLogs from './UserLogs';
import 'bootstrap/dist/css/bootstrap.min.css';
import Plot from 'react-plotly.js';

class Main extends Component {
    CONSTANTS = {
        'UPVOTE': 'upvotes',
        'DOWNVOTE': 'downvotes'
    }
    state = { activeIndex: -1, allPosts: [], newTitle: '', newContent: '', clickData: {}, viewData: {}, activeId: false };
    logs = [];
    lastTime ;
    handleClick = (e, titleProps) => {
        const { index } = titleProps;
        const { activeIndex } = this.state;
        if (index !== activeIndex && activeIndex >= 0) {
            this.logs.push({
                type: "view",
                time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                owner: this.props.user,
                value: Math.ceil((Date.now() - this.lastTime)/1000),
                question: this.state.allPosts[activeIndex].id 
            });
        }
        const newIndex = activeIndex === index ? -1 : index;
        this.setState({ activeIndex: newIndex });
        this.logs.push({
            type: "click",
            time: moment().format('MMMM Do YYYY, h:mm:ss a'),
            owner: this.props.user,
            value: 0,
            question: this.state.allPosts[index].id
        });
    };
    handleVote = (e) => {
        const question = +e.target.getAttribute('idval');
        const type = (e.target.className.indexOf('down') > -1) ? this.CONSTANTS.DOWNVOTE : this.CONSTANTS.UPVOTE;
        e.target.className = e.target.className + ' disabled';
        let curPost = this.state.allPosts[question-1];
        this.logs.push({
            type: type,
            time: moment().format('MMMM Do YYYY, h:mm:ss a'),
            owner: this.props.user,
            value: 0,
            question: question
        });
        if (type === this.CONSTANTS.UPVOTE) {
            curPost[this.CONSTANTS.UPVOTE]++
        } else {
            curPost[this.CONSTANTS.DOWNVOTE]++
        }
        this.updatePost(curPost);
        this.setState({allPosts: this.state.allPosts})
    }
    updatePost = (postObj) => {
        Axios.put(`http://localhost:3001/posts`, postObj)
            .then((res) => {
                let click = {}, view = {};
                _.forEach(res.data.logs, (log) => {
                    if (log.type === 'click') {
                        if (click[log.question]) {
                            click[log.question]++
                        } else {
                            click[log.question] = 1;
                        }
                    } else if (log.type === 'view') {
                        if (view[log.question]) {
                            view[log.question] += +log.value;
                        } else {
                            view[log.question] = +log.value;
                        }
                    }
                })
                this.setState({ clickData: click });
                this.setState({ viewData: view });
            })
            .catch((error) => {
                console.log(error);
            })
    }
    createPost = (e) => {
        e.preventDefault();
        if (this.state.newTitle !== '' && this.state.newContent !== '' ) {
          var postObj = {
            "title":this.state.newTitle,
            "content":this.state.newContent,
            "author":this.props.user,
            "date":moment().format('MMMM Do YYYY, h:mm:ss a'),
            "upvotes":0,
            "downvotes":0
        };
        Axios.post(`http://localhost:3001/posts`, postObj)
        .then((res) => {
            this.setState({newTitle: '', newContent: ''});
            this.getAllPosts();
        })
        .catch((error) => {
            console.log(error);
        })
        }

    }
    debounced = _.debounce(this.refresh, 500, { 'maxWait': 1000 });
    refresh() {
        Axios.get(`http://localhost:3001/events/user/${this.props.user}`)
            .then((res) => {
                let click = {}, view = {};
                _.forEach(res.data.logs, (log) => {
                    if (log.type === 'click') {
                        if (click[log.question]) {
                            click[log.question]++
                        } else {
                            click[log.question] = 1;
                        }
                    } else if (log.type === 'view') {
                        if (view[log.question]) {
                            view[log.question] += +log.value;
                        } else {
                            view[log.question] = +log.value;
                        }
                    }
                })
                this.setState({ clickData: click });
                this.setState({ viewData: view });
            })
            .catch((error) => {
                console.log(error);
            })
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
                        this.debounced();
                        console.log("success :", response.data);
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
        }, 1000);
        this.refresh();
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
            <div className="col-12 main-div row">
                <div className="col-5">
                    <div className="new-post">
                        {/* <Form>
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
                        </Form> */}
                        <Form>
                            <Form.Field>
                                <label>Title</label>
                                <input placeholder='First Name' value={this.state.newTitle} onBlur={(e) => this.setState({ newTitle: e.target.value })}/>
                            </Form.Field>
                            <Form.Field>
                                <label>Decription</label>
                                <textarea placeholder='Last Name' value={this.state.newContent} onBlur={(e) => this.setState({ newContent: e.target.value })} />
                            </Form.Field>
                            <Button onClick={this.createPost}>Post</Button>
                        </Form>
                    </div>
                    <div className="accord-div">
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
                                            <label dangerouslySetInnerHTML={{ __html: allPosts[index].title }}></label>
                                        </Accordion.Title>
                                        <Accordion.Content active={activeIndex === index}>
                                            <p dangerouslySetInnerHTML={{ __html: allPosts[index].content }}></p>
                                            <Icon className="thumb-icon" idval={allPosts[index].id} size='large' name='thumbs up outline' onClick={this.handleVote}/>
                                            <label>{allPosts[index].upvotes}</label>
                                            <Icon className="thumb-icon" idval={allPosts[index].id} size='large' name='thumbs down outline'  onClick={this.handleVote}/>
                                            <label>{allPosts[index].downvotes}</label>
                                        </Accordion.Content>
                                    </div>
                                );
                            })}
                        </Accordion>
                    </div>
                </div>
                <div className="col-7">
                    <UserLogs user={this.props.user}></UserLogs>
                    <div className="chart-div">
                        <div>
                            <Plot
                                data={[{ type: 'bar', x: _.keys(this.state.clickData), y: _.values(this.state.clickData) }]}
                                layout={{ title: 'Number of clicks for each question' }}
                            />
                        </div>
                        <div>
                            <Plot
                                data={[{ x: _.keys(this.state.viewData), y: _.values(this.state.viewData) }]}
                                layout={{ title: 'Time for which each question is viewed' }}
                            />
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default Main;
