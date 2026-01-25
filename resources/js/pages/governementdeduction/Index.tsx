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
    title: 'Government Deductions',
    href: dashboard().url,
    },
]

interface PositionItem {
    id: number
    name: string
    code: string
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

export interface PaginatedPositions {
    data: PositionItem[]
    meta: PaginationMeta
    links: PaginationLinks[]
}

interface Props {
  governmentDeductions: PaginatedPositions
}

export default function Dashboard({ governmentDeductions }: Props) {
    const [modalOpen, setModalOpen] = useState(false)

    const { data, setData, post, put, processing, reset, errors } = useForm({
        id: 0,
        name: '',
        code: '',
    })

    const submit = () => {
        if (data.id != 0) {
            put(route('governmentdeductions.update', data.id), {
                onSuccess: () => {
                    reset()
                    setModalOpen(false)
                },
            })
        } else {
            post(route('governmentdeductions.store'), {
                onSuccess: () => {
                    reset()
                    setModalOpen(false)
                },
            })
        }
    }
    
    const handleAddDepartment = () => {
        setData({
            id: 0,
            name: "",
            code: "",
        })
        setModalOpen(true) 
    }

    const handleEditDepartment = (government: PositionItem) => {
        setData({
            id: government.id,
            name: government.name,
            code: government.code,
        })
        setModalOpen(true)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Government Deductions" />
              <CardDetail
                    title="Government Deductions"
                    description="List of registered government deductions"
                    buttonText="Add Government Deduction"
                    onButtonClick={handleAddDepartment}
                >
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {governmentDeductions.data.map(e => (
                                <TableRow key={e.id}>
                                    <TableCell>{e.name}</TableCell>
                                    <TableCell>{e.code}</TableCell>
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
                            <DialogTitle>Add Government Deduction</DialogTitle>
                            <DialogDescription>
                            Fill in the government deduction details
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
                        <Label htmlFor="code">Code</Label>
                        <Input
                            id="code"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                        />
                        {errors.code && (
                            <p className="text-sm text-red-500">{errors.code}</p>
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
