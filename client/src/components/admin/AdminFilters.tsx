import {Search} from 'lucide-react'
import {Input} from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface FilterOption {
    label: string
    value: string
}

interface AdminFiltersProps {
    search: string
    onSearchChange: (value: string) => void
    searchPlaceholder: string
    filter: string
    onFilterChange: (value: string) => void
    filterLabel: string
    filterOptions: FilterOption[]
    resultCount: number
}

export default function AdminFilters({
                                         search,
                                         onSearchChange,
                                         searchPlaceholder,
                                         filter,
                                         onFilterChange,
                                         filterLabel,
                                         filterOptions,
                                         resultCount,
                                     }: AdminFiltersProps) {
    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-sm">
                <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-500"
                />

                <Input
                    type="search"
                    aria-label={searchPlaceholder}
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={event => onSearchChange(event.target.value)}
                    className="h-10 bg-white pl-10"
                />
            </div>

            <Select
                value={filter}
                onValueChange={value => {
                    if (value !== null) {
                        onFilterChange(value)
                    }
                }}
            >
                <SelectTrigger
                    aria-label={filterLabel}
                    className="h-10! w-full bg-white sm:w-48"
                >
                    <SelectValue>
                        {filterOptions.find(option => option.value === filter)?.label}
                    </SelectValue>
                </SelectTrigger>

                <SelectContent>
                    {filterOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <p
                aria-live="polite"
                className="whitespace-nowrap text-sm text-stone-500 sm:ml-auto"
            >
                {resultCount} {resultCount === 1 ? 'result' : 'results'}
            </p>
        </div>
    )
}
