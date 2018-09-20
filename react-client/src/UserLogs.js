import React, { Component } from 'react';
import Axios from 'axios';
import './UserLogs.css'
import { Table, Button, Header, Modal } from 'semantic-ui-react'

class UserLogs extends Component {
    state = { logs: [] };
    getAllUsers = () => {
        Axios.get(`http://localhost:3001/users/logs/${this.props.user}`)
            .then((response) => {
                this.setState({ logs: response.data });
            })
            .catch((error) => {
                console.log(error);
            })
    }

    componentDidMount = () => {
        this.getAllUsers();
    }
    render() {
        const { logs } = this.state;
        return (<div>

            <Modal open={this.props.openFlag} size="large" className="my-modal">
                <Modal.Header>User Profile</Modal.Header>
                <Modal.Content scrolling>
                    <Modal.Description>
                        <Header>Loggedin User: {this.props.user}</Header>
                        <div className="col-12 row">
                            <div className="col-4">
                            <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>No.</Table.HeaderCell>
                                    <Table.HeaderCell>Login Time</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {logs.map((name, index) => {
                                    return (
                                        <Table.Row key={index}>
                                            <Table.Cell>
                                                {index + 1}
                                            </Table.Cell>
                                            <Table.Cell>{logs[index].time}</Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table>
                            </div>
                            <div className="col-8">
                            <p className="h5">Logged actions and reasons</p>
                            <p>
                            The user events logged are hits on a question, time spent on a question, upvote, downvote, and posts created.
                            </p>
                            <ul>
                                <li>
                                The amount of time spent on each question will help us understand the usefulness of the question and further,
                             when questions are categorized, we can understand user's interests in a category of questions. 
                                </li>
                                <li>
                                All the other statistics of the user like the number of questions posted will help us analyze how often a particular
                             user is active on a website on a given date or interval.  
                                </li>
                                <li>
                                The number of likes/dislikes will help us analyze how well a user is opinionated and willing to give feedback.
                                </li>
                            </ul>
                            <p className="h5">Findings</p>
                            <ul>
                                <li>From the visualizations, it is evident that the user spent more time({this.props.maxData.maxView} Secs) on question {this.props.maxData.maxViewQuestion} which implies that question is not very easily understandable to the user</li>
                                <li>Another observation is the user posted most number({this.props.maxData.maxDateQuestion}) of questions on {this.props.maxData.maxDate} which implies that user is more active on that specific day</li>
                                <li>Finally, we can notice the user clicked most times({this.props.maxData.maxClick}) on question {this.props.maxData.maxClickQuestion} which implies that he/she faced the same problem many and times and so reverted back to the same  </li>
                            </ul>
                            <p className="h5">Steps to find results</p>
                            <p>
                            Upon looking at data points, I have noticed few data points much deviate from average values which mean that particular data point has some valuable information.
                             Then dig more on to data point to extract that valuable information, then mentioned those findings above.
                            </p>
                            </div>
                        </div>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button primary onClick={this.props.closeFn}>
                        Close
                </Button>
                </Modal.Actions>
            </Modal>
        </div> )
    }
}

export default UserLogs;
