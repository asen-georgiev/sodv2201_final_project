import {useNavigate} from 'react-router-dom'
import {X} from 'lucide-react'
import type {MenuItem} from '@/types/menu'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog'

interface DishDetailsDialogProps {
    dish: MenuItem
    canOrder: boolean
    onAddToCart: (dish: MenuItem) => void
    onClose: () => void
}

export default function DishDetailsDialog({dish, canOrder, onAddToCart, onClose,}: DishDetailsDialogProps) {
    const navigate = useNavigate()

    return (
        <Dialog
            open
            onOpenChange={open => {
                if (!open) onClose()
            }}
        >
            <DialogContent
                showCloseButton={false}
                className="max-h-[90dvh] overflow-y-auto rounded-2xl p-7 sm:max-w-lg"
            >
                <div className="flex items-center justify-between gap-3">
                    <DialogTitle className="text-2xl font-bold tracking-tight">
                        {dish.name}
                    </DialogTitle>

                    <DialogClose
                        render={
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                aria-label="Close dialog"
                                className="text-stone-600"
                            />
                        }
                    >
                        <X className="size-4"/>
                    </DialogClose>
                </div>

                <div className="grid h-48 place-items-center rounded-lg bg-stone-100">
                    <img
                        src={dish.imageUrl}
                        alt=""
                        className="h-40 w-auto"
                    />
                </div>

                <DialogDescription className="text-base text-stone-900">
                    {dish.description}
                </DialogDescription>

                <p className="text-sm text-stone-600">
                    <strong>Ingredients:</strong> {dish.ingredients.join(', ')}
                </p>

                <div className="flex items-center justify-between">
                    <Badge
                        variant="secondary"
                        className="rounded-md bg-emerald-50 p-3 font-semibold capitalize text-emerald-700"
                    >
                        {dish.dietaryOptions[0] ?? 'Popular'}
                    </Badge>

                    <strong className="text-lg tracking-tight">
                        ${dish.price.toFixed(2)}
                    </strong>
                </div>

                <DialogFooter className="gap-2 border-0 bg-white">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="h-auto px-5 py-3 font-semibold"
                    >
                        Close
                    </Button>

                    {canOrder ? (
                        <Button
                            type="button"
                            onClick={() => onAddToCart(dish)}
                            className="h-auto bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700"
                        >
                            Add to cart
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="h-auto bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700"
                        >
                            Sign in to order
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
