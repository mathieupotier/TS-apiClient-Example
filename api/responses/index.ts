
export type ErrorApiResponse = {
	type: string
	message: string
}

type ItemApiResponse = {
	id: string
	name: string
	creationDate: Date
	updateDate?: Date|null
	valid: boolean
}

type RightApiResponse = {
	name: string
	active: boolean
}
type UserApiResponse = {
	id: string
	displayName: string
	avatar: string
	email: string
	active: boolean
	token: string
	rights: RightApiResponse[]
}

export type GetItemsApiResponse = ItemApiResponse[]
export type GetItemApiResponse = ItemApiResponse
export type GetUsersApiResponse = UserApiResponse[]
export type GetUserApiResponse = UserApiResponse
