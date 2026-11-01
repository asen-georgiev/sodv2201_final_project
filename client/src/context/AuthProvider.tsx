import type {ReactNode} from 'react'
import {AuthContext} from './AuthContext'
import useData from '@/hooks/useData'
import useLocalStorage from '@/hooks/useLocalStorage'
import type {
    LoginInput,
    RegisterInput,
    MockUser,
    User,
    RegisterResult
} from '@/types/user'

interface AuthProviderProps {
    children: ReactNode
}

export default function AuthProvider({children}: AuthProviderProps) {
    const {users, setUsers} = useData()

    const [currentUserId, setCurrentUserId] = useLocalStorage<string | null>(
        'currentUserId',
        null,
    )

    const matchedUser = users.find(user => user.id === currentUserId)

    const currentUser: User | null = matchedUser
        ? {
            id: matchedUser.id,
            name: matchedUser.name,
            email: matchedUser.email,
            phone: matchedUser.phone,
            role: matchedUser.role,
        }
        : null

    function login(input: LoginInput): User | null {
        const matchedUser = users.find(
            user =>
                user.email.toLowerCase() === input.email.trim().toLowerCase() &&
                user.password === input.password,
        )

        if (!matchedUser) {
            return null
        }

        const user: User = {
            id: matchedUser.id,
            name: matchedUser.name,
            email: matchedUser.email,
            phone: matchedUser.phone,
            role: matchedUser.role,
        }
        setCurrentUserId(user.id)
        return user
    }

    function logout(): void {
        setCurrentUserId(null)
    }

    function register(input: RegisterInput): RegisterResult {
        const name = input.name.trim()
        const email = input.email.trim().toLowerCase()

        if (!name || !email || input.password.length < 8) {
            return {
                success: false,
                error: 'Enter your name, email, and a password of at least 8 characters.',
            }
        }

        const emailExists = users.some(
            user => user.email.toLowerCase() === email,
        )

        if (emailExists) {
            return {
                success: false,
                error: 'An account with this email already exists.',
            }
        }

        const user: User = {
            id: crypto.randomUUID(),
            name,
            email,
            phone: input.phone.trim(),
            role: 'customer',
        }

        const mockUser: MockUser = {
            ...user,
            password: input.password,
        }

        setUsers(previousUsers => [...previousUsers, mockUser])
        setCurrentUserId(user.id)

        return {success: true, user}
    }

    return (
        <AuthContext.Provider value={{currentUser, login, logout, register}}>
            {children}
        </AuthContext.Provider>
    )
}
