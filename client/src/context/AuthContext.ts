import { createContext } from 'react'
import type { LoginInput, User, RegisterInput,RegisterResult } from '@/types/user'

interface AuthContextValue {
    currentUser: User | null
    login: (input: LoginInput) => User | null
    logout: () => void
    register: (input: RegisterInput) => RegisterResult
}

export const AuthContext = createContext<AuthContextValue | undefined>(
    undefined,
)
