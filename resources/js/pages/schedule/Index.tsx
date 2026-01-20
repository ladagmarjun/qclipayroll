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
    title: 'Schedules',
    href: dashboard().url,
    },
]

interface ScheduleItem {
    id: number
    time_in: string
    time_out: string
    name: string
    break_minutes: string
    is_rest_day: boolean
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

export interface PaginatedSchedules {
    data: ScheduleItem[]
    meta: PaginationMeta
    links: PaginationLinks[]
}

interface Props {
    schedules: PaginatedSchedules
}

export default function Dashboard({ schedules }: Props) {
    const [modalOpen, setModalOpen] = useState(false)

    const { data, setData, post, put, processing, reset, errors } = useForm({
        id: 0,
        name: '',
        time_in: '',
        time_out: '',
        break_minutes: '',
        is_rest_day: false,
    })

    const submit = () => {
        if (data.id != 0) {
            put(route('schedules.update', data.id), {
                onSuccess: () => {
                    reset()
                    setModalOpen(false)
                },
            })
        } else {
            post(route('schedules.store'), {
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

    const handleEditDepartment = (schedule: ScheduleItem) => {
        setData({
            id: schedule.id,
            name: schedule.name,
            time_in: schedule.time_in,
            time_out: schedule.time_out,
            break_minutes: schedule.break_minutes,
            is_rest_day: schedule.is_rest_day,
        })
        setModalOpen(true)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedules" />
              <CardDetail
                    title="Schedules"
                    description="List of registered schedules"
                    buttonText="Add Schedule"
                    onButtonClick={handleAddDepartment}
                >
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Time In - Time Out</TableHead>
                                <TableHead>Break Minutes</TableHead>
                                <TableHead>Rest Day</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {schedules.data.map(e => (
                                <TableRow key={e.id}>
                                    <TableCell>{e.name}</TableCell>
                                    <TableCell>{e.time_in} - {e.time_out}</TableCell>
                                    <TableCell>{e.break_minutes}</TableCell>
                                    <TableCell>{e.is_rest_day ? 'Yes' : 'No'}</TableCell>
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
                            <DialogTitle>Add Schedule</DialogTitle>
                            <DialogDescription>
                                Fill in the schedule details
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
                            <Label htmlFor="time_in">Time In</Label>
                            <Input
                                type="time"
                                id="time_in"
                                value={data.time_in}
                                onChange={(e) => setData('time_in', e.target.value)}
                            />
                            {errors.time_in && (
                                <p className="text-sm text-red-500">{errors.time_in}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="time_out">Time Out</Label>
                            <Input
                                id="time_out"
                                type="time"
                                value={data.time_out}
                                onChange={(e) => setData('time_out', e.target.value)}
                            />
                            {errors.time_out && (
                                <p className="text-sm text-red-500">{errors.time_out}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="break_minutes">Break Minutes</Label>
                            <Input
                                type="number"
                                id="break_minutes"
                                value={data.break_minutes}
                                onChange={(e) => setData('break_minutes', e.target.value)}
                            />
                            {errors.break_minutes && (
                                <p className="text-sm text-red-500">{errors.break_minutes}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                id="is_rest_day"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300"
                                checked={Boolean(data.is_rest_day)}
                                onChange={(e) => setData('is_rest_day', e.target.checked)}
                            />
                            <Label htmlFor="is_rest_day">Is Rest Day</Label>
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
