import AppLayout from '@/layouts/app-layout'
import { dashboard } from '@/routes'
import { type BreadcrumbItem } from '@/types'
import { Head, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { route } from 'ziggy-js'
import CardDetail from "@/components/cardContent"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Departments',
    href: dashboard().url,
  },
]


interface DepartmentItem {
  id: number
  name: string
  description: string
}

interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  [key: string]: unknown
}

interface PaginationLinks {
  url: string | null
  label: string
  active: boolean
}

export interface PaginatedDepartments {
  data: DepartmentItem[]
  meta: PaginationMeta
  links: PaginationLinks[]
}

interface Props {
  departments: PaginatedDepartments
}

export default function Dashboard({ departments }: Props) {

    const [modalOpen, setModalOpen] = useState(false)

    const { data, setData, post, put, processing, reset, errors } = useForm({
        id: 0,
        name: '',
        description: '',
    })

    const submit = () => {
        if (data.id != 0) {
            put(route('departments.update', data.id), {
                onSuccess: () => {
                    reset()
                    setModalOpen(false)
                },
            })
        } else {
            post(route('departments.store'), {
                onSuccess: () => {
                    reset()
                    setModalOpen(false)
                },
            })
        }
    }
    
    const handleAddDepartment = () => {
        setModalOpen(true) 
    }

    const handleEditDepartment = (department: DepartmentItem) => {
        setData({
            id: department.id,
            name: department.name,
            description: department.description,
        })
        setModalOpen(true)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Departments" />
              <CardDetail
                    title="Departments"
                    description="List of registered departments"
                    buttonText="Add Department"
                    onButtonClick={handleAddDepartment}
                >
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {departments.data.map(e => (
                                <TableRow key={e.id}>
                                    <TableCell>{e.name}</TableCell>
                                    <TableCell>{e.description}</TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => handleEditDepartment(e)}
                                            variant="link" size="sm">
                                                Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardDetail>
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Department</DialogTitle>
                            <DialogDescription>
                            Fill in the department details
                            </DialogDescription>
                        </DialogHeader>

                    <div className="space-y-4">
                        <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                        </div>

                        <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description}</p>
                        )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                        onClick={submit}
                        disabled={processing}
                        >
                        {processing ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                    </DialogContent>
                </Dialog>
        </AppLayout>
    )
}
