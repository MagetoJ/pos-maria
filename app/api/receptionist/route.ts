import { NextResponse } from "next/server";

export async function GET() {
  // In a real application, you would fetch this data from your database.
  const performance = {
    guestsCheckedIn: 45,
    roomsOccupied: 28,
    totalRooms: 50,
    reservationsToday: 12,
    totalRevenue: 8945.67,
    pendingCheckouts: 5,
    averageStayDuration: 3.2,
    occupancyRate: 56,
  };

  const recentCheckIns = [
    {
      id: "G-001",
      name: "John Smith",
      room: "101",
      checkIn: "10:30 AM",
      status: "checked-in",
      phone: "+1234567890",
    },
    {
      id: "G-002",
      name: "Sarah Johnson",
      room: "205",
      checkIn: "11:15 AM",
      status: "checked-in",
      phone: "+1234567891",
    },
    {
      id: "G-003",
      name: "Mike Brown",
      room: "308",
      checkIn: "2:45 PM",
      status: "pending",
      phone: "+1234567892",
    },
    {
      id: "G-004",
      name: "Emily Davis",
      room: "412",
      checkIn: "3:20 PM",
      status: "checked-in",
      phone: "+1234567893",
    },
  ];

  const upcomingReservations = [
    {
      id: "R-001",
      name: "David Wilson",
      room: "203",
      date: "Today, 5:00 PM",
      nights: 2,
      email: "david@email.com",
    },
    {
      id: "R-002",
      name: "Lisa Anderson",
      room: "305",
      date: "Today, 6:30 PM",
      nights: 3,
      email: "lisa@email.com",
    },
    {
      id: "R-003",
      name: "Tom Martinez",
      room: "410",
      date: "Tomorrow, 2:00 PM",
      nights: 1,
      email: "tom@email.com",
    },
  ];

  return NextResponse.json({
    performance,
    recentCheckIns,
    upcomingReservations,
  });
}