"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  LogOut,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Clock,
  Star,
  Award,
  Users,
  ChefHat,
  CheckCircle,
} from "lucide-react"
import { getAuthFromCookies, clearAuthCookies } from "@/lib/auth"
import { orders } from "@/lib/data"

export default function WaiterDashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const auth = getAuthFromCookies()
    if (!auth || auth.userRole !== "waiter") {
      router.push("/login")
      return
    }
    setUserName(auth.userName)
    setUserId(auth.userId)
  }, [router])

  const handleLogout = () => {
    clearAuthCookies()
    router.push("/")
  }

  const myOrders = orders.filter((order) => order.waiterId === userId)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayOrders = myOrders.filter((order) => {
    const orderDate = new Date(order.createdAt)
    orderDate.setHours(0, 0, 0, 0)
    return orderDate.getTime() === today.getTime()
  })

  const performance = {
    ordersToday: todayOrders.length,
    salesToday: todayOrders.reduce((sum, order) => sum + order.total, 0),
    averageOrderValue:
      todayOrders.length > 0 ? todayOrders.reduce((sum, order) => sum + order.total, 0) / todayOrders.length : 0,
    tablesServed: new Set(todayOrders.map((order) => order.tableNumber)).size,
    averageServiceTime: 18, // minutes
    customerRating: 4.8,
    totalOrders: myOrders.length,
    totalSales: myOrders.reduce((sum, order) => sum + order.total, 0),
  }

  const recentOrders = myOrders
    .slice(-10)
    .reverse()
    .map((order) => ({
      id: order.id,
      table: order.tableNumber,
      items: order.items.length,
      total: order.total,
      status: order.status,
      time: new Date(order.createdAt).toLocaleTimeString(),
    }))

  // Calculate top items from orders
  const itemCounts: Record<string, number> = {}
  myOrders.forEach((order) => {
    order.items.forEach((item) => {
      const name = item.menuItem.name
      itemCounts[name] = (itemCounts[name] || 0) + item.quantity
    })
  })
  const topItems = Object.entries(itemCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([name, count]) => ({ name, count }))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-secondary border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-4">
            <Image src="/logo.png" alt="Maria Havens" width={100} height={50} className="object-contain sm:w-[120px]" />
            <div className="text-center sm:text-left">
              <h1 className="text-lg sm:text-xl font-bold text-secondary-foreground">Waiter Dashboard</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Welcome, {userName}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push("/")} className="bg-primary hover:bg-primary/90 text-xs sm:text-sm">
              Go to POS
            </Button>
            <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent text-xs sm:text-sm">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="overview" className="gap-2 text-xs sm:text-sm">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2 text-xs sm:text-sm">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">My Orders</span>
              <span className="sm:hidden">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="gap-2 text-xs sm:text-sm">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Performance</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2 text-xs sm:text-sm">
                    <ShoppingCart className="h-4 w-4" />
                    Orders Today
                  </CardDescription>
                  <CardTitle className="text-2xl sm:text-3xl text-primary">{performance.ordersToday}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {performance.ordersToday > 0 ? "Great work!" : "Start taking orders"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2 text-xs sm:text-sm">
                    <DollarSign className="h-4 w-4" />
                    Sales Today
                  </CardDescription>
                  <CardTitle className="text-2xl sm:text-3xl text-primary">
                    KES {performance.salesToday.toFixed(2)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Avg: KES {performance.averageOrderValue.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2 text-xs sm:text-sm">
                    <Star className="h-4 w-4" />
                    Customer Rating
                  </CardDescription>
                  <CardTitle className="text-2xl sm:text-3xl text-primary">{performance.customerRating}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Excellent service!</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Recent Orders</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Your latest orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentOrders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-xs sm:text-sm">No orders yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentOrders.slice(0, 4).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                          <div>
                            <p className="font-medium text-xs sm:text-sm">{order.id}</p>
                            <p className="text-xs text-muted-foreground">
                              Table {order.table} • {order.items} items • {order.time}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary text-xs sm:text-sm">KES {order.total.toFixed(2)}</p>
                            <Badge
                              variant={
                                order.status === "completed"
                                  ? "default"
                                  : order.status === "ready"
                                    ? "secondary"
                                    : "outline"
                              }
                              className="text-xs"
                            >
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Top Selling Items</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Your most ordered items</CardDescription>
                </CardHeader>
                <CardContent>
                  {topItems.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <ChefHat className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-xs sm:text-sm">No items sold yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {topItems.map((item, index) => (
                        <div key={item.name} className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-xs sm:text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-xs sm:text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.count} orders</p>
                          </div>
                          <ChefHat className="h-5 w-5 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">All My Orders</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Complete order history</CardDescription>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No orders yet. Start taking orders from the POS!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs sm:text-sm">Order ID</TableHead>
                          <TableHead className="text-xs sm:text-sm">Table</TableHead>
                          <TableHead className="text-xs sm:text-sm">Items</TableHead>
                          <TableHead className="text-xs sm:text-sm">Total</TableHead>
                          <TableHead className="text-xs sm:text-sm">Status</TableHead>
                          <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-mono text-xs sm:text-sm">{order.id}</TableCell>
                            <TableCell className="text-xs sm:text-sm">Table {order.table}</TableCell>
                            <TableCell className="text-xs sm:text-sm">{order.items} items</TableCell>
                            <TableCell className="font-bold text-xs sm:text-sm">KES {order.total.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  order.status === "completed"
                                    ? "default"
                                    : order.status === "ready"
                                      ? "secondary"
                                      : "outline"
                                }
                                className="text-xs"
                              >
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-xs sm:text-sm hidden sm:table-cell">
                              {order.time}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              <Card>
                <CardHeader className="pb-2 p-3 sm:p-6">
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                    Tables Served
                  </CardDescription>
                  <CardTitle className="text-2xl sm:text-3xl">{performance.tablesServed}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                  <p className="text-xs text-muted-foreground">Today</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 p-3 sm:p-6">
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    Avg Service Time
                  </CardDescription>
                  <CardTitle className="text-2xl sm:text-3xl">{performance.averageServiceTime}m</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                  <p className="text-xs text-muted-foreground">Per table</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 p-3 sm:p-6">
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                    Total Orders
                  </CardDescription>
                  <CardTitle className="text-2xl sm:text-3xl">{performance.totalOrders}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 p-3 sm:p-6">
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                    Total Sales
                  </CardDescription>
                  <CardTitle className="text-xl sm:text-3xl">KES {performance.totalSales.toFixed(0)}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Award className="h-5 w-5 text-primary" />
                  Performance Summary
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Your overall performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted rounded-md gap-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    <div>
                      <p className="font-semibold text-sm sm:text-base">
                        {performance.totalOrders > 50 ? "Excellent Performance" : "Keep Going!"}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {performance.totalOrders > 50 ? "You're doing great!" : "Continue taking orders to improve"}
                      </p>
                    </div>
                  </div>
                  <Star className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-md">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Customer Satisfaction</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary">98%</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Order Accuracy</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary">99.5%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
