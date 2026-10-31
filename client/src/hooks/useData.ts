import { useContext } from 'react'
import { DataContext } from '@/context/DataContext'

function useData() {
    const context = useContext(DataContext)

    if (context === undefined) {
        throw new Error('useData must be used inside DataProvider')
    }

    return context
}

export default useData
