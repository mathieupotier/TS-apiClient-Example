import React from 'react'
import {ClientInterface} from "../api/Client";
import {GetItemsApiResponse, GetUsersApiResponse} from "../api/responses";

type Props = {
    getClient: () => ClientInterface
}
type State = {
    values: {
        id: string
        value: string
    }
}

export default class ApiCapable extends React.Component<Props, State> {

    constructor(props: Readonly<Props> | Props) {
        super(props);
        this.state = {
            userResponse: null
        }
    }

    componentDidMount(): void {
        this.props.getClient().getAllItems()
            .then((response: GetItemsApiResponse) => {
                this.setState({
                    ...this.state,
                    values: response.map(item => {
                        return {
                            id: item.id,
                            value: item.name
                        }
                    })
                })
            })
    }

    render(): React.ReactNode
    {
        return null
    }
}