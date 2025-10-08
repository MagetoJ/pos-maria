"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  LogOut,
  Users,
  UtensilsCrossed,
  BarChart3,
  Settings,
  Plus,
  Pencil,
  Trash2,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  ChefHat,
  DoorOpen,
  Award,
} from "lucide-react"
import { tables, orders, getAllWaitersPerformance } from "@/lib/data" // Keep these for now for overview stats
import { getAuthFromCookies, clearAuthCookies } from "@/lib/auth"
import type { User, MenuItem } from "@/lib/types"

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [userName, setUserName] = useState("")
  const [showAddStaffDialog, setShowAddStaffDialog] = useState(false)
  const [showAddMenuDialog, setShowAddMenuDialog] = useState(false)
  const [menuImage, setMenuImage] = useState<string | null>(null)
  const [staffImage, setStaffImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const staffFileInputRef = useRef<HTMLInputElement>(null)

  // State for data fetched from the backend
  const [staff, setStaff] = useState<User[]>([])
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // These can be replaced later with backend calculations
  const waitersPerformance = getAllWaitersPerformance()
  const totalSalesToday = orders
    .filter((o) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return o.createdAt >= today && o.status === "completed"
    })
    .reduce((sum, o) => sum + o.total, 0)

  const totalOrdersToday = orders.filter((o) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return o.createdAt >= today
  }).length

  useEffect(() => {
    const auth = getAuthFromCookies()
    if (!auth || (auth.userRole !== "admin" && auth.userRole !== "manager")) {
      router.push("/")
      return
    }
    setUserName(auth.userName)

    async function fetchData() {
      setIsLoading(true)
      try {
        const [staffRes, menuRes] = await Promise.all([
          fetch('/api/staff'),
          fetch('/api/menu')
        ]);
        const staffData = await staffRes.json();
        const menuData = await menuRes.json();
        setStaff(staffData);
        setMenu(menuData);
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [router])

  const handleLogout = () => {
    clearAuthCookies()
    router.push("/")
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "menu" | "staff") => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (type === "menu") {
          setMenuImage(reader.result as string)
        } else {
          setStaffImage(reader.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Handler for adding a new menu item
  const handleAddMenuItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newItem = {
        name: formData.get('item-name'),
        description: formData.get('item-description'),
        category: formData.get('item-category'),
        price: formData.get('item-price'),
    };

    try {
        const response = await fetch('/api/menu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem),
        });

        if (response.ok) {
            const addedItem = await response.json();
            setMenu([...menu, addedItem]); // Optimistically update UI
            setShowAddMenuDialog(false);
        } else {
            alert('Failed to add menu item.');
        }
    } catch (error) {
        console.error("Error adding menu item:", error);
        alert('An error occurred.');
    }
  };

  if (isLoading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Loading admin dashboard...</p>
        </div>
    )
  }


  return (
    <div className="min-h-screen bg-background">
      <header className="bg-secondary border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-4">
            <Image
              src="/logo.png"
              alt="Maria Havens"
              width={100}
              height={50}
              className="object-contain sm:w-[120px] sm:h-[60px]"
            />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-secondary-foreground">Admin Dashboard</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Welcome, {userName}</p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Link href="/">
              <Button variant="outline" className="bg-transparent flex-1 sm:flex-none text-xs sm:text-sm">
                Go to POS
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2 bg-transparent flex-1 sm:flex-none text-xs sm:text-sm"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-2 sm:p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 lg:w-auto mb-4">
            <TabsTrigger value="overview" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <Award className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Performance</span>
              <span className="sm:hidden">Perf</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              Staff
            </TabsTrigger>
            <TabsTrigger value="menu" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <UtensilsCrossed className="h-3 w-3 sm:h-4 sm:w-4" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="tables" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <DoorOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Tables</span>
              <span className="sm:hidden">Tables</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-1 sm:gap-2 text-xs sm:text-sm col-span-2 sm:col-span-1">
              <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              <Card>
                <CardHeader className="pb-2 p-3 sm:p-6">
                  <CardDescription className="flex items-center gap-1 sm:gap-2 text-xs">
                    <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Today's Sales</span>
                    <span className="sm:hidden">Sales</span>
                  </CardDescription>
                  <CardTitle className="text-xl sm:text-3xl text-primary">KES {totalSalesToday.toFixed(2)}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                  <p className="text-xs text-muted-foreground">+12% from yesterday</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 p-3 sm:p-6">
                  <CardDescription className="flex items-center gap-1 sm:gap-2 text-xs">
                    <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                    Orders
                  </CardDescription>
                  <CardTitle className="text-xl sm:text-3xl">{totalOrdersToday}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                  <p className="text-xs text-muted-foreground">
                    {orders.filter((o) => o.status === "pending").length} pending
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 p-3 sm:p-6">
                  <CardDescription className="flex items-center gap-1 sm:gap-2 text-xs">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Active Staff</span>
                    <span className="sm:hidden">Staff</span>
                  </CardDescription>
                  <CardTitle className="text-xl sm:text-3xl">{staff.filter((u) => u.isActive).length}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                  <p className="text-xs text-muted-foreground">
                    {staff.filter((u) => u.role === "waiter" && u.isActive).length} waiters on shift
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 p-3 sm:p-6">
                  <CardDescription className="flex items-center gap-1 sm:gap-2 text-xs">
                    <DoorOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                    Tables
                  </CardDescription>
                  <CardTitle className="text-xl sm:text-3xl">
                    {tables.filter((t) => t.status === "occupied").length}/{tables.length}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                  <p className="text-xs text-muted-foreground">
                    {Math.round((tables.filter((t) => t.status === "occupied").length / tables.length) * 100)}%
                    occupancy
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                    Sales Analytics
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Revenue trends and insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm">This Week</span>
                      <span className="font-bold text-primary text-sm sm:text-base">
                        KES {(totalSalesToday * 7).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm">This Month</span>
                      <span className="font-bold text-primary text-sm sm:text-base">
                        KES {(totalSalesToday * 30).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm">This Year</span>
                      <span className="font-bold text-primary text-sm sm:text-base">
                        KES {(totalSalesToday * 365).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <ChefHat className="h-4 w-4 sm:h-5 sm:w-5" />
                    Top Selling Items
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Most popular menu items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {menu.slice(0, 4).map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            {index + 1}
                          </span>
                          <span className="text-xs sm:text-sm">{item.name}</span>
                        </div>
                        <span className="text-xs sm:text-sm font-medium">KES {item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5" />
                  Staff Performance Dashboard
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Track individual waiter sales and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {waitersPerformance.map(({ waiter, performance }) => (
                    <Card key={waiter.id} className="border-2">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-sm sm:text-base">{waiter.name}</CardTitle>
                              <CardDescription className="text-xs">{waiter.email}</CardDescription>
                            </div>
                          </div>
                          <Badge variant="default" className="text-xs">
                            Active
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Today's Sales</p>
                            <p className="text-base sm:text-lg font-bold text-primary">
                              KES {performance.salesToday.toFixed(2)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Orders Today</p>
                            <p className="text-base sm:text-lg font-bold">{performance.ordersToday}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Total Sales</p>
                            <p className="text-base sm:text-lg font-bold text-primary">
                              KES {performance.totalSales.toFixed(2)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Total Orders</p>
                            <p className="text-base sm:text-lg font-bold">{performance.totalOrders}</p>
                          </div>
                        </div>
                        {performance.recentOrders.length > 0 && (
                          <div className="mt-4">
                            <p className="text-xs font-semibold mb-2">Recent Orders:</p>
                            <div className="space-y-2">
                              {performance.recentOrders.slice(0, 3).map((order) => (
                                <div
                                  key={order.id}
                                  className="flex items-center justify-between text-xs p-2 bg-muted rounded"
                                >
                                  <span className="font-mono">{order.id}</span>
                                  <span>Table {order.tableNumber}</span>
                                  <span className="font-medium">KES {order.total.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base sm:text-lg">Staff Management</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Manage your restaurant staff and their access
                    </CardDescription>
                  </div>
                  <Dialog open={showAddStaffDialog} onOpenChange={setShowAddStaffDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Staff
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Staff Member</DialogTitle>
                        <DialogDescription>Enter the details of the new staff member</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Staff Photo</Label>
                          <div className="flex flex-col items-center gap-3">
                            {staffImage ? (
                              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary">
                                <Image
                                  src={staffImage || "/placeholder.svg"}
                                  alt="Staff"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                                <Users className="h-12 w-12 text-muted-foreground" />
                              </div>
                            )}
                            <input
                              ref={staffFileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, "staff")}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => staffFileInputRef.current?.click()}
                              className="bg-transparent"
                            >
                              Upload Photo
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="staff-name">Full Name</Label>
                          <Input id="staff-name" placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="staff-email">Email</Label>
                          <Input id="staff-email" type="email" placeholder="john@mariahavens.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="staff-role">Role</Label>
                          <Select>
                            <SelectTrigger id="staff-role">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="waiter">Waiter</SelectItem>
                              <SelectItem value="kitchen">Kitchen Staff</SelectItem>
                              <SelectItem value="reception">Receptionist</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="staff-pin">PIN (4 digits)</Label>
                          <Input id="staff-pin" type="password" maxLength={4} placeholder="1234" />
                        </div>
                        <Button className="w-full bg-primary hover:bg-primary/90">Add Staff Member</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Name</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">Email</TableHead>
                        <TableHead className="text-xs sm:text-sm">Role</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">PIN</TableHead>
                        <TableHead className="text-xs sm:text-sm">Status</TableHead>
                        <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staff.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium text-xs sm:text-sm">{user.name}</TableCell>
                          <TableCell className="text-xs sm:text-sm hidden md:table-cell">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs sm:text-sm hidden sm:table-cell">****</TableCell>
                          <TableCell>
                            <Badge variant={user.isActive ? "default" : "secondary"} className="text-xs">
                              {user.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 sm:gap-2">
                              <Button size="icon" variant="outline" className="h-7 w-7 sm:h-8 sm:w-8 bg-transparent">
                                <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              <Button size="icon" variant="outline" className="h-7 w-7 sm:h-8 sm:w-8 bg-transparent">
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Menu Tab */}
          <TabsContent value="menu" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base sm:text-lg">Menu Management</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Manage your restaurant menu items</CardDescription>
                  </div>
                  <Dialog open={showAddMenuDialog} onOpenChange={setShowAddMenuDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Menu Item</DialogTitle>
                        <DialogDescription>Enter the details of the new menu item</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddMenuItem} className="space-y-4">
                        <div className="space-y-2">
                          <Label>Item Image</Label>
                          <div className="flex flex-col items-center gap-3">
                            {menuImage ? (
                              <div className="relative w-full h-40 rounded-md overflow-hidden border-2 border-primary">
                                <Image
                                  src={menuImage || "/placeholder.svg"}
                                  alt="Menu item"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-full h-40 rounded-md bg-muted flex items-center justify-center">
                                <UtensilsCrossed className="h-12 w-12 text-muted-foreground" />
                              </div>
                            )}
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, "menu")}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full bg-transparent"
                            >
                              Upload Image from Computer
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="item-name">Item Name</Label>
                          <Input id="item-name" name="item-name" placeholder="Grilled Chicken" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="item-description">Description</Label>
                          <Input id="item-description" name="item-description" placeholder="Tender grilled chicken with herbs" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="item-category">Category</Label>
                          <Select name="item-category">
                            <SelectTrigger id="item-category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="appetizer">Appetizer</SelectItem>
                              <SelectItem value="main">Main Course</SelectItem>
                              <SelectItem value="side">Side</SelectItem>
                              <SelectItem value="dessert">Dessert</SelectItem>
                              <SelectItem value="beverage">Beverage</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="item-price">Price (KES)</Label>
                          <Input id="item-price" name="item-price" type="number" step="0.01" placeholder="1599.00" required />
                        </div>
                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">Add Menu Item</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Name</TableHead>
                        <TableHead className="text-xs sm:text-sm">Category</TableHead>
                        <TableHead className="text-xs sm:text-sm">Price</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Status</TableHead>
                        <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {menu.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-xs sm:text-sm">{item.name}</p>
                              <p className="text-xs text-muted-foreground hidden sm:block">{item.description}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs sm:text-sm">KES {item.price.toFixed(2)}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant={item.available ? "default" : "secondary"} className="text-xs">
                              {item.available ? "Available" : "Out of Stock"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 sm:gap-2">
                              <Button size="icon" variant="outline" className="h-7 w-7 sm:h-8 sm:w-8 bg-transparent">
                                <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              <Button size="icon" variant="outline" className="h-7 w-7 sm:h-8 sm:w-8 bg-transparent">
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tables Tab */}
          <TabsContent value="tables" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base sm:text-lg">Table Management</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Manage restaurant tables and seating
                    </CardDescription>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Table
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {tables.map((table) => (
                    <Card key={table.id} className="border-2">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-sm sm:text-lg">Table {table.number}</h3>
                          <Badge
                            variant={
                              table.status === "available"
                                ? "default"
                                : table.status === "occupied"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {table.status}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                          Capacity: {table.capacity} seats
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent text-xs">
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent text-xs">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">System Settings</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Configure your POS system settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Restaurant Name</Label>
                  <Input defaultValue="Maria Havens" className="text-xs sm:text-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Address</Label>
                  <Input defaultValue="123 Restaurant Street, City" className="text-xs sm:text-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Phone</Label>
                  <Input defaultValue="(123) 456-7890" className="text-xs sm:text-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Tax Rate (%)</Label>
                  <Input type="number" defaultValue="10" className="text-xs sm:text-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Currency</Label>
                  <Select defaultValue="kes">
                    <SelectTrigger className="text-xs sm:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kes">KES (Kenyan Shilling)</SelectItem>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Require PIN for Orders</Label>
                  <Select defaultValue="yes">
                    <SelectTrigger className="text-xs sm:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Receipt Footer Message</Label>
                  <Input
                    defaultValue="Thank you for dining with us! Please come again"
                    className="text-xs sm:text-sm"
                  />
                </div>
                <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}