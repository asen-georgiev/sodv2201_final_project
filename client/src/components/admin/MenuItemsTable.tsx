import {Pencil, Trash2} from 'lucide-react'
import type {MenuItem} from '@/types/menu'
import {Button} from '@/components/ui/button'
import {Card, CardFooter} from '@/components/ui/card'
import {Switch} from '@/components/ui/switch'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

interface MenuItemsTableProps {
    items: MenuItem[]
    totalItems: number
    onEdit?: (item: MenuItem) => void
    onDelete?: (item: MenuItem) => void
    onAvailabilityChange?: (id: string, isAvailable: boolean) => void
}

export default function MenuItemsTable({
                                           items,
                                           totalItems,
                                           onEdit,
                                           onDelete,
                                           onAvailabilityChange,
                                       }: MenuItemsTableProps) {
    return (
        <Card className="gap-0 overflow-hidden rounded-xl border-stone-200 bg-white py-0 shadow-none">
            <Table>
                <TableHeader>
                    <TableRow className="bg-stone-50 hover:bg-stone-50">
                        <TableHead className="px-5 py-4">Menu item</TableHead>
                        <TableHead className="px-5 py-4">Category</TableHead>
                        <TableHead className="px-5 py-4">Price</TableHead>
                        <TableHead className="px-5 py-4">Availability</TableHead>
                        <TableHead className="px-5 py-4 text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {items.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={5}
                                className="px-5 py-12 text-center text-stone-500"
                            >
                                No menu items found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        items.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={item.imageUrl}
                                            alt=""
                                            className="size-12 rounded-lg bg-stone-100 object-contain"
                                        />

                                        <div>
                                            <p className="font-semibold text-stone-900">
                                                {item.name}
                                            </p>

                                            <p className="mt-1 text-xs capitalize text-stone-500">
                                                {item.dietaryOptions.length > 0
                                                    ? item.dietaryOptions.join(', ')
                                                    : 'No dietary labels'}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell className="px-5 py-4 capitalize">
                                    {item.category}
                                </TableCell>

                                <TableCell className="px-5 py-4 font-semibold">
                                    ${item.price.toFixed(2)}
                                </TableCell>

                                <TableCell className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <Switch
                                            checked={item.isAvailable}
                                            disabled={!onAvailabilityChange}
                                            onCheckedChange={checked =>
                                                onAvailabilityChange?.(item.id, checked)
                                            }
                                            aria-label={`Availability of ${item.name}`}
                                        />

                                        <span className="text-xs text-stone-600">
                                            {item.isAvailable ? 'Available' : 'Unavailable'}
                                        </span>
                                    </div>
                                </TableCell>

                                <TableCell className="px-5 py-4">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            disabled={!onEdit}
                                            onClick={() => onEdit?.(item)}
                                            aria-label={`Edit ${item.name}`}
                                        >
                                            <Pencil className="size-4"/>
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            disabled={!onDelete}
                                            onClick={() => onDelete?.(item)}
                                            aria-label={`Delete ${item.name}`}
                                            className="text-red-700 hover:bg-red-50 hover:text-red-800"
                                        >
                                            <Trash2 className="size-4"/>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <CardFooter className="justify-between border-t border-stone-200 px-5 py-4 text-xs text-stone-500">
        <span>
          Showing {items.length} of {totalItems} menu items
        </span>
                <span>Menu management</span>
            </CardFooter>
        </Card>
    )
}
