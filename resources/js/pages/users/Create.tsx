import AppLayout from '@/layouts/app-layout'
import { Head, useForm } from '@inertiajs/react'

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { route } from 'ziggy-js'

interface Role {
  id: number
  name: string
}

interface Division {
  id: number
  name: string
}

interface Props {
  roles: Role[]
  divisions: Division[]
}

export default function Create({ roles, divisions }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    role: '',
    division_id: '',
  })

  const submit = () => {
    post(route('users.store'))
  }

  return (
    <AppLayout>
      <Head title="Add User" />

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Name */}
          <div>
            <Label>Name</Label>
            <Input
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <Label>Role</Label>
            <Select onValueChange={(v) => setData('role', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.name}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
          </div>

          {/* Division */}
          <div>
            <Label>Division</Label>
            <Select onValueChange={(v) => setData('division_id', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select division" />
              </SelectTrigger>
              <SelectContent>
                {divisions.map((d) => (
                  <SelectItem key={d.id} value={String(d.id)}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.division_id && (
              <p className="text-sm text-red-500">{errors.division_id}</p>
            )}
          </div>

          <Button onClick={submit} disabled={processing}>
            {processing ? 'Saving...' : 'Create User'}
          </Button>
        </CardContent>
      </Card>
    </AppLayout>
  )
}
