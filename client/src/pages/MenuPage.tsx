import {useState} from 'react'
import {Leaf} from 'lucide-react'
import UserPageHeader from '@/components/UserPageHeader'
import DishCard from '@/components/home/DishCard'
import DishDetailsDialog from '@/components/home/DishDetailsDialog'
import useAuth from '@/hooks/useAuth'
import useCart from '@/hooks/useCart'
import useData from '@/hooks/useData'
import {
    MENU_CATEGORIES,
    type MenuItem,
    type MenuCategory,
    type DietaryOption,
} from '@/types/menu'
import {Button} from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {Alert, AlertDescription} from '@/components/ui/alert'

export default function MenuPage() {
    const {menu} = useData()
    const {currentUser} = useAuth()
    const {addItem} = useCart()

    const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState<MenuCategory | 'all'>('all')
    const [dietary, setDietary] = useState<DietaryOption | 'all'>('all')
    const [maxPrice, setMaxPrice] = useState('all')

    const filteredDishes = menu.filter(dish =>
        dish.name.toLowerCase().includes(search.toLowerCase()) &&
        (category === 'all' || dish.category === category) &&
        ((dietary === 'all' || dish.dietaryOptions.includes(dietary))) &&
        (maxPrice === 'all' || dish.price <= Number(maxPrice))
    )

    function handleAddToCart(dish: MenuItem) {
        if (!dish.isAvailable) return

        addItem(dish.id)
        setSelectedDish(null)
    }

    return (
        <div className="py-10">
            <UserPageHeader
                eyebrow="Made fresh, served with care"
                title="Find your next favorite."
                description="A little comfort, a little discovery. Something delicious for every appetite."
            />

            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
                <div className="w-full min-w-0 md:flex-1">
                    <input
                        type="text"
                        placeholder="Search dishes..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                </div>

                <Select
                    value={dietary}
                    onValueChange={value => setDietary(value ?? 'all')}
                >
                    <SelectTrigger className="!h-12 w-full rounded-lg border-gray-300 bg-white md:w-56">
                        <SelectValue>
                            {dietary === 'all'
                                ? 'All dietary options'
                                : dietary === 'vegetarian'
                                    ? 'Vegetarian'
                                    : 'Gluten-free'}
                        </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="all">All dietary options</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="gluten-free">Gluten-free</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={maxPrice}
                    onValueChange={value => setMaxPrice(value ?? 'all')}
                >
                    <SelectTrigger className="!h-12 w-full rounded-lg border-gray-300 bg-white md:w-56">
                        <SelectValue>
                            {maxPrice === 'all'
                                ? 'Any price'
                                : `Under $${maxPrice}`}
                        </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="all">Any price</SelectItem>
                        <SelectItem value="10">Under $10</SelectItem>
                        <SelectItem value="15">Under $15</SelectItem>
                        <SelectItem value="20">Under $20</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                    {(['all', ...MENU_CATEGORIES] as const).map(item => (
                        <Button
                            key={item}
                            type="button"
                            variant="outline"
                            onClick={() => setCategory(item)}
                            className={`rounded-full px-5 py-2 text-sm font-normal ${
                                category === item
                                    ? 'border-emerald-900 bg-emerald-900 text-white hover:bg-emerald-800 hover:text-white'
                                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {item === 'all'
                                ? 'All'
                                : item.charAt(0).toUpperCase() + item.slice(1)}
                        </Button>
                    ))}
                </div>

                <span className="shrink-0 text-sm text-gray-500">
                        {filteredDishes.length} dishes
                    </span>
            </div>

            {filteredDishes.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredDishes.map(dish => (
                        <div key={dish.id} className="relative">
                            <DishCard
                                dish={dish}
                                onSelect={() => {
                                    if (dish.isAvailable) {
                                        setSelectedDish(dish)
                                    }
                                }}/>
                            {!dish.isAvailable && (
                                <span
                                    className="pointer-events-none absolute right-3 top-3 rounded-md bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                        Unavailable
                                    </span>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="py-12 text-center text-gray-500">
                    No dishes found. Try a different search or filter.
                </p>
            )}

            <Alert className="mt-8 rounded-xl border-0 bg-emerald-50 px-5 py-4 text-emerald-900">
                <Leaf className="size-5"/>
                <AlertDescription className="text-emerald-900">
                    Have an allergy? Ingredient information is available on each dish.
                    Please speak with our team before ordering.
                </AlertDescription>
            </Alert>

            {selectedDish && (
                <DishDetailsDialog
                    dish={selectedDish}
                    canOrder={currentUser?.role === 'customer' && selectedDish.isAvailable}
                    onAddToCart={handleAddToCart}
                    onClose={() => setSelectedDish(null)}
                />
            )}
        </div>
    )
}
