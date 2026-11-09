import {useState} from 'react'
import type {SubmitEvent} from 'react'
import {ArrowRight, Clock} from 'lucide-react'
import type {FulfillmentType} from '@/types/order'
import {Button} from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Separator} from '@/components/ui/separator'
import {Textarea} from '@/components/ui/textarea'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'

export interface CheckoutInput {
    fulfillmentType: FulfillmentType
    deliveryAddress: string
    notes: string
}

interface CheckoutFormProps {
    customerName: string
    customerEmail: string
    total: number
    disabled: boolean
    onCheckout: (input: CheckoutInput) => void
}

export default function CheckoutForm({customerName, customerEmail, total, disabled, onCheckout,}: CheckoutFormProps) {
    const [fulfillmentType, setFulfillmentType] =
        useState<FulfillmentType>('pickup')

    const [deliveryAddress, setDeliveryAddress] = useState('')
    const [notes, setNotes] = useState('')
    const [error, setError] = useState('')

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')

        if (disabled) return

        if (fulfillmentType === 'delivery' && !deliveryAddress.trim()) {
            setError('Enter a delivery address.')
            return
        }

        onCheckout({
            fulfillmentType,
            deliveryAddress:
                fulfillmentType === 'delivery' ? deliveryAddress.trim() : '',
            notes: notes.trim(),
        })
    }

    return (
        <Card className="gap-0 rounded-xl border-stone-200 bg-white shadow-none">
            <CardHeader>
                <CardTitle className="text-xl font-bold tracking-tight pb-4">
                    Order summary
                </CardTitle>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Tabs
                        value={fulfillmentType}
                        onValueChange={value => {
                            if (value === 'pickup' || value === 'delivery') {
                                setFulfillmentType(value)
                                setError('')
                            }
                        }}
                    >
                        <TabsList className="mb-5 grid h-12! w-full grid-cols-2 p-1">
                            <TabsTrigger value="pickup" className="h-full py-0">
                                Pickup
                            </TabsTrigger>

                            <TabsTrigger value="delivery" className="h-full py-0">
                                Delivery
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="pickup">
                            <div className="flex gap-3 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-900">
                                <Clock className="mt-0.5 size-4 shrink-0"/>

                                <p>
                                    Pickup in approximately 25 minutes.
                                    <br/>
                                    123 Thyme Street · Sample location
                                </p>
                            </div>
                        </TabsContent>

                        <TabsContent value="delivery">
                            <div className="space-y-2">
                                <Label htmlFor="delivery-address">
                                    Delivery address
                                </Label>

                                <Input
                                    id="delivery-address"
                                    autoComplete="street-address"
                                    placeholder="Street address"
                                    value={deliveryAddress}
                                    onChange={event =>
                                        setDeliveryAddress(event.target.value)
                                    }
                                    required={fulfillmentType === 'delivery'}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div>
                        <p className="text-sm font-semibold">Ordering as</p>
                        <p className="mt-2 text-sm text-stone-900">
                            {customerName}
                        </p>
                        <p className="text-sm text-stone-600">
                            {customerEmail}
                        </p>
                    </div>

                    <Separator/>

                    <div className="flex items-center justify-between gap-3 text-lg font-bold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="order-notes">
                            Order notes (optional)
                        </Label>

                        <Textarea
                            id="order-notes"
                            placeholder="Anything we should know?"
                            value={notes}
                            onChange={event => setNotes(event.target.value)}
                            className="min-h-20"
                        />
                    </div>

                    {error && (
                        <p role="alert" className="text-sm text-red-700">
                            {error}
                        </p>
                    )}

                    {disabled && (
                        <p className="text-sm text-stone-600">
                            Add available items to your cart and remove any unavailable
                            items before checkout.
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={disabled}
                        className="h-auto w-full bg-orange-600 py-3 text-white hover:bg-orange-700"
                    >
                        Place order
                        <ArrowRight className="size-4"/>
                    </Button>

                    <p className="text-center text-xs text-stone-500">
                        Simulated checkout. No payment will be collected.
                    </p>
                </form>
            </CardContent>
        </Card>
    )
}
