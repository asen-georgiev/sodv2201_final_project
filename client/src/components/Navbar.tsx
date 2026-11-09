import {NavLink} from 'react-router-dom'
import {ShoppingCart} from 'lucide-react'
import {useNavigate} from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import {Button} from '@/components/ui/button'
import useCart from '@/hooks/useCart'

function Navbar() {
    const {currentUser, logout} = useAuth()
    const navigate = useNavigate()
    const {cart} = useCart()

    const cartItemCount = cart.reduce(
        (total, item) => total + item.quantity,
        0,
    )

    function handleLogout() {
        logout()
        navigate('/login', {replace: true})
    }

    return (
        <header className="border-b border-stone-200 bg-white">
            <nav
                aria-label="Main navigation"
                className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6 py-5">
                <NavLink to="/" aria-label="Table and Thyme home">
                    <img
                        src="/images/brand/logo.svg"
                        alt="Table & Thyme"
                        className="h-10 w-auto"
                    />
                </NavLink>

                <div className="flex items-center gap-6">
                    <NavLink to="/" end>
                        Home
                    </NavLink>

                    <NavLink to="/menu">Menu</NavLink>

                    <NavLink to="/reservations">Reservations</NavLink>

                    <NavLink to="/account">My account</NavLink>
                </div>

                <div className="flex items-center gap-4">
                    <NavLink
                        to="/cart"
                        aria-label={`Shopping cart, ${cartItemCount} items`}
                        className="inline-flex items-center gap-2"
                    >
                        <ShoppingCart className="size-5"/>

                        {cartItemCount > 0 && (
                            <span
                                className="inline-flex min-w-5 items-center justify-center rounded-full bg-orange-600 px-1.5 py-0.5 text-xs font-semibold text-white">
                                {cartItemCount}
                            </span>
                        )}
                    </NavLink>

                    {currentUser ? (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleLogout}
                            className="border-stone-200 bg-white text-stone-900 hover:bg-stone-100 h-10 px-4 py-0 text-sm font-medium"
                        >
                            Log out
                        </Button>
                    ) : (
                        <NavLink
                            to="/login"
                            className="inline-flex h-10 items-center justify-center rounded-lg border border-stone-200 bg-white px-4 py-0 text-sm font-medium text-stone-900 hover:bg-stone-100"
                        >
                            Sign in
                        </NavLink>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Navbar
