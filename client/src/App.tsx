import { Routes, Route } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AuthPage from '@/pages/AuthPage'

function App() {
    return (
        <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900">
            <Navbar />

            <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10">
                <Routes>
                    <Route path="/login" element={<AuthPage />} />
                </Routes>
            </main>

            <Footer />
        </div>
    )
}

export default App
