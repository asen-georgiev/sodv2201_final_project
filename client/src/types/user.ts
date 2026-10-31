export type UserRole = 'customer' | 'admin'

export interface User {
    id: string
    name: string
    email: string
    phone: string
    role: UserRole
}

export interface RegisterInput {
    name: string
    email: string
    phone: string
    password: string
}

export interface LoginInput {
    email: string
    password: string
}

//Remove when real authentication is implemented!!!
export interface MockUser extends User {
    password: string
}
