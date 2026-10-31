import Navbar from '@/components/Navbar'
import Footer from "@/components/Footer.tsx";

function App() {
    return (
        <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900">
            <Navbar />
            <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
                <h1 className="text-3xl font-bold">
                    Smart Restaurant Management System
                </h1>
            </main>
            <Footer />
        </div>
    )
}

export default App
