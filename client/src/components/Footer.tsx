import { NavLink } from 'react-router-dom'

function Footer() {
    return (
        <footer className="border-t border-stone-200 bg-white">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-6 md:flex-row">
                <NavLink to="/" aria-label="Table and Thyme home">
                    <img
                        src="/images/brand/logo.svg"
                        alt="Table & Thyme"
                        className="h-8 w-auto"
                    />
                </NavLink>

                <p className="text-sm text-stone-600">
                    Good food. Good company. Every day.
                </p>

                <nav
                    aria-label="Footer navigation"
                    className="flex gap-6 text-sm text-stone-600"
                >
                    <NavLink to="/menu" className="hover:text-emerald-700">
                        Our menu
                    </NavLink>

                    <NavLink to="/reservations" className="hover:text-emerald-700">
                        Book a table
                    </NavLink>
                </nav>
            </div>
        </footer>
    )
}

export default Footer
