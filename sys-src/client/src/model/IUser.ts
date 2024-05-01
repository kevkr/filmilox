export interface IUser {
    _id: string;
    username: string;
    email: string;
    admin: boolean;
    profile?: string;
}
