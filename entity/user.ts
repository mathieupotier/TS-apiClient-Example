import {GetUserApiResponse} from "../api/responses";

class Right {
    private readonly _name: string
    private readonly _active: boolean

    private constructor(name: string, active: boolean) {
        this._name = name;
        this._active = active;
    }

    public static fromResponse(response: {name: string, active: boolean}): Right
    {
        return new Right(response.name, response.active)
    }

    public getName(): string {
        return this._name;
    }

    public getActive(): boolean {
        return this._active;
    }
}

export default class User
{
    private readonly _id: string
    private readonly _name: string
    private readonly _token: string
    private readonly _rights: Right[]

    private constructor(id: string, name: string, token: string, rights: Right[]) {
        this._id = id;
        this._name = name;
        this._token = token;
        this._rights = rights;
    }

    public static fromResponse(response: GetUserApiResponse): User
    {
        return new User(
            response.id,
            response.displayName,
            response.token,
            response.rights.map(rightResponse => Right.fromResponse(rightResponse))
        )
    }

    public getId(): string
    {
        return this._id
    }

    public getName(): string
    {
        return this._name
    }

    public getToken(): string
    {
        return this._token
    }

    public getRights(): Right[]
    {
        return this._rights
    }

    public isActive(): boolean
    {
        for (let right of this.getRights()) {
            if (right.getName() === 'access' && right.getActive()) {
                return true
            }
        }
        return false
    }
}