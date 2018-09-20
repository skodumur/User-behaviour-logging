import React, { Component } from 'react';
import Axios from 'axios';
import { Table, Accordion, Icon } from 'semantic-ui-react'

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
        return (
            <div>
                <Accordion fluid styled>
                    <Accordion.Title active={activeId} index={0} onClick={this.handleLogs}>
                        <Icon name='dropdown' />
                        User logged in logs
            </Accordion.Title>
                    <Accordion.Content active={activeId}>
                        <Table celled padded>
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
                    </Accordion.Content>
                </Accordion>
            </div>
        )
    }
}

export default UserLogs;
