import { useEffect, useState } from 'react'

function useLocalStorage<T>(key: string, initialValue: T) {
    const [value, setValue] = useState<T>(() => {
        try {
            const storedValue = localStorage.getItem(key)

            return storedValue === null
                ? initialValue
                : (JSON.parse(storedValue) as T)
        } catch {
            return initialValue
        }
    })

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch {
            console.error(`Could not save "${key}" to localStorage`)
        }
    }, [key, value])

    return [value, setValue] as const
}

export default useLocalStorage
