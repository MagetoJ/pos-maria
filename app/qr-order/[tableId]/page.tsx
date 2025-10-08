"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ShoppingCart, Plus, Minus, Trash2, Send, Bell } from "lucide-react"
import { menuItems } from "@/lib/data"
import type { OrderItem, MenuItem } from "@/lib/types"

export default function QROrderPage() {
  const params = useParams()
  const tableId = params.tableId as string
  const [cart, setCart] = useState<OrderItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [orderSubmitted, setOrderSubmitted] = useState(false)

  const categories = ["All", ...Array.from(new Set(menuItems.map((item) => item.category)))]
  const filteredItems =
    selectedCategory === "All" ? menuItems : menuItems.filter((item) => item.category === selectedCategory)

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find((cartItem) => cartItem.menuItem.id === item.id)
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.menuItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        ),
      )
    } else {
      setCart([...cart, { menuItem: item, quantity: 1 }])
    }
  }

  const updateQuantity = (itemId: string, change: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.menuItem.id === itemId) {
            const newQuantity = item.quantity + change
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
          }
          return item
        })
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.menuItem.id !== itemId))
  }

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0)
  }

  const submitOrder = () => {
    setShowConfirmDialog(false)
    setOrderSubmitted(true)
    // In production, this would send the order to the backend
    setTimeout(() => {
      setCart([])
      setOrderSubmitted(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-secondary border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-4">
            <Image src="/logo.png" alt="Maria Havens" width={120} height={60} className="object-contain" />
          </div>
          <div className="text-center mt-2">
            <h1 className="text-lg font-bold text-secondary-foreground">Welcome to Maria Havens</h1>
            <p className="text-sm text-muted-foreground">Table {tableId}</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 pb-24">
        {/* Menu */}
        <Card>
          <CardHeader>
            <CardTitle>Our Menu</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value={selectedCategory} className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredItems.map((item) => (
                    <Card key={item.id} className="hover:border-primary transition-colors">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                            <span className="text-3xl">🍽️</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{item.name}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
                              <Button
                                size="sm"
                                onClick={() => addToCart(item)}
                                disabled={!item.available}
                                className="bg-primary hover:bg-primary/90"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
          <div className="container mx-auto">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-lg"
              onClick={() => setShowConfirmDialog(true)}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              View Cart ({cart.length} items) - ${calculateTotal().toFixed(2)}
            </Button>
          </div>
        </div>
      )}

      {/* Cart Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Your Order</DialogTitle>
            <DialogDescription>Table {tableId}</DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[400px]">
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.menuItem.id} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.menuItem.name}</p>
                    <p className="text-xs text-muted-foreground">${item.menuItem.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6 bg-transparent"
                      onClick={() => updateQuantity(item.menuItem.id, -1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6 bg-transparent"
                      onClick={() => updateQuantity(item.menuItem.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-6 w-6"
                      onClick={() => removeFromCart(item.menuItem.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-primary">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowConfirmDialog(false)}>
              Continue Shopping
            </Button>
            <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={submitOrder}>
              <Send className="h-4 w-4 mr-2" />
              Submit Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Submitted Dialog */}
      <Dialog open={orderSubmitted} onOpenChange={setOrderSubmitted}>
        <DialogContent className="max-w-sm">
          <div className="text-center space-y-4 py-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Bell className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Order Submitted!</h3>
              <p className="text-muted-foreground">
                Your order has been sent to the kitchen. A waiter will be with you shortly.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
