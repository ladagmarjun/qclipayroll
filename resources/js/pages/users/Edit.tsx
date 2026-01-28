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

interface Props {
  user: any
  roles: { id: number; name: string }[]
  divisions: { id: number; name: string }[]
}

export default function Edit({ user, roles, divisions }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    name: user.name,
    email: user.email,
    role: user.roles[0]?.name ?? '',
    division_id: String(user.division_id ?? ''),
  })

  const submit = () => {
    put(route('users.update', user.id))
  }

  return (
    <AppLayout>
      <Head title="Edit User" />

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Edit User</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <Label>Email</Label>
            <Input value={data.email} onChange={(e) => setData('email', e.target.value)} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <Label>Role</Label>
            <Select value={data.role} onValueChange={(v) => setData('role', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.name}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Division</Label>
            <Select value={data.division_id} onValueChange={(v) => setData('division_id', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {divisions.map((d) => (
                  <SelectItem key={d.id} value={String(d.id)}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={submit} disabled={processing}>
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </AppLayout>
  )
}
