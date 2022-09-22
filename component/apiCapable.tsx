import React from 'react'

import {ClientInterface} from "../api/Client";
import {GetUsersApiResponse} from "../api/responses";

import User from "../entity/user";

type Props = {
    getClient: () => ClientInterface
}
type State = {
    values: User[]
}

export default class ApiCapable extends React.Component<Props, State> {

    constructor(props: Readonly<Props> | Props) {
        super(props);
        this.state = {
            values: []
        }
    }

    componentDidMount(): void {
        this.props.getClient().getAllUsers()
            .then((response: GetUsersApiResponse) => {
                this.setState({
                    ...this.state,
                    values: response.map(user => User.fromResponse(user))
                })
            })
    }

    render(): React.ReactNode
    {
        return null
    }
}