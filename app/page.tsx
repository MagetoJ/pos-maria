"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LogIn, ShoppingCart, Trash2, Plus, Minus, Receipt, User } from "lucide-react"
import { menuItems, users, tables, orders } from "@/lib/data"
import type { OrderItem, MenuItem } from "@/lib/types"

export default function HomePage() {
  const router = useRouter()
  const [cart, setCart] = useState<OrderItem[]>([])
  const [selectedTable, setSelectedTable] = useState<string>("")
  const [selectedWaiter, setSelectedWaiter] = useState<string>("")
  const [waiterPin, setWaiterPin] = useState<string>("")
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [showReceiptDialog, setShowReceiptDialog] = useState(false)
  const [currentReceipt, setCurrentReceipt] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const categories = ["All", ...Array.from(new Set(menuItems.map((item) => item.category)))]
  const filteredItems =
    selectedCategory === "All" ? menuItems : menuItems.filter((item) => item.category === selectedCategory)

  const waiters = users.filter((u) => u.role === "waiter" && u.isActive)

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

  const calculateTax = () => {
    return calculateTotal() * 0.1 // 10% tax
  }

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      alert("Please add items to cart")
      return
    }
    if (!selectedTable) {
      alert("Please select a table")
      return
    }
    if (!selectedWaiter) {
      alert("Please select a waiter")
      return
    }
    setShowPinDialog(true)
  }

  const verifyPinAndGenerateReceipt = () => {
    const waiter = waiters.find((w) => w.id === selectedWaiter)
    if (!waiter) {
      alert("Waiter not found")
      return
    }

    if (waiterPin !== waiter.pin) {
      alert("Invalid PIN. Please try again.")
      return
    }

    const orderId = `ORD-${Date.now()}`
    const subtotal = calculateTotal()
    const tax = calculateTax()
    const total = subtotal + tax

    const newOrder = {
      id: orderId,
      tableNumber: selectedTable,
      items: cart,
      status: "completed" as const,
      waiterName: waiter.name,
      waiterId: waiter.id,
      total,
      createdAt: new Date(),
      completedAt: new Date(),
    }

    // Add to orders array (in a real app, this would be saved to database)
    orders.push(newOrder)

    const receipt = {
      id: `RCP-${Date.now()}`,
      orderId,
      items: cart,
      subtotal,
      tax,
      total,
      waiterName: waiter.name,
      tableNumber: selectedTable,
      createdAt: new Date(),
    }

    setCurrentReceipt(receipt)
    setShowPinDialog(false)
    setShowReceiptDialog(true)
  }

  const printReceipt = () => {
    window.print()
  }

  const completeOrder = () => {
    // Reset everything
    setCart([])
    setSelectedTable("")
    setSelectedWaiter("")
    setWaiterPin("")
    setShowReceiptDialog(false)
    setCurrentReceipt(null)
    alert("Order completed successfully!")
  }

  const handleStaffLogin = () => {
    console.log("[v0] Navigating to staff login...")
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-secondary border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-4">
            <Image src="/logo.png" alt="Maria Havens" width={100} height={50} className="object-contain sm:w-[120px]" />
            <div className="text-center sm:text-left">
              <h1 className="text-lg sm:text-xl font-bold text-secondary-foreground">Central POS System</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Maria Havens Restaurant</p>
            </div>
          </div>
          <Button
            onClick={handleStaffLogin}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            <LogIn className="h-4 w-4" />
            <span>Staff Login</span>
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-2 sm:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Menu Section */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Menu</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                  <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
                    {categories.map((category) => (
                      <TabsTrigger key={category} value={category} className="text-xs sm:text-sm">
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <TabsContent value={selectedCategory} className="mt-4">
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                      {filteredItems.map((item) => (
                        <Card
                          key={item.id}
                          className="cursor-pointer hover:border-primary transition-colors"
                          onClick={() => addToCart(item)}
                        >
                          <CardContent className="p-2 sm:p-4">
                            <div className="aspect-square bg-muted rounded-md mb-2 flex items-center justify-center">
                              <span className="text-2xl sm:text-4xl">🍽️</span>
                            </div>
                            <h3 className="font-semibold text-xs sm:text-sm mb-1 line-clamp-1">{item.name}</h3>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2 hidden sm:block">
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-primary text-xs sm:text-sm">
                                KES {item.price.toFixed(2)}
                              </span>
                              <Badge variant={item.available ? "default" : "secondary"} className="text-xs">
                                {item.available ? "Available" : "Out"}
                              </Badge>
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

          {/* Cart Section */}
          <div className="space-y-4">
            <Card className="lg:sticky lg:top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                  Current Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Table Selection */}
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Table Number</Label>
                  <Select value={selectedTable} onValueChange={setSelectedTable}>
                    <SelectTrigger className="text-xs sm:text-sm">
                      <SelectValue placeholder="Select table" />
                    </SelectTrigger>
                    <SelectContent>
                      {tables.map((table) => (
                        <SelectItem key={table.id} value={table.number} className="text-xs sm:text-sm">
                          Table {table.number} ({table.capacity} seats)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Waiter Selection */}
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Waiter</Label>
                  <Select value={selectedWaiter} onValueChange={setSelectedWaiter}>
                    <SelectTrigger className="text-xs sm:text-sm">
                      <SelectValue placeholder="Select waiter" />
                    </SelectTrigger>
                    <SelectContent>
                      {waiters.map((waiter) => (
                        <SelectItem key={waiter.id} value={waiter.id} className="text-xs sm:text-sm">
                          {waiter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Cart Items */}
                <ScrollArea className="h-[250px] sm:h-[300px]">
                  {cart.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-xs sm:text-sm">No items in cart</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div key={item.menuItem.id} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs sm:text-sm truncate">{item.menuItem.name}</p>
                            <p className="text-xs text-muted-foreground">KES {item.menuItem.price.toFixed(2)} each</p>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-6 w-6 bg-transparent"
                              onClick={() => updateQuantity(item.menuItem.id, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 sm:w-8 text-center font-medium text-xs sm:text-sm">
                              {item.quantity}
                            </span>
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
                  )}
                </ScrollArea>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Subtotal:</span>
                    <span>KES {calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Tax (10%):</span>
                    <span>KES {calculateTax().toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-base sm:text-lg">
                    <span>Total:</span>
                    <span className="text-primary">KES {(calculateTotal() + calculateTax()).toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm"
                  onClick={handlePlaceOrder}
                  disabled={cart.length === 0}
                >
                  <Receipt className="h-4 w-4 mr-2" />
                  Place Order & Generate Receipt
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* PIN Verification Dialog */}
      <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Verify Waiter PIN</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Please enter your PIN to confirm the order and generate receipt
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Waiter</Label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <User className="h-4 w-4" />
                <span className="font-medium text-xs sm:text-sm">
                  {waiters.find((w) => w.id === selectedWaiter)?.name}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="waiter-pin" className="text-xs sm:text-sm">
                Enter PIN
              </Label>
              <Input
                id="waiter-pin"
                type="password"
                placeholder="4-digit PIN"
                maxLength={4}
                value={waiterPin}
                onChange={(e) => setWaiterPin(e.target.value.replace(/\D/g, ""))}
                className="text-center text-xl sm:text-2xl tracking-widest"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-transparent text-xs sm:text-sm"
                onClick={() => {
                  setShowPinDialog(false)
                  setWaiterPin("")
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-xs sm:text-sm"
                onClick={verifyPinAndGenerateReceipt}
                disabled={waiterPin.length !== 4}
              >
                Verify & Generate
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader className="no-print">
            <DialogTitle className="text-base sm:text-lg">Order Receipt</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">Receipt generated successfully</DialogDescription>
          </DialogHeader>

          {currentReceipt && (
            <div id="receipt" className="space-y-4">
              {/* Receipt Content */}
              <div className="text-center space-y-2">
                <Image
                  src="/logo.png"
                  alt="Maria Havens"
                  width={150}
                  height={75}
                  className="mx-auto object-contain sm:w-[200px]"
                />
                <h2 className="font-bold text-base sm:text-lg">MARIA HAVENS</h2>
                <p className="text-xs sm:text-sm">Homes & Restaurant</p>
                <p className="text-xs text-muted-foreground">
                  123 Restaurant Street, City
                  <br />
                  Tel: (123) 456-7890
                </p>
              </div>

              <Separator />

              <div className="space-y-1 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span>Receipt #:</span>
                  <span className="font-mono text-xs">{currentReceipt.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order #:</span>
                  <span className="font-mono text-xs">{currentReceipt.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Table:</span>
                  <span>{currentReceipt.tableNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Served by:</span>
                  <span>{currentReceipt.waiterName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="text-xs">{currentReceipt.createdAt.toLocaleString()}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-semibold text-xs sm:text-sm">Items:</h3>
                {currentReceipt.items.map((item: OrderItem, index: number) => (
                  <div key={index} className="flex justify-between text-xs sm:text-sm">
                    <span className="flex-1">
                      {item.quantity}x {item.menuItem.name}
                    </span>
                    <span className="font-medium">KES {(item.menuItem.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-1 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>KES {currentReceipt.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%):</span>
                  <span>KES {currentReceipt.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base sm:text-lg">
                  <span>Total:</span>
                  <span>KES {currentReceipt.total.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <p className="text-center text-xs text-muted-foreground">
                Thank you for dining with us!
                <br />
                Please come again
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 no-print">
            <Button variant="outline" className="flex-1 bg-transparent text-xs sm:text-sm" onClick={printReceipt}>
              Print Receipt
            </Button>
            <Button className="flex-1 bg-primary hover:bg-primary/90 text-xs sm:text-sm" onClick={completeOrder}>
              Complete Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
