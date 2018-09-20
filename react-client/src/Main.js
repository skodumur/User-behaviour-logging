import React, { Component } from "react";
import moment from "moment";
import "./Main.css";
import { Accordion, Icon, Button } from 'semantic-ui-react'
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
    state = { open: false, activeIndex: -1, allPosts: [], newTitle: '', newContent: '', clickData: {}, viewData: {}, postData: {}, activeId: false };
    logs = [];
    lastTime ;
    handleClick = (e, titleProps) => {
        const { index } = titleProps;
        const { activeIndex } = this.state;
        const newIndex = activeIndex === index ? -1 : index;
        if (index !== activeIndex && activeIndex > -1) {
            this.logs.push({
                type: "view",
                time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                owner: this.props.user,
                value: Math.ceil((Date.now() - this.lastTime)/1000),
                question: this.state.allPosts[activeIndex].id 
            });

        }
        this.logs.push({
            type: "click",
            time: moment().format('MMMM Do YYYY, h:mm:ss a'),
            owner: this.props.user,
            value: 0,
            question: this.state.allPosts[index].id
        });
        this.debouncedUpload();
        this.setState({ activeIndex: newIndex });
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
                console.log(res.data);
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
            this.logs.push({
                type: 'post',
                time: moment().format('MMMM Do YYYY, h:mm:ss a'),
                owner: this.props.user,
                value: 0,
                question: res.data.post.id
            })
            this.setState({newTitle: '', newContent: ''});
            this.getAllPosts();
            this.debouncedUpload();
        })
        .catch((error) => {
            console.log(error);
        })
        }

    }
    handleLogout = () => {
        this.props.logout();
    }
    debounced = _.debounce(this.refresh, 500, { 'maxWait': 1000 });
    debouncedUpload = _.debounce(this.uploadLogs, 500, { 'maxWait': 1000 });
    refresh() {
        Axios.get(`http://localhost:3001/events/user/${this.props.user}`)
            .then((res) => {
                let click = {}, view = {}, post={};
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
                    } else if(log.type === 'post') {
                        let date = moment(log.time,'MMMM Do YYYY, h:mm:ss a' ).format('MM/DD/YYYY');
                        if (post[date]) {
                            post[date]++
                        } else {
                            post[date] = 1;
                        }
                    }
                })
                this.setState({ clickData: click });
                this.setState({ viewData: view });
                this.setState({ postData: post });
            })
            .catch((error) => {
                console.log(error);
            })
    }
    uploadLogs() {
        if (this.logs.length) {
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
    }
    componentDidMount() {
        this.lastTime = Date.now();
        this.getAllPosts();
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
    show =  () => this.setState({open: true })
    close = () => this.setState({ open: false })
    render() {
        const { activeIndex, allPosts } = this.state;
        return (
            <div>
                <div>
                    <Button icon labelPosition='right' className="my-btn logout" onClick={this.handleLogout}>
                        Logout
                    <Icon name='right arrow' />
                    </Button>
                    <Button color='instagram' className="my-btn profile" onClick={this.show}>
                        <Icon name='user' /> Profile
                    </Button>
                </div>
                <div className="col-12 main-div row">

                    <div className="col-5 left-div">
                        <div className="new-post">
                            <form>
                                <div className="form-group">
                                    <label>New Post</label>
                                    <input type="text" className="form-control" value={this.state.newTitle} onChange={(e) => this.setState({ newTitle: e.target.value })} id="exampleFormControlInput1" placeholder="Title for the post" />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea className="form-control" value={this.state.newContent} onChange={(e) => this.setState({ newContent: e.target.value })} placeholder="Description for the post" rows="3"></textarea>
                                </div>
                                <button onClick={this.createPost} className="btn btn-primary mb-2">Post</button>
                            </form>
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
                                                <Icon className="thumb-icon" idval={allPosts[index].id} size='large' name='thumbs up outline' onClick={this.handleVote} />
                                                <label>{allPosts[index].upvotes}</label>
                                                <Icon className="thumb-icon" idval={allPosts[index].id} size='large' name='thumbs down outline' onClick={this.handleVote} />
                                                <label>{allPosts[index].downvotes}</label>
                                            </Accordion.Content>
                                        </div>
                                    );
                                })}
                            </Accordion>
                        </div>
                    </div>
                    <div className="col-6">
                        <UserLogs user={this.props.user} closeFn={this.close.bind(this)} openFlag={this.state.open}></UserLogs>
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
                            <div>
                                <Plot
                                    data={[{ marker: {
                                        colors: ["#76b7b2", "#ff8c00", "#1170aa", "#fc7d0b", "#a3acb9", "#57606c", "#5fa2ce", "#c85200", "#7b848f"]
                                      }, labels: _.keys(this.state.postData), values: _.values(this.state.postData), type: 'pie' }]}
                                    layout={{ title: 'Number of posts created per day' }}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        );
    }
}

export default Main;
