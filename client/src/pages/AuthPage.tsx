import { NavLink } from 'react-router-dom'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'
import {Tabs, TabsContent, TabsList, TabsTrigger,} from '@/components/ui/tabs'

export default function AuthPage() {
    return (
        <div className="grid flex-1 overflow-hidden rounded-2xl border border-stone-200 md:grid-cols-2">
            <section className="flex flex-col justify-center bg-emerald-950 p-8 text-white md:p-12">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-emerald-300">
                    Good to have you here
                </p>

                <h1 className="text-4xl font-bold">
                    Your favorites.
                    <br/>
                    Your plans.
                    <br/>
                    Your kind of place.
                </h1>

                <p className="mt-5 text-emerald-100">
                    Keep track of your orders, manage your reservations,
                    and make yourself at home.
                </p>

                <img
                    src="/images/dishes/margherita-pizza.svg"
                    alt="Margherita pizza"
                    className="mx-auto mt-8 hidden w-64 md:block"
                />
            </section>

            <section aria-label="Sign in or create an account" className="flex justify-center bg-white p-8 md:p-12">
                <div className="w-full max-w-sm">
                    <Tabs defaultValue="login">
                        <TabsList className="mb-6 grid h-12! w-full grid-cols-2 p-2">
                            <TabsTrigger value="login" className="h-full py-0">
                                Sign in
                            </TabsTrigger>

                            <TabsTrigger value="register" className="h-full py-0">
                                Create account
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <LoginForm />
                        </TabsContent>

                        <TabsContent value="register">
                            <RegisterForm />
                        </TabsContent>
                    </Tabs>

                    <div className="mt-6 border-t border-stone-200 pt-5 text-center">
                        <NavLink
                            to="/menu"
                            className="text-sm text-stone-600 hover:text-emerald-700"
                        >
                            Just browsing? Explore the menu →
                        </NavLink>
                    </div>
                </div>
            </section>
        </div>
    )
}
