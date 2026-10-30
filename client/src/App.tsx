import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'

function App() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-6 text-foreground">
            <h1 className="text-3xl font-bold">
                Smart Restaurant Management System
            </h1>

            <Button>
                <ShoppingCart />
                View cart
            </Button>
        </main>
    )
}

export default App
