import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { MENU_CATEGORIES } from '@/types/menu'
import type { DietaryOption, MenuItem } from '@/types/menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

export type MenuItemFormData = Omit<MenuItem, 'id'>

interface MenuItemDialogProps {
    item?: MenuItem
    onClose: () => void
    onSave: (data: MenuItemFormData) => void
}

const dietaryOptions: {
    value: string
    label: string
    options: DietaryOption[]
}[] = [
    { value: 'none', label: 'None', options: [] },
    {
        value: 'vegetarian',
        label: 'Vegetarian',
        options: ['vegetarian'],
    },
    {
        value: 'gluten-free',
        label: 'Gluten-free',
        options: ['gluten-free'],
    },
    {
        value: 'both',
        label: 'Vegetarian and gluten-free',
        options: ['vegetarian', 'gluten-free'],
    },
]

export default function MenuItemDialog({item, onClose, onSave,}: MenuItemDialogProps) {
    const [draft, setDraft] = useState<MenuItemFormData>({
        name: item?.name ?? '',
        description: item?.description ?? '',
        price: item?.price ?? 0,
        imageUrl: item?.imageUrl ?? '',
        category: item?.category ?? 'starters',
        ingredients: item?.ingredients ?? [],
        dietaryOptions: item?.dietaryOptions ?? [],
        isAvailable: item?.isAvailable ?? true,
        isPopular: item?.isPopular ?? false,
    })

    const [price, setPrice] = useState(
        item ? String(item.price) : '',
    )

    const [ingredients, setIngredients] = useState(
        item?.ingredients.join(', ') ?? '',
    )

    const [error, setError] = useState('')

    const selectedDiet =
        draft.dietaryOptions.length === 2
            ? 'both'
            : draft.dietaryOptions[0] ?? 'none'

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')

        const parsedPrice = Number(price)

        const parsedIngredients = ingredients
            .split(',')
            .map(ingredient => ingredient.trim())
            .filter(ingredient => ingredient !== '')

        if (
            !draft.imageUrl.trim() ||
            !draft.name.trim() ||
            !draft.description.trim() ||
            !Number.isFinite(parsedPrice) ||
            parsedPrice <= 0 ||
            parsedIngredients.length === 0
        ) {
            setError('Complete all fields and enter a valid positive price.')
            return
        }

        onSave({
            ...draft,
            name: draft.name.trim(),
            description: draft.description.trim(),
            imageUrl: draft.imageUrl.trim(),
            price: parsedPrice,
            ingredients: parsedIngredients,
        })
    }

    return (
        <Dialog
            open
            onOpenChange={open => {
                if (!open) onClose()
            }}
        >
            <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl p-6 sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold tracking-tight">
                        {item ? 'Edit menu item' : 'Add menu item'}
                    </DialogTitle>

                    <DialogDescription className="sr-only">
                        Complete the dish details. Changes are applied only when saved.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-2 space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Dish name</Label>
                        <Input
                            id="edit-name"
                            value={draft.name}
                            className="h-10!"
                            onChange={event =>
                                setDraft(previous => ({
                                    ...previous,
                                    name: event.target.value,
                                }))
                            }
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="menu-image">Image path</Label>

                        <Input
                            id="menu-image"
                            placeholder="/images/dishes/margherita-pizza.svg"
                            value={draft.imageUrl}
                            className="h-10!"
                            onChange={event =>
                                setDraft(previous => ({
                                    ...previous,
                                    imageUrl: event.target.value,
                                }))
                            }
                            required
                        />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="edit-category">Category</Label>

                            <Select
                                value={draft.category}
                                onValueChange={value => {
                                    const category = MENU_CATEGORIES.find(
                                        category => category === value,
                                    )

                                    if (category) {
                                        setDraft(previous => ({
                                            ...previous,
                                            category,
                                        }))
                                    }
                                }}
                            >
                                <SelectTrigger
                                    id="edit-category"
                                    className="h-10! w-full"
                                >
                                    <SelectValue>
                                        <span className="capitalize">{draft.category}</span>
                                    </SelectValue>
                                </SelectTrigger>

                                <SelectContent>
                                    {MENU_CATEGORIES.map(category => (
                                        <SelectItem key={category} value={category}>
                                            <span className="capitalize">{category}</span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-price">Price ($)</Label>

                            <Input
                                id="edit-price"
                                type="number"
                                min="0.01"
                                step="0.01"
                                className="h-10!"
                                value={price}
                                onChange={event => setPrice(event.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>

                        <Textarea
                            id="edit-description"
                            value={draft.description}
                            onChange={event =>
                                setDraft(previous => ({
                                    ...previous,
                                    description: event.target.value,
                                }))
                            }
                            className="min-h-24"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-ingredients">Ingredients</Label>

                        <Input
                            id="edit-ingredients"
                            placeholder="Separate ingredients with commas"
                            className="h-10!"
                            value={ingredients}
                            onChange={event => setIngredients(event.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-diet">Dietary information</Label>

                        <Select
                            value={selectedDiet}
                            onValueChange={value => {
                                const selected = dietaryOptions.find(
                                    option => option.value === value,
                                )

                                if (selected) {
                                    setDraft(previous => ({
                                        ...previous,
                                        dietaryOptions: [...selected.options],
                                    }))
                                }
                            }}
                        >
                            <SelectTrigger
                                id="edit-diet"
                                className="h-10! w-full sm:w-60"
                            >
                                <SelectValue>
                                    {
                                        dietaryOptions.find(
                                            option => option.value === selectedDiet,
                                        )?.label
                                    }
                                </SelectValue>
                            </SelectTrigger>

                            <SelectContent>
                                {dietaryOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {error && (
                        <p role="alert" className="text-sm text-red-700">
                            {error}
                        </p>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} className="p-5">
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            className="bg-orange-600 text-white hover:bg-orange-700 p-5"
                        >
                            Save item
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
