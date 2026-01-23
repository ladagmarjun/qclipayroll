import AppLayout from '@/layouts/app-layout'
import { dashboard } from '@/routes'
import { type BreadcrumbItem } from '@/types'
import { Head, router, useForm } from '@inertiajs/react'
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
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Attendances',
        href: dashboard().url,
    },
]

interface AttendanceItem {
    id: number
    time_in_actual: string
    time_out_actual: string
    attendance_date: string
    late_minutes: number
    overtime_minutes: number
    undertime_minutes: number
    time_in: string
    time_out: string
    total_minutes: number
    employee: Employee
    remarks: string
    break_time_minutes: number
    status: string
}

interface ScheduleDetail {
    id: number
    name: string
    time_in: string
    time_out: string
    break_minutes: string
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
    data: AttendanceItem[]
    meta: PaginationMeta
    links: PaginationLinks[]
    current_page: number
    last_page: number
    per_page: number
    total: number
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
    const [selectedAttendance, setSelectedAttendance] = useState<AttendanceItem>();
    
    console.log(attendances)
    const { data, setData, post, processing, reset} = useForm<{
        employee_id: number
        employee_schedule_id: number
        schedule_id: number
        time_in: string
        time_out: string
        date: string
        overtime: number,
        breaktime_minutes: number,
        remarks: string,
        attendances: {
            employee_id: number
            schedule_id: number
            date: string
            time_in: string
            time_out: string
            overtime: number,
            breaktime_minutes: number,
            employee_schedule_id: number
            remarks: string,
        }[]
    }>({
        employee_id: 0,
        schedule_id: 0,
        date: "",
        time_in: "",
        time_out: "",
        overtime: 0,
        attendances: [],
        breaktime_minutes: 0,
        remarks: "",
        employee_schedule_id: 0,
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

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
        })
    }

    const formatTime = (time: string) => {
        return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true, // set to false if you want 24-hour format
        })
    }

    const confirmDelete = (item: {id: number}) => {
        router.delete(route('attendances.destroy', item.id), {
            onSuccess: () => {
            },
            onError: () => {
            },
        });
    }
    
    const changePage = (page: number) => {
        router.get(route('attendances.index'), { page }, {
            preserveScroll: true,
            preserveState: true,
        })
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
                    <div className="grid grid-cols-2 flex">
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
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Schedule</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Time In / Time Out</TableHead>
                                <TableHead>Late Minutes</TableHead>
                                <TableHead>Undertime Minutes</TableHead>
                                <TableHead>Overtime Minutes</TableHead>
                                <TableHead>Breaktime Minutes</TableHead>
                                <TableHead>Total Minutes</TableHead>
                                <TableHead>Remarks</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {attendances.data.map(e => (
                                <TableRow key={e.id}>
                                    <TableCell>{ e.employee.first_name } { e.employee.last_name }</TableCell>
                                    <TableCell>{ formatTime(e.time_in)} - { formatTime(e.time_out)}</TableCell>
                                    <TableCell>{formatDate(e.attendance_date)}</TableCell>
                                    <TableCell>{formatTime(e.time_in_actual)} - {formatTime(e.time_out_actual)}</TableCell>
                                    <TableCell>{e.late_minutes}</TableCell>
                                    <TableCell>{e.undertime_minutes}</TableCell>
                                    <TableCell>{e.overtime_minutes}</TableCell>
                                    <TableCell>{e.break_time_minutes}</TableCell>
                                    <TableCell>{e.total_minutes}</TableCell>
                                    <TableCell>{e.remarks}</TableCell>
                                    <TableCell>
                                        {e.status == 'Created' && (
                                            <Button
                                                key={e.id}
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedAttendance(e)}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                            <PaginationPrevious
                                onClick={() => changePage(attendances.current_page - 1)}
                                className={attendances.current_page === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                            </PaginationItem>

                            {Array.from({ length: attendances.last_page }).map((_, i) => {
                            const page = i + 1
                            return (
                                <PaginationItem key={page}>
                                <PaginationLink
                                    isActive={attendances.current_page === page}
                                    onClick={() => changePage(page)}
                                >
                                    {page}
                                </PaginationLink>
                                </PaginationItem>
                            )
                            })}

                            <PaginationItem>
                            <PaginationNext
                                onClick={() => changePage(attendances.current_page + 1)}
                                className={
                                attendances.current_page === attendances.last_page
                                    ? "pointer-events-none opacity-50"
                                    : ""
                                }
                            />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </CardDetail>
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogContent className="!md:w-3/4 max-w-4xl!">
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
                                    value={data.employee_schedule_id ? String(data.employee_schedule_id) : ""}
                                    onValueChange={(v) => {
                                        const scheduleId = Number(v)
                                        const selectedSchedule = selectedEmployee?.schedules.find(
                                            (s) => s.id === scheduleId
                                        )

                                        setData("employee_schedule_id", Number(v))
                                        setData("schedule_id", Number(selectedSchedule?.schedule?.id ?? 0))
                                        setData(
                                            "breaktime_minutes",
                                            Number(selectedSchedule?.schedule?.break_minutes ?? 0)
                                        )
                                    }}
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
                            <div className="flex gap-2 flex-row">
                                <div className='flex-1'>
                                    <Label>Break Time Minutes</Label>
                                    <Input
                                        type="number"
                                        value={data.breaktime_minutes}
                                        onChange={(e) => setData("breaktime_minutes", Number(e.target.value))}
                                    />
                                </div>
                                <div className='flex-1'>
                                    <Label>Overtime</Label>
                                    <Input
                                        type="number"
                                        value={data.overtime}
                                        onChange={(e) => setData("overtime", Number(e.target.value))}
                                    />
                                </div>
                            </div>
                            <div className="gap-2 ">
                                <Label>Remarks</Label>
                                <Input
                                    value={data.remarks}
                                    onChange={(e) => setData("remarks", (e.target.value))}
                                />
                            </div>

                            <Button
                                type="button"
                                onClick={() => {
                                    if (!data.employee_id) {
                                        setEmployeeErrors("Employee is required.")
                                        return
                                    }

                                    if (!data.employee_schedule_id) {
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
                                            breaktime_minutes: data.breaktime_minutes,
                                            remarks: data.remarks,
                                            employee_schedule_id: data.employee_schedule_id
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
                                            <TableHead>Breaktime</TableHead>
                                            <TableHead>Remarks</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {data.attendances.map((a, index) => {
                                        const employee = employees.find(e => e.id === a.employee_id)
                                        const schedule = employee?.schedules.find(s => s.id === a.employee_schedule_id)

                                        return (
                                            <TableRow key={index}>
                                            <TableCell>
                                                {employee ? `${employee.first_name} ${employee.last_name}` : "Unknown"}
                                            </TableCell>

                                            <TableCell>
                                                {schedule ? schedule.schedule.time_in + "-" + schedule.schedule.time_out : "Unknown"}
                                            </TableCell>

                                            <TableCell>{formatDate(a.date)}</TableCell>
                                            <TableCell>{formatTime(a.time_in)}</TableCell>
                                            <TableCell>{formatTime(a.time_out)}</TableCell>
                                            <TableCell>{a.overtime}</TableCell>
                                            <TableCell>{a.breaktime_minutes}</TableCell>
                                            <TableCell>{a.remarks}</TableCell>

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

                <AlertDialog open={!!selectedAttendance} onOpenChange={(open) => !open && setSelectedAttendance(null!)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Delete attendance?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete{" "}
                                {selectedAttendance?.employee?.first_name}?
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => confirmDelete(selectedAttendance!)}>
                                Delete
                            </AlertDialogAction>
                            </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

        </AppLayout>
    )
}
