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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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
        title: 'Attendances',
        href: dashboard().url,
    },
]

interface PositionItem {
    id: number
    name: string
    description: string
}

interface ScheduleDetail {
    id: number
    name: string
    time_in: string
    time_out: string
}

interface EmployeeSchedule {
    id: number
    schedule_id: number
    schedule: ScheduleDetail
}

interface Employee {
    id: number
    first_name: string
    last_name: string
    schedules: EmployeeSchedule[]
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
  attendances: PaginatedPositions
  employees: Employee[]
}

export default function Dashboard({ attendances, employees }: Props) {
    const [modalOpen, setModalOpen] = useState(false)
    const [timeInErrors, setTimeInErrors] = useState<string | null>(null)
    const [timeOutErrors, setTimeOutErrors] = useState<string | null>(null)
    const [dateError, setDateError] = useState<string | null>(null)
    const [employeeErrors, setEmployeeErrors] = useState<string | null>(null)
    const [scheduleErrors, setScheduleErrors] = useState<string | null>(null)

    const { data, setData, post, processing, reset} = useForm<{
        employee_id: number
        schedule_id: number
        time_in: string
        time_out: string
        date: string
        overtime: 0,
        attendances: {
            employee_id: number
            schedule_id: number
            date: string
            time_in: string
            time_out: string
            overtime: number,
        }[]
    }>({
        employee_id: 0,
        schedule_id: 0,
        date: "",
        time_in: "",
        time_out: "",
        overtime: 0,
        attendances: [],
    })

    const selectedEmployee = employees.find(
        e => e.id === data.employee_id
    )

    const submit = () => {
        post(route('attendances.store'), {
            onSuccess: () => {
                reset()
                setModalOpen(false)
            },
        })
    }
    
    const handleAddDepartment = () => {
        setModalOpen(true) 
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendances" />
              <CardDetail
                    title="Attendances"
                    description="List of registered attendances"
                    buttonText="Add Attendance"
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
                            {attendances.data.map(e => (
                                <TableRow key={e.id}>
                                    <TableCell>{e.name}</TableCell>
                                    <TableCell>{e.description}</TableCell>
                                    <TableCell>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardDetail>
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogContent className="!md:w-1/2 !max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add Attendance</DialogTitle>
                            <DialogDescription>
                            Fill in the attendance details
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="employee_id">Select Employee</Label>
                                <Select
                                    value={data.employee_id ? String(data.employee_id) : ""}
                                    onValueChange={(v) => {
                                        setData("employee_id", Number(v))
                                        setData("schedule_id", 0) // reset schedule
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select employee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map(e => (
                                            <SelectItem key={e.id} value={String(e.id)}>
                                                {e.first_name} {e.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {employeeErrors && (
                                    <p className="text-sm text-red-500">{employeeErrors}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="employee_id">Select Schedule</Label>
                                <Select
                                    value={data.schedule_id ? String(data.schedule_id) : ""}
                                    onValueChange={(v) => setData("schedule_id", Number(v))}
                                    disabled={!selectedEmployee}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select schedule" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {selectedEmployee?.schedules.map(s => (
                                            <SelectItem key={s.id} value={String(s.id)}>
                                                {s.schedule.time_in} - {s.schedule.time_out} - {s.schedule.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {scheduleErrors && (
                                    <p className="text-sm text-red-500">{scheduleErrors}</p>
                                )}

                            </div>

                            <div className="flex gap-2 flex-row">
                                <div className='flex-1'>
                                    <Label>Date</Label>
                                    <Input
                                        type="date"
                                        value={data.date}
                                        onChange={(e) => setData("date", e.target.value)}
                                    />

                                    {dateError && (
                                        <p className="text-sm text-red-500">{dateError}</p>
                                    )}
                                </div>
                                <div className='flex-1'>
                                    <Label>Time In</Label>
                                    <Input
                                        type="time"
                                        value={data.time_in}
                                        onChange={e => setData("time_in", e.target.value)}
                                    />

                                    {timeInErrors && (
                                        <p className="text-sm text-red-500">{timeInErrors}</p>
                                    )}
                                </div>
                                <div className='flex-1'>
                                    <Label>Time Out</Label>
                                    <Input
                                        type="time"
                                        value={data.time_out}
                                        onChange={e => setData("time_out", e.target.value)}
                                    />
                                    {timeOutErrors && (
                                        <p className="text-sm text-red-500">{timeOutErrors}</p>
                                    )}
                                </div>
                            </div>
                            <div className='flex-1'>
                                <Label>Overtime</Label>
                                <Input
                                    type="number"
                                    value={data.overtime}
                                    onChange={(e) => setData("overtime", Number(e.target.value))}
                                />
                            </div>

                            <Button
                                type="button"
                                onClick={() => {
                                    if (!data.employee_id) {
                                        setEmployeeErrors("Employee is required.")
                                        return
                                    }

                                    if (!data.schedule_id) {
                                        setScheduleErrors("Schedule is required.")
                                        return
                                    }
                                    
                                    if (data.date === "") {
                                        setDateError("Date is required.")
                                        return
                                    }
                                    if (data.time_in === "" || data.time_out === "") {
                                        setTimeInErrors("Time In is required.")
                                        setTimeOutErrors("Time Out is required.")
                                        return
                                    }
                                   
                                    
                                    setDateError(null)
                                    setTimeInErrors(null)
                                    setTimeOutErrors(null)
                                    setEmployeeErrors(null)
                                    setScheduleErrors(null)
                                    setData("attendances", [
                                        ...data.attendances,
                                        {
                                            employee_id: data.employee_id,
                                            schedule_id: data.schedule_id,
                                            time_in: data.time_in,
                                            time_out: data.time_out,
                                            date: data.date,
                                            overtime: data.overtime,
                                        },
                                    ])

                                }}
                            >
                                Add Attendance
                            </Button>

                            {data.attendances.length > 0 && (
                                <div className="mt-4">
                                    <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Employee</TableHead>
                                            <TableHead>Schedule</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Time In</TableHead>
                                            <TableHead>Time Out</TableHead>
                                            <TableHead>Overtime</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {data.attendances.map((a, index) => {
                                        const employee = employees.find(e => e.id === a.employee_id)
                                        const schedule = employee?.schedules.find(s => s.schedule_id === a.schedule_id)

                                        return (
                                            <TableRow key={index}>
                                            <TableCell>
                                                {employee ? `${employee.first_name} ${employee.last_name}` : "Unknown"}
                                            </TableCell>

                                            <TableCell>
                                                {schedule ? schedule.schedule.time_in + "-" + schedule.schedule.time_out : "Unknown"}
                                            </TableCell>

                                            <TableCell>{a.date}</TableCell>
                                            <TableCell>{a.time_in}</TableCell>
                                            <TableCell>{a.time_out}</TableCell>
                                            <TableCell>{a.overtime}</TableCell>

                                            <TableCell>
                                                <Button
                                                variant="ghost"
                                                className='hover:text-red-600'
                                                size="sm"
                                                onClick={() => {
                                                    setData(
                                                    "attendances",
                                                    data.attendances.filter((_, i) => i !== index)
                                                    )
                                                }}
                                                >
                                                Remove
                                                </Button>
                                            </TableCell>
                                            </TableRow>
                                        )
                                        })}
                                    </TableBody>
                                    </Table>
                                </div>
                                )}

                            
                        </div>

                    <DialogFooter>
                            {data.attendances.length > 0 && (
                                <Button
                                    onClick={submit}
                                    disabled={processing}
                                >
                                    {processing ? 'Saving...' : 'Save Attendance'}
                                </Button>
                             )}
                    </DialogFooter>
                    </DialogContent>
                </Dialog>
        </AppLayout>
    )
}
