import {
	ErrorApiResponse,
	GetItemApiResponse,
	GetItemsApiResponse,
	GetUserApiResponse,
	GetUsersApiResponse,
} from "./responses";

export interface ClientInterface {
	getAllItems(): Promise<GetItemsApiResponse>
	getAllValidItems(): Promise<GetItemsApiResponse>
	getItemById(itemId: string): Promise<GetItemApiResponse>
	getAllUsers(): Promise<GetUsersApiResponse>
	getUserById(userId: string): Promise<GetUserApiResponse>
}

export interface ErrorInterface {
	getCode(): number
	getMessage(): string
	getType(): string
}

export class ServerError implements ErrorInterface {
	private readonly code: number
	private readonly message: string
	private readonly type: string

	constructor(code: number, message: string, type?: string) {
		this.code = code;
		this.message = message;
		if (type === undefined) {
			this.type = 'server_error'
		} else {
			this.type = type
		}
	}

	getCode(): number {
		return this.code;
	}

	getMessage(): string {
		return this.message;
	}

	getType(): string {
		return this.type;
	}
}

export class RuntimeError implements ErrorInterface {
	private readonly message: string

	constructor(message: string) {
		this.message = message;
	}

	getCode(): number {
		return 255;
	}

	getMessage(): string {
		return this.message;
	}

	getType(): string {
		return 'runtime_error';
	}
}

export class ClientError implements ErrorInterface {
	private readonly code: number
	private readonly message: string
	private readonly type: string

	constructor(code: number, message: string, type?: string) {
		this.code = code;
		this.message = message;
		if (type === undefined) {
			this.type = 'client_error'
		} else {
			this.type = type
		}
	}

	getCode(): number {
		return this.code;
	}

	getMessage(): string {
		return this.message;
	}

	getType(): string {
		return this.type;
	}
}

type Endpoints = {
	getAllItems: string
	getAllValidItems: string
	getItemById: string
	getAllUsers: string
	getUserById: string
}

export  class Client implements ClientInterface {
	private readonly endpoints: Endpoints

	public constructor(endpoints: Endpoints) {
		this.endpoints = endpoints;
	}

	private executeRequest<Type>(request: Request): Promise<Type>
	{
		return new Promise<Type>((resolve, reject) => {
			fetch(request, {})
				.then((response: Response) => {
					if (response.status >= 500) {
						response.json()
							.then(responseData => {
								const errorApiResponse = responseData as ErrorApiResponse
								reject(new ServerError(response.status, errorApiResponse.message, errorApiResponse.type))
							}).catch(() => {
								reject(new ServerError(response.status, response.statusText))
							})
					} else if (response.status >= 400) {
						response.json()
							.then(responseData => {
								const errorApiResponse = responseData as ErrorApiResponse
								reject(new ClientError(response.status, errorApiResponse.message, errorApiResponse.type))
							}).catch(() => {
								reject(new ClientError(response.status, response.statusText))
							})
					} else {
						if (response.status === 204) {
							resolve({} as Type)
						} else {
							response.json()
								.then(responseData => {
									resolve(responseData as Type)
								}).catch(error => {
									reject(new RuntimeError(error.message))
								})
						}
					}
				})
				.catch((error: Error) => {
					reject(new RuntimeError(error.message))
				})
		})
	}

	getAllItems(): Promise<GetItemsApiResponse> {
		const headers = new Headers({
			'Accept': 'application/json'
		})
		const request = new Request(
			this.endpoints.getAllItems,
			{
				method: 'GET',
				headers: headers,
			}
		)
		return this.executeRequest<GetItemsApiResponse>(request);
	}

	getAllUsers(): Promise<GetUsersApiResponse> {
		const headers = new Headers({
			'Accept': 'application/json'
		})
		const request = new Request(
			this.endpoints.getAllUsers,
			{
				method: 'GET',
				headers: headers,
			}
		)
		return this.executeRequest<GetUsersApiResponse>(request);
	}

	getAllValidItems(): Promise<GetItemsApiResponse> {
		const headers = new Headers({
			'Accept': 'application/json'
		})
		const request = new Request(
			this.endpoints.getAllValidItems,
			{
				method: 'GET',
				headers: headers,
			}
		)
		return this.executeRequest<GetItemsApiResponse>(request);
	}

	getItemById(itemId: string): Promise<GetItemApiResponse> {
		const headers = new Headers({
			'Accept': 'application/json'
		})
		const request = new Request(
			this.endpoints.getItemById.replace("##ITEM_ID##", itemId),  // On remplace un element préparé au niveau du endpoint pour avoir la bonne url selon le protocole RESTful
			{
				method: 'GET',
				headers: headers,
			}
		)
		return this.executeRequest<GetItemApiResponse>(request);
	}

	getUserById(userId: string): Promise<GetUserApiResponse> {
		const headers = new Headers({
			'Accept': 'application/json'
		})
		const request = new Request(
			this.endpoints.getUserById.replace("##USER_ID##", userId), // On remplace un element préparé au niveau du endpoint pour avoir la bonne url selon le protocole RESTful
			{
				method: 'GET',
				headers: headers,
			}
		)
		return this.executeRequest<GetUserApiResponse>(request);
	}
}
