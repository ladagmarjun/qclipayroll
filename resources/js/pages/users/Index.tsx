import AppLayout from '@/layouts/app-layout'
import { Head, Link } from '@inertiajs/react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { route } from 'ziggy-js'

interface User {
  id: number
  name: string
  email: string
  division?: { name: string }
  roles: { name: string }[]
}

interface Props {
  users: User[]
}

export default function Index({ users }: Props) {
  return (
    <AppLayout>
      <Head title="Users" />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Users</CardTitle>
          <Link href={route('users.create')}>
            <Button>Add User</Button>
          </Link>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Division</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.division?.name ?? '-'}</TableCell>
                  <TableCell>
                    {user.roles.map((r) => (
                      <Badge key={r.name} className="mr-1">
                        {r.name}
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={route('users.edit', user.id)}>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  )
}
