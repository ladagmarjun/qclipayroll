import { useState } from "react"
import { useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import AppLayout from '@/layouts/app-layout'
import CardDetail from "@/components/cardContent"
import { type BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import { dashboard } from '@/routes'
import { MoreHorizontal, Edit2 } from "lucide-react"

import { route } from "ziggy-js"

interface Employee {
  id: number
  first_name: string
  last_name: string
}

interface Overtime {
  id: number
  date_from: string
  date_to: string
  minutes_duration: number
  remarks: string
  status: string
  employee: {
    id: number
    first_name: string
    last_name: string
  }
}

interface Props {
  employees: Employee[]
  overtimes: {
    data: Overtime[]
  }
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Attendances',
        href: dashboard().url,
    },
]


export default function Index({ employees, overtimes }: Props) {
    const [openAdd, setOpenAdd] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [editOvertime, setEditOvertime] = useState<Overtime | null>(null)

    const { data, setData, post, put, processing, errors, reset } = useForm({
        employee_id: "",
        date_from: "",
        date_to: "",
        remarks: "",
        status: "Pending",
    })

    const openEditModal = (ot: Overtime) => {
        setEditOvertime(ot)

        setData({
            employee_id: ot.employee.id.toString(),
            date_from: ot.date_from,
            date_to: ot.date_to,
            remarks: ot.remarks,
            status: ot.status,
        })

        setOpenEdit(true)
    }

    const submitAdd = () => {
        post(route("overtimes.store"), {
        onSuccess: () => {
            reset()
            setOpenAdd(false)
        },
        })
    }

    const submitEdit = () => {
        if (!editOvertime) return

        put(route("overtimes.update", editOvertime.id), {
            onSuccess: () => {
                reset()
                setOpenEdit(false)
        },
        })
    }
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Attendances" />
        <CardDetail
            title="Overtimes"
            description="List of registered overtimes"
            buttonText="Add Overtime"
            onButtonClick={() => {
                setOpenAdd(true)
            }}
        >
            <div className="space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold"></h1>

                    <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                        <OvertimeForm
                            employees={employees}
                            data={data}
                            setData={setData}
                            errors={errors}
                            processing={processing}
                            onSubmit={submitAdd}
                            onCancel={() => {
                                setOpenEdit(false)
                            }}
                            title="Add Overtime"
                        />
                    </Dialog>
                </div>

                {/* Overtime List */}
                <div className="rounded-md border">
                    <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Date From</TableHead>
                            <TableHead>Date To</TableHead>
                            <TableHead>Minutes</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {overtimes.data.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                            No overtime records
                            </TableCell>
                        </TableRow>
                        )}

                        {overtimes.data.map(overtime => (
                        <TableRow key={overtime.id}>
                            <TableCell>{overtime.employee.first_name} {overtime.employee.last_name}</TableCell>
                            <TableCell>{overtime.date_from}</TableCell>
                            <TableCell>{overtime.date_to}</TableCell>
                            <TableCell>{overtime.minutes_duration}</TableCell>
                            <TableCell>{overtime.status}</TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEditModal(overtime)}
                                >
                                    <Edit2 className="mr-2 w-4 h-4" />
                                    Edit
                                </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </div>

                <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                    <OvertimeForm
                        employees={employees}
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        onSubmit={submitEdit}
                        onCancel={() => {
                            setOpenEdit(false)
                        }}
                        title="Edit Overtime"
                    />
                </Dialog>
            </div>  
        </CardDetail>
    </AppLayout>
  )

}

    function OvertimeForm({
        employees,
        data,
        setData,
        errors,
        processing,
        onSubmit,
        title,
        onCancel,
    }: any) {
    return (
        <DialogContent className="sm:max-w-lg">
        <DialogHeader>
            <DialogTitle>{title ?? 'ss  '}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
            <Select
                onValueChange={(v) => setData("employee_id", v)}>
                <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                </SelectTrigger>
            <SelectContent>
                {employees.map((emp: Employee) => (
                <SelectItem key={emp.id} value={emp.id.toString()}>
                    {emp.first_name} {emp.last_name}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
            {errors.employee_id && (
            <p className="text-sm text-red-500">{errors.employee_id}</p>
            )}

            <Input
            type="datetime-local"
            value={data.date_from}
            onChange={(e) => setData("date_from", e.target.value)}
            />
            {errors.date_from && (
            <p className="text-sm text-red-500">{errors.date_from}</p>
            )}

            <Input
            type="datetime-local"
            value={data.date_to}
            onChange={(e) => setData("date_to", e.target.value)}
            />
            {errors.date_to && (
            <p className="text-sm text-red-500">{errors.date_to}</p>
            )}

            <Input
            placeholder="Remarks"
            value={data.remarks}
            onChange={(e) => setData("remarks", e.target.value)}
            />

            <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>
                Cancel
            </Button>
            <Button onClick={onSubmit} disabled={processing}>
                Save
            </Button>
            </div>
        </div>
        </DialogContent>
    )
    }