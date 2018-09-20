import React, { Component } from 'react';
import Axios from 'axios';
import './UserLogs.css'
import { Table, Accordion, Icon, Button, Header, Image, Modal } from 'semantic-ui-react'

class UserLogs extends Component {
    state = { activeId: false, logs: [] };
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
    handleLogs = () => {
        this.setState({ activeId: !this.state.activeId });
    }
    render() {
        const { activeId, logs } = this.state;
        return (<div>

            <Modal open={this.props.openFlag} size="large" className="my-modal">
                <Modal.Header>User Profile</Modal.Header>
                <Modal.Content image scrolling>
                    <Icon name="image" size='massive'></Icon>
                    <Modal.Description>
                        <Header>{this.props.user}</Header>
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Sequence</Table.HeaderCell>
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
