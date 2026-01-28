import { useState } from 'react'
import { Head, router, usePage } from '@inertiajs/react'

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import AppLayout from '@/layouts/app-layout'
import { dashboard } from '@/routes'
import { type BreadcrumbItem } from '@/types'

const breadcrumbs: BreadcrumbItem[] = [
    {
    title: 'Positions',
    href: dashboard().url,
    },
]


interface Permission {
  id: number
  name: string
}

interface Role {
  id: number
  name: string
  permissions: Permission[]
}

interface PageProps {
  roles: Role[]
  permissions: Permission[]
}

export default function RolesIndex() {
  const { roles, permissions } = usePage<PageProps>().props
  const [newRoleName, setNewRoleName] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])

  const togglePermission = (id: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const createRole = () => {
    router.post('/roles', {
      name: newRoleName,
      permissions: selectedPermissions,
    })
  }

  return (
    <>
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Roles & Permissions" />

        <Card className="mb-6">
            <CardHeader>
            <CardTitle>Create Role</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <div>
                <Label>Name</Label>
                <Input
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Role Name"
                />
            </div>

            <div>
                <Label>Permissions</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                {permissions.map((p) => (
                    <div key={p.id} className="flex items-center gap-2">
                    <Checkbox
                        checked={selectedPermissions.includes(p.id)}
                        onCheckedChange={() => togglePermission(p.id)}
                    />
                    <span className="text-sm">{p.name}</span>
                    </div>
                ))}
                </div>
            </div>

            <Button onClick={createRole}>Create Role</Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
            <CardTitle>Roles List</CardTitle>
            </CardHeader>
            <CardContent>
            <table className="w-full table-auto border">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border px-2 py-1 text-left">Role Name</th>
                    <th className="border px-2 py-1">Permissions</th>
                    <th className="border px-2 py-1">Actions</th>
                </tr>
                </thead>
                <tbody>
                {roles.map((role) => (
                    <tr key={role.id}>
                    <td className="border px-2 py-1">{role.name}</td>
                    <td className="border px-2 py-1">
                        {role.permissions.map((p) => (
                        <span
                            key={p.id}
                            className="px-1 py-0.5 bg-gray-200 rounded mr-1 text-xs"
                        >
                            {p.name}
                        </span>
                        ))}
                    </td>
                    <td className="border px-2 py-1">
                        <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                            console.log('Edit role', role.id)
                        }
                        >
                        Edit
                        </Button>
                        <Button
                        size="sm"
                        variant="destructive"
                        className="ml-2"
                        onClick={() =>
                            router.delete(`/roles/${role.id}`)
                        }
                        >
                        Delete
                        </Button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </CardContent>
        </Card>
    </AppLayout>
    </>
  )
}
