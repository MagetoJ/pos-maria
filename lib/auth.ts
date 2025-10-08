import { users } from "./data"
import type { User } from "./types"

export function authenticateUser(email: string, pin: string): User | null {
  const user = users.find((u) => u.email === email && u.pin === pin && u.isActive)
  return user || null
}

export function setAuthCookies(user: User) {
  // In a real app, use httpOnly cookies via API route
  document.cookie = `userId=${user.id}; path=/; max-age=86400`
  document.cookie = `userRole=${user.role}; path=/; max-age=86400`
  document.cookie = `userName=${user.name}; path=/; max-age=86400`
}

export function clearAuthCookies() {
  document.cookie = "userId=; path=/; max-age=0"
  document.cookie = "userRole=; path=/; max-age=0"
  document.cookie = "userName=; path=/; max-age=0"
}

export function getAuthFromCookies(): { userId: string; userRole: string; userName: string } | null {
  if (typeof document === "undefined") return null

  const cookies = document.cookie.split("; ").reduce(
    (acc, cookie) => {
      const [key, value] = cookie.split("=")
      acc[key] = value
      return acc
    },
    {} as Record<string, string>,
  )

  if (cookies.userId && cookies.userRole && cookies.userName) {
    return {
      userId: cookies.userId,
      userRole: cookies.userRole,
      userName: cookies.userName,
    }
  }

  return null
}
