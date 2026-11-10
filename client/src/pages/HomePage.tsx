import {useState} from 'react'
import HomeHero from '@/components/home/HomeHero'
import HomeBenefits from '@/components/home/HomeBenefits'
import FeaturedDishes from '@/components/home/FeaturedDishes'
import DishDetailsDialog from '@/components/home/DishDetailsDialog'
import ReservationCallout from '@/components/home/ReservationCallout'
import useAuth from '@/hooks/useAuth'
import useCart from '@/hooks/useCart'
import useData from '@/hooks/useData'
import type {MenuItem} from '@/types/menu'

export default function HomePage() {
    const {menu} = useData()
    const {currentUser} = useAuth()
    const {addItem} = useCart()
    const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null)

    const featuredDishes = menu
        .filter(item => item.isPopular && item.isAvailable)
        .slice(0, 3)

    function handleAddToCart(dish: MenuItem) {
        addItem(dish.id)
        setSelectedDish(null)
    }

    return (
        <div className="pb-20 md:pb-16">
            <HomeHero dish={featuredDishes[0]}/>

            <HomeBenefits/>

            <FeaturedDishes
                dishes={featuredDishes}
                onSelect={setSelectedDish}
            />

            <ReservationCallout/>

            {selectedDish && (
                <DishDetailsDialog
                    dish={selectedDish}
                    canOrder={currentUser?.role === 'customer'}
                    onAddToCart={handleAddToCart}
                    onClose={() => setSelectedDish(null)}
                />
            )}
        </div>
    )
}
