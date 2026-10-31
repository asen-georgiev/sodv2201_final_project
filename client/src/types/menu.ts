export type MenuCategory =
    | 'starters'
    | 'mains'
    | 'desserts'
    | 'beverages'

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
