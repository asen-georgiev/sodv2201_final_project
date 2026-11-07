import { Outlet } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'



export default function CustomerLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900">
            <Navbar />
            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
