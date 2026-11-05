import {useState} from 'react'
import {Plus} from 'lucide-react'
import {Button} from '@/components/ui/button'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminStats from '@/components/admin/AdminStats'
import useData from '@/hooks/useData'
import {MENU_CATEGORIES, type MenuItem} from '@/types/menu'
import MenuItemsTable from '@/components/admin/MenuItemsTable'
import AdminFilters from '@/components/admin/AdminFilters'
import MenuItemDialog from '@/components/admin/MenuItemDialog'
import type {MenuItemFormData} from '@/components/admin/MenuItemDialog'

const categoryOptions = [
    {label: 'All categories', value: 'all'},
    ...MENU_CATEGORIES.map(category => ({
        label: category.charAt(0).toUpperCase() + category.slice(1),
        value: category,
    })),
]

export function MenuItemsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
    const {menu, setMenu} = useData()
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('all')
    const searchTerm = search.trim().toLowerCase()

    const filteredMenu = menu.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm)
        const matchesCategory =
            category === 'all' || item.category === category

        return matchesSearch && matchesCategory
    })

    const stats = [
        {
            label: 'Menu items',
            value: menu.length,
        },
        {
            label: 'Available today',
            value: menu.filter(item => item.isAvailable).length,
        },
        {
            label: 'Categories',
            value: MENU_CATEGORIES.length,
        },
    ]

    function handleAdd() {
        setEditingItem(null)
        setIsDialogOpen(true)
    }

    function handleEdit(item: MenuItem) {
        setEditingItem(item)
        setIsDialogOpen(true)
    }

    function handleDialogClose() {
        setIsDialogOpen(false)
        setEditingItem(null)
    }

    function handleMenuItemSave(data: MenuItemFormData) {
        if (editingItem) {
            const updatedItem: MenuItem = {
                ...data,
                id: editingItem.id,
            }

            setMenu(previousMenu =>
                previousMenu.map(item =>
                    item.id === updatedItem.id ? updatedItem : item,
                ),
            )
        } else {
            const newItem: MenuItem = {
                ...data,
                id: crypto.randomUUID(),
            }
            setMenu(previousMenu => [...previousMenu, newItem])
        }
        handleDialogClose()
    }

    function handleDelete(item: MenuItem) {
        setMenu(previousMenu =>
            previousMenu.filter(menuItem => menuItem.id !== item.id)
        )
    }

    function handleAvailabilityChange(id: string, isAvailable: boolean) {
        setMenu(previousMenu =>
            previousMenu.map(item =>
                item.id === id ? {...item, isAvailable} : item
            )
        )
    }


    return (
        <>
            <AdminPageHeader
                title="Menu items"
                description="Keep the menu fresh. Manage dishes, prices, and availability."
                action={
                    <Button
                        onClick={handleAdd}
                        className="bg-orange-600 text-white hover:bg-orange-700 p-5"
                    >
                        <Plus/>
                        Add menu item
                    </Button>
                }
            />
            <AdminStats items={stats}/>

            <AdminFilters
                search={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search menu items…"
                filter={category}
                onFilterChange={setCategory}
                filterLabel="Filter by category"
                filterOptions={categoryOptions}
                resultCount={filteredMenu.length}
            />

            <MenuItemsTable
                items={filteredMenu}
                totalItems={menu.length}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAvailabilityChange={handleAvailabilityChange}
            />

            {isDialogOpen && (
                <MenuItemDialog
                    key={editingItem?.id ?? 'new'}
                    item={editingItem ?? undefined}
                    onClose={handleDialogClose}
                    onSave={handleMenuItemSave}
                />
            )}
        </>
    )
}
