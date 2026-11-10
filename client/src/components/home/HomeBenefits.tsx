import {Heart, Leaf, ShoppingBag} from 'lucide-react'

const benefits = [
    {
        label: 'Fresh, seasonal ingredients',
        icon: Leaf,
    },
    {
        label: 'Pickup & delivery',
        icon: ShoppingBag,
    },
    {
        label: 'Something for everyone',
        icon: Heart,
    },
]

export default function HomeBenefits() {
    return (
        <div className="-mx-6 border-b border-stone-200 bg-white">
            <ul className="flex flex-wrap justify-between gap-4 px-6 py-5">
                {benefits.map(({label, icon: Icon}) => (
                    <li
                        key={label}
                        className="flex items-center gap-3 text-xs text-stone-600 md:text-sm"
                    >
                        <Icon className="size-5 text-emerald-700"/>
                        {label}
                    </li>
                ))}
            </ul>
        </div>
    )
}
