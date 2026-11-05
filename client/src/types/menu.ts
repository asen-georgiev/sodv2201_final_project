export const MENU_CATEGORIES = [
    'starters',
    'mains',
    'desserts',
    'beverages',
] as const

export type MenuCategory = (typeof MENU_CATEGORIES)[number]

export type DietaryOption = 'vegetarian' | 'gluten-free'

export interface MenuItem {
    id: string
    name: string
    description: string
    price: number
    imageUrl: string
    category: MenuCategory
    ingredients: string[]
    dietaryOptions: DietaryOption[]
    isAvailable: boolean
    isPopular: boolean
}

interface StatItem {
    label: string
    value: number
}

export interface AdminStatsProps {
    items: StatItem[]
}
