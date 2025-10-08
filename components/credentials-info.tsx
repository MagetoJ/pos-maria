import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function CredentialsInfo() {
  const credentials = [
    {
      role: "Admin",
      email: "admin@mariahavens.com",
      pin: "9999",
      color: "bg-red-500",
    },
    {
      role: "Waiter (John)",
      email: "john@mariahavens.com",
      pin: "1234",
      color: "bg-blue-500",
    },
    {
      role: "Waiter (Jane)",
      email: "jane@mariahavens.com",
      pin: "5678",
      color: "bg-blue-500",
    },
    {
      role: "Waiter (Mike)",
      email: "mike@mariahavens.com",
      pin: "9012",
      color: "bg-blue-500",
    },
    {
      role: "Receptionist",
      email: "emily@mariahavens.com",
      pin: "4444",
      color: "bg-yellow-500",
    },
  ]

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Login Credentials</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Use these credentials to access different roles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {credentials.map((cred) => (
            <div key={cred.email} className="p-3 border rounded-md space-y-2">
              <div className="flex items-center gap-2">
                <Badge className={cred.color}>{cred.role}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-mono text-muted-foreground">{cred.email}</p>
                <p className="text-sm font-bold">PIN: {cred.pin}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
