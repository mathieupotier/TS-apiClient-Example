import React from 'react';
import {render} from 'react-dom';

import {Client, ClientInterface} from "./api/Client";
import ApiCapable from "./component/apiCapable";

const rootElement = document.getElementById("root");

function getApiClient(): ClientInterface
{
	return new Client({
		getAllItems: '/items',
		getAllValidItems: '/valid-items',
		getUserById: '/users/##USER_ID##',
		getItemById: '/items/##ITEM_ID##',
		getAllUsers: '/users'
	})
}

if (rootElement) {
	render(
		<React.Fragment>
			<ApiCapable getClient={getApiClient} />
		</React.Fragment>,
		rootElement
	);
}