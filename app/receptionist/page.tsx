"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  DoorOpen,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Phone,
  Mail,
} from "lucide-react"
import { getAuthFromCookies, clearAuthCookies } from "@/lib/auth"

export default function ReceptionistDashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [showCheckInDialog, setShowCheckInDialog] = useState(false)
  const [showReservationDialog, setShowReservationDialog] = useState(false)
  const [showCheckOutDialog, setShowCheckOutDialog] = useState(false)

  useEffect(() => {
    const auth = getAuthFromCookies()
    if (!auth || auth.userRole !== "reception") {
      router.push("/")
      return
    }
    setUserName(auth.userName)
  }, [router])

  const handleLogout = () => {
    clearAuthCookies()
    router.push("/")
  }

  // Mock performance data
  const performance = {
    guestsCheckedIn: 45,
    roomsOccupied: 28,
    totalRooms: 50,
    reservationsToday: 12,
    totalRevenue: 8945.67,
    pendingCheckouts: 5,
    averageStayDuration: 3.2,
    occupancyRate: 56,
  }

  const recentCheckIns = [
    { id: "G-001", name: "John Smith", room: "101", checkIn: "10:30 AM", status: "checked-in", phone: "+1234567890" },
    {
      id: "G-002",
      name: "Sarah Johnson",
      room: "205",
      checkIn: "11:15 AM",
      status: "checked-in",
      phone: "+1234567891",
    },
    { id: "G-003", name: "Mike Brown", room: "308", checkIn: "2:45 PM", status: "pending", phone: "+1234567892" },
    { id: "G-004", name: "Emily Davis", room: "412", checkIn: "3:20 PM", status: "checked-in", phone: "+1234567893" },
  ]

  const upcomingReservations = [
    { id: "R-001", name: "David Wilson", room: "203", date: "Today, 5:00 PM", nights: 2, email: "david@email.com" },
    { id: "R-002", name: "Lisa Anderson", room: "305", date: "Today, 6:30 PM", nights: 3, email: "lisa@email.com" },
    { id: "R-003", name: "Tom Martinez", room: "410", date: "Tomorrow, 2:00 PM", nights: 1, email: "tom@email.com" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
              <h1 className="text-lg sm:text-xl font-bold text-secondary-foreground">Reception Dashboard</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Welcome, {userName}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent self-end sm:self-auto">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-2 sm:p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto mb-4">
            <TabsTrigger value="overview" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger value="checkins" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Check-ins</span>
              <span className="sm:hidden">In</span>
            </TabsTrigger>
            <TabsTrigger value="reservations" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Reservations</span>
              <span className="sm:hidden">Book</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="gap-1 sm:gap-2 text-xs sm:text-sm">
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Performance</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              <Card>
                <CardHeader className="pb-2 p-3 sm:p-6">
                  <CardDescription className="flex items-center gap-1 sm:gap-2 text-xs">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Guests Today</span>
                    <span className="sm:hidden">Guests</span>
                  </CardDescription>
                  <CardTitle className="text-2xl sm:text-3xl text-primary">{performance.guestsCheckedIn}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                  <p className="text-xs text-muted-foreground">+8 from yesterday</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 p-3 sm:p-6">
                  <CardDescription className="flex items-center gap-1 sm:gap-2 text-xs">
                    <DoorOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Rooms</span>
                    <span className="sm:hidden">Rooms</span>
                  </CardDescription>
                  <CardTitle className="text-xl sm:text-3xl text-primary">
                    {performance.roomsOccupied}/{performance.totalRooms}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                  <p className="text-xs text-muted-foreground">{performance.occupancyRate}% occupancy</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 p-3 sm:p-6">
                  <CardDescription className="flex items-center gap-1 sm:gap-2 text-xs">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Reservations</span>
                    <span className="sm:hidden">Bookings</span>
                  </CardDescription>
                  <CardTitle className="text-2xl sm:text-3xl text-primary">{performance.reservationsToday}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                  <p className="text-xs text-muted-foreground">Today</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 p-3 sm:p-6">
                  <CardDescription className="flex items-center gap-1 sm:gap-2 text-xs">
                    <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Revenue</span>
                    <span className="sm:hidden">Sales</span>
                  </CardDescription>
                  <CardTitle className="text-xl sm:text-3xl text-primary">
                    KES {performance.totalRevenue.toFixed(0)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                  <p className="text-xs text-muted-foreground">+12% from yesterday</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-base sm:text-lg">Recent Check-ins</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Latest guest arrivals</CardDescription>
                    </div>
                    <Dialog open={showCheckInDialog} onOpenChange={setShowCheckInDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                          <Plus className="h-4 w-4 mr-1" />
                          New Check-in
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[95vw] sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>New Guest Check-in</DialogTitle>
                          <DialogDescription>Enter guest details for check-in</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="guest-name">Guest Name</Label>
                            <Input id="guest-name" placeholder="John Doe" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="guest-phone">Phone Number</Label>
                            <Input id="guest-phone" type="tel" placeholder="+1234567890" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="guest-email">Email</Label>
                            <Input id="guest-email" type="email" placeholder="guest@email.com" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="room-number">Room Number</Label>
                            <Input id="room-number" placeholder="101" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="nights">Number of Nights</Label>
                            <Input id="nights" type="number" placeholder="2" />
                          </div>
                          <Button className="w-full bg-primary hover:bg-primary/90">Complete Check-in</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentCheckIns.map((guest) => (
                      <div
                        key={guest.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-muted rounded-md gap-2"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm sm:text-base">{guest.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Room {guest.room} • {guest.checkIn}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Phone className="h-3 w-3" />
                            {guest.phone}
                          </p>
                        </div>
                        <Badge variant={guest.status === "checked-in" ? "default" : "secondary"} className="text-xs">
                          {guest.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-base sm:text-lg">Upcoming Reservations</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Next arrivals</CardDescription>
                    </div>
                    <Dialog open={showReservationDialog} onOpenChange={setShowReservationDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="bg-transparent w-full sm:w-auto">
                          <Plus className="h-4 w-4 mr-1" />
                          New Reservation
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[95vw] sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>New Reservation</DialogTitle>
                          <DialogDescription>Create a new room reservation</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="res-name">Guest Name</Label>
                            <Input id="res-name" placeholder="John Doe" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="res-email">Email</Label>
                            <Input id="res-email" type="email" placeholder="guest@email.com" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="res-phone">Phone</Label>
                            <Input id="res-phone" type="tel" placeholder="+1234567890" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="res-room">Room Number</Label>
                            <Input id="res-room" placeholder="203" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="res-date">Check-in Date</Label>
                              <Input id="res-date" type="date" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="res-nights">Nights</Label>
                              <Input id="res-nights" type="number" placeholder="2" />
                            </div>
                          </div>
                          <Button className="w-full bg-primary hover:bg-primary/90">Create Reservation</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingReservations.map((reservation) => (
                      <div
                        key={reservation.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-muted rounded-md gap-2"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm sm:text-base">{reservation.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Room {reservation.room} • {reservation.nights} nights
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Mail className="h-3 w-3" />
                            {reservation.email}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{reservation.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {performance.pendingCheckouts > 0 && (
              <Card className="border-primary/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Pending Checkouts
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Guests scheduled to check out today</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xl sm:text-2xl font-bold text-primary mb-4">
                    {performance.pendingCheckouts} guests
                  </p>
                  <Dialog open={showCheckOutDialog} onOpenChange={setShowCheckOutDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">Process Checkouts</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Process Checkout</DialogTitle>
                        <DialogDescription>Select guest to check out</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="checkout-search">Search Guest</Label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="checkout-search" placeholder="Guest name or room number" className="pl-10" />
                          </div>
                        </div>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {recentCheckIns
                            .filter((g) => g.status === "checked-in")
                            .map((guest) => (
                              <div key={guest.id} className="p-3 border rounded-md hover:bg-muted cursor-pointer">
                                <p className="font-medium">{guest.name}</p>
                                <p className="text-xs text-muted-foreground">Room {guest.room}</p>
                              </div>
                            ))}
                        </div>
                        <Button className="w-full bg-primary hover:bg-primary/90">Complete Checkout</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Check-ins Tab */}
          <TabsContent value="checkins" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base sm:text-lg">All Check-ins</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Manage guest check-ins</CardDescription>
                  </div>
                  <Button
                    className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                    onClick={() => setShowCheckInDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Check-in
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Guest ID</TableHead>
                        <TableHead className="text-xs sm:text-sm">Name</TableHead>
                        <TableHead className="text-xs sm:text-sm">Room</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Check-in Time</TableHead>
                        <TableHead className="text-xs sm:text-sm">Status</TableHead>
                        <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentCheckIns.map((guest) => (
                        <TableRow key={guest.id}>
                          <TableCell className="font-mono text-xs sm:text-sm">{guest.id}</TableCell>
                          <TableCell className="font-medium text-xs sm:text-sm">{guest.name}</TableCell>
                          <TableCell className="text-xs sm:text-sm">Room {guest.room}</TableCell>
                          <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{guest.checkIn}</TableCell>
                          <TableCell>
                            <Badge
                              variant={guest.status === "checked-in" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {guest.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" className="bg-transparent text-xs">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reservations Tab */}
          <TabsContent value="reservations" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base sm:text-lg">All Reservations</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Manage guest reservations</CardDescription>
                  </div>
                  <Button
                    className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                    onClick={() => setShowReservationDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Reservation
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Reservation ID</TableHead>
                        <TableHead className="text-xs sm:text-sm">Guest Name</TableHead>
                        <TableHead className="text-xs sm:text-sm">Room</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Arrival</TableHead>
                        <TableHead className="text-xs sm:text-sm">Nights</TableHead>
                        <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingReservations.map((reservation) => (
                        <TableRow key={reservation.id}>
                          <TableCell className="font-mono text-xs sm:text-sm">{reservation.id}</TableCell>
                          <TableCell className="font-medium text-xs sm:text-sm">{reservation.name}</TableCell>
                          <TableCell className="text-xs sm:text-sm">Room {reservation.room}</TableCell>
                          <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{reservation.date}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{reservation.nights}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" className="bg-transparent text-xs">
                              Check In
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              <Card>
                <CardHeader className="pb-2 p-3 sm:p-6">
                  <CardDescription className="flex items-center gap-1 sm:gap-2 text-xs">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                    Total Guests
                  </CardDescription>
                  <CardTitle className="text-2xl sm:text-3xl">{performance.guestsCheckedIn}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 p-3 sm:p-6">
                  <CardDescription className="flex items-center gap-1 sm:gap-2 text-xs">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    Avg Stay
                  </CardDescription>
                  <CardTitle className="text-2xl sm:text-3xl">{performance.averageStayDuration}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                  <p className="text-xs text-muted-foreground">Nights</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 p-3 sm:p-6">
                  <CardDescription className="flex items-center gap-1 sm:gap-2 text-xs">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                    Occupancy
                  </CardDescription>
                  <CardTitle className="text-2xl sm:text-3xl">{performance.occupancyRate}%</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                  <p className="text-xs text-muted-foreground">Current</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2 p-3 sm:p-6">
                  <CardDescription className="flex items-center gap-1 sm:gap-2 text-xs">
                    <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                    Revenue
                  </CardDescription>
                  <CardTitle className="text-xl sm:text-3xl">KES {performance.totalRevenue.toFixed(0)}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Performance Summary
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">Your overall performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted rounded-md gap-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    <div>
                      <p className="font-semibold text-sm sm:text-base">Outstanding Performance</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Excellent guest service ratings</p>
                    </div>
                  </div>
                  <Badge className="bg-primary">Top Performer</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-md">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Guest Satisfaction</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary">97%</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">Check-in Efficiency</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary">95%</p>
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
