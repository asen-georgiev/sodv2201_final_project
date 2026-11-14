import {Calendar, LogOut, ShoppingBag, UserRound} from 'lucide-react'
import type {LucideIcon} from 'lucide-react'

export type AccountTab = 'orders' | 'reservations' | 'details'

interface AccountSidebarProps {
    activeTab: AccountTab
    onTabChange: (tab: AccountTab) => void
    onSignOut: () => void
}

const tabs: { value: AccountTab; label: string; icon: LucideIcon }[] = [
    {value: 'orders', label: 'My orders', icon: ShoppingBag},
    {value: 'reservations', label: 'My reservations', icon: Calendar},
    {value: 'details', label: 'Account details', icon: UserRound},
]

const itemClassName =
    'flex items-center gap-2.5 whitespace-nowrap rounded-lg p-2.5 text-left text-xs md:w-full md:px-4 md:py-3 md:text-sm'

export default function AccountSidebar({activeTab, onTabChange, onSignOut}: AccountSidebarProps) {
    return (
        <nav aria-label="Account">
            <ul className="flex gap-2 overflow-x-auto md:flex-col md:gap-1">
                {tabs.map(({value, label, icon: Icon}) => (
                    <li key={value}>
                        <button
                            type="button"
                            onClick={() => onTabChange(value)}
                            aria-current={activeTab === value ? 'page' : undefined}
                            className={`${itemClassName} ${
                                activeTab === value
                                    ? 'bg-emerald-50 font-semibold text-emerald-700'
                                    : 'text-stone-600 hover:bg-stone-100'
                            }`}
                        >
                            <Icon className="size-4 md:size-4.5"/>
                            {label}
                        </button>
                    </li>
                ))}

                <li>
                    <button
                        type="button"
                        onClick={onSignOut}
                        className={`${itemClassName} text-stone-600 hover:bg-stone-100`}
                    >
                        <LogOut className="size-4 md:size-4.5"/>
                        Sign out
                    </button>
                </li>
            </ul>
        </nav>
    )
}
