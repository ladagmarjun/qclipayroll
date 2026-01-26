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
    title: 'Employee Government Deductions',
    href: dashboard().url,
  },
]

interface EmployeeItem {
  id: number
  first_name: string
  last_name: string
}

interface DeductionItem {
  id: number
  name: string
}

interface EmployeeDeductionItem {
  id: number
  employee: EmployeeItem
  deduction: DeductionItem
  monthly_amount: number
  monthly_covered: number
  start_date: string
  apply_months: number[]
}

interface Props {
  employeesdeductions: {
    data: EmployeeDeductionItem[]
  }
  employees: EmployeeItem[]
  governmentDeductions: DeductionItem[]
}

const months = [
  { value: 1, label: 'Jan' },
  { value: 2, label: 'Feb' },
  { value: 3, label: 'Mar' },
  { value: 4, label: 'Apr' },
  { value: 5, label: 'May' },
  { value: 6, label: 'Jun' },
  { value: 7, label: 'Jul' },
  { value: 8, label: 'Aug' },
  { value: 9, label: 'Sep' },
  { value: 10, label: 'Oct' },
  { value: 11, label: 'Nov' },
  { value: 12, label: 'Dec' },
]

export default function Dashboard({
  employeesdeductions,
  employees,
  governmentDeductions,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false)

  const { data, setData, post, put, processing, reset } = useForm({
    id: 0,
    employee_id: 0,
    government_deduction_id: 0,
    monthly_amount: 0,
    monthly_covered: 1,
    start_date: '',
    apply_months: [] as number[],
  })

  const submit = () => {
    if (data.id !== 0) {
      put(route('employeegovernmentdeductions.update', data.id), {
        onSuccess: () => {
          reset()
          setModalOpen(false)
        },
      })
    } else {
      post(route('employeegovernmentdeductions.store'), {
        onSuccess: () => {
          reset()
          setModalOpen(false)
        },
      })
    }
  }

  const handleAdd = () => {
    reset()
    setModalOpen(true)
  }

  const handleEdit = (item: EmployeeDeductionItem) => {
    setData({
      id: item.id,
      employee_id: item.employee.id,
      government_deduction_id: item.deduction.id,
      monthly_amount: item.monthly_amount,
      start_date: item.start_date,
      apply_months: item.apply_months,
      monthly_covered: item.monthly_covered
    })
    setModalOpen(true)
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Employee Government Deductions" />

      <CardDetail
        title="Employee Government Deductions"
        description="Manage monthly or selected-month government deductions per employee"
        buttonText="Add Government Deduction"
        onButtonClick={handleAdd}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Deduction</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Covered Months</TableHead>
              <TableHead>Months</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {employeesdeductions.data.map((e) => (
              <TableRow key={e.id}>
                <TableCell>
                  {e.employee.first_name} {e.employee.last_name}
                </TableCell>
                <TableCell>{e.deduction?.name ?? ''} </TableCell>
                <TableCell className="text-right">
                  {e.monthly_amount}
                </TableCell>
                <TableCell className="text-right">
                  {e.monthly_covered}
                </TableCell>
                <TableCell>
                  {e.apply_months.map(m =>
                    months.find(x => x.value === m)?.label
                  ).join(', ')}
                </TableCell>
                <TableCell>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => handleEdit(e)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardDetail>

      {/* MODAL */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {data.id ? 'Edit Government Deduction' : 'Add Government Deduction'}
            </DialogTitle>
            <DialogDescription>
              Configure employee government deduction and applicable months
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Employee</Label>
              <Select
                value={data.employee_id ? String(data.employee_id) : ''}
                onValueChange={(v) => setData('employee_id', Number(v))}
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
            </div>

            <div>
              <Label>Government Deduction</Label>
              <Select
                value={data.government_deduction_id ? String(data.government_deduction_id) : ''}
                onValueChange={(v) => setData('government_deduction_id', Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select deduction" />
                </SelectTrigger>
                <SelectContent>
                  {governmentDeductions.map(d => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Monthly Amount</Label>
              <Input
                type="number"
                value={data.monthly_amount}
                onChange={(e) => setData('monthly_amount', Number(e.target.value))}
              />
            </div>

            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={data.start_date}
                onChange={(e) => setData('start_date', e.target.value)}
              />
            </div>

            <div>
              <Label>Covered Month</Label>
              <Input
                type="number"
                value={data.monthly_covered}
                onChange={(e) => setData('monthly_covered', Number(e.target.value))}
              />
            </div>
            <div>
              <Label>Apply Months</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {months.map(month => (
                  <label
                    key={month.value}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={data.apply_months.includes(month.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setData('apply_months', [...data.apply_months, month.value])
                        } else {
                          setData(
                            'apply_months',
                            data.apply_months.filter(m => m !== month.value)
                          )
                        }
                      }}
                    />
                    {month.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={submit} disabled={processing}>
              {processing ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
