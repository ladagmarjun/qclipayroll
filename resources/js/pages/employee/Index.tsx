import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import CardDetail from '@/components/cardContent';
import { useState } from 'react';
import { route } from 'ziggy-js';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employees',
        href: dashboard().url,
    },
];
interface EmployeeItem {
  id: number
  first_name: string
  last_name: string
  middle_name: string
  suffix: string
  email: string
  phone: string
  position_id: string
  division_id: number
  department_id: number
  employee_code: string
  salary: number
  allowance: number
  hired_at: string
  role: string
  employment_status: string
  employment_type: string
  address: string
  date_of_birth: string
  gender: string
  marital_status: string
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

export interface PaginatedEmployees {
  data: EmployeeItem[]
  meta: PaginationMeta
  links: PaginationLinks[]
}

interface Props {
  employees: PaginatedEmployees
  departments: { id: number; name: string }[]
  divisions: { id: number; name: string }[]
  positions: { id: number; name: string }[]
  employeeCode: string
}


export default function Dashboard({ employees, departments, divisions, positions, employeeCode }: Props) {

    const [modalOpen, setModalOpen] = useState(false)
    const { data, setData, post, put, processing, reset, errors } = useForm({
        id: 0,
        first_name: '',
        last_name: '',
        middle_name: '',
        suffix: '',
        email: '',
        phone: '',
        position_id: '',
        division_id: 0,
        department_id: 0,
        employee_code: employeeCode,
        salary: 0,
        allowance: 0,
        hired_at: '',
        role: '',
        employment_status: '',
        employment_type: '',
        address: '',
        date_of_birth: '',
        gender: '',
        marital_status: '',
        action: 'add',
    })

    const submit = () => {
        if (data.id === 0) {
            post(route('employees.store'), {
                onSuccess: () => {
                    reset()
                    setModalOpen(false)
                },
            })
        } else {
            put(route('employees.update', data.id), {
                onSuccess: () => {
                    reset()
                    setModalOpen(false)
                },
            })
        }
    }

    const handleAddEmployee = () => {
        setData({
            action: 'add'
        })
        setModalOpen(true)
    }

    const handleEditEmployee = (employee: EmployeeItem) => {
        setData({
            ...employee,
            action: 'edit'
        })
        setModalOpen(true)
    }

    const handleViewEmployee = (employee: EmployeeItem) => {
        setData({
            ...employee,
            action: 'view'
        })
        setModalOpen(true)
    }
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employees" />
            
            <CardDetail
                title="Employees"
                description="List of registered employees"
                buttonText="Add Employee"
                onButtonClick={handleAddEmployee}
            >
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Employee Code</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {employees.data.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell>{employee.employee_code}</TableCell>
                                <TableCell>{employee.first_name} {employee.last_name}</TableCell>
                                <TableCell>{employee.email}</TableCell>
                                <TableCell>{employee.position_id}</TableCell>
                                <TableCell className="gap-2 flex mb-2">
                                    <Button variant="outline" onClick={() => handleViewEmployee(employee)}>View</Button>
                                    <Button variant="outline" onClick={() => handleEditEmployee(employee)}>Edit</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardDetail>
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-1/2 max-h-[90vh] flex flex-col p-0 overflow-hidden ">
                    <DialogHeader className='p-6'>
                        <DialogTitle>
                            { data.action === 'edit' ? 'Edit Employee' : data.action === 'view' ? 'View Employee' :  'Add New Employee' }
                        </DialogTitle>
                        <DialogDescription>
                            { data.action === 'edit' ? 'Edit Employee' : data.action === 'view' ? 'Employee Information' :  'Complete employee information' }
                            
                        </DialogDescription>
                    </DialogHeader>

                    {/* GRID */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 grid grid-cols-2 gap-4">

                        {/* First Name */}
                        <div>
                            <Label>First Name</Label>
                            <Input
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                readOnly={data.action === 'view'}
                            />
                            {errors.first_name && (
                                <p className="text-sm text-red-500">{errors.first_name}</p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <Label>Last Name</Label>
                            <Input
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                                readOnly={data.action === 'view'}
                            />
                            {errors.last_name && (
                                <p className="text-sm text-red-500">{errors.last_name}</p>
                            )}
                        </div>

                        {/* Middle Name */}
                        <div>
                            <Label>Middle Name</Label>
                            <Input
                                value={data.middle_name}
                                readOnly={data.action === 'view'}
                                onChange={(e) => setData('middle_name', e.target.value)}
                            />
                        </div>

                        {/* Suffix */}
                        <div>
                            <Label>Suffix</Label>
                            <Input
                                placeholder="Jr., Sr., III"
                                value={data.suffix}
                                onChange={(e) => setData('suffix', e.target.value)}
                                readOnly={data.action === 'view'}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                readOnly={data.action === 'view'}
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <Label>Phone</Label>
                            <Input
                                value={data.phone}
                                readOnly={data.action === 'view'}
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                        </div>

                        {/* Employee Code */}
                        <div>
                            <Label>Employee Code</Label>
                            <Input
                                readOnly={true}
                                value={data.employee_code}
                                onChange={(e) => setData('employee_code', e.target.value)}
                            />
                        </div>

                        {/* Role */}
                        <div>
                            <Label>Role</Label>
                            <Input
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                readOnly={data.action === 'view'}
                            />
                        </div>

                        {/* Position */}
                        <div>
                            <Label>Position</Label>
                            <Select
                                value={String(data.position_id)}
                                onValueChange={(v) => setData('position_id', v)}
                                disabled={data.action === 'view'}
                            >
                                <SelectTrigger
                                >
                                    <SelectValue placeholder="Select position" />
                                </SelectTrigger>
                                <SelectContent>
                                    {positions.map((p) => (
                                        <SelectItem key={p.id} value={String(p.id)}>
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {errors.position_id && (
                                <p className="text-sm text-red-500">{errors.position_id}</p>
                            )}
                        </div>

                        {/* Department */}
                        <div>
                            <Label>Department</Label>
                            <Select
                                value={String(data.department_id)}
                                onValueChange={(v) => setData('department_id', Number(v))}
                                disabled={data.action === 'view'}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map((d) => (
                                        <SelectItem key={d.id} value={String(d.id)}>
                                            {d.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            
                            {errors.department_id && (
                                <p className="text-sm text-red-500">{errors.department_id}</p>
                            )}
                        </div>

                        {/* Division */}
                        <div>
                            <Label>Division</Label>
                            <Select
                                value={String(data.division_id)}
                                onValueChange={(v) => setData('division_id', Number(v))}
                                disabled={data.action === 'view'}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select division" />
                                </SelectTrigger>
                                <SelectContent>
                                    {divisions.map((div) => (
                                        <SelectItem key={div.id} value={String(div.id)}>
                                            {div.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            
                            {errors.division_id && (
                                <p className="text-sm text-red-500">{errors.division_id}</p>
                            )}
                        </div>

                        {/* Employment Status */}
                        <div>
                            <Label>Employment Status</Label>
                            <Select
                                value={data.employment_status}
                                onValueChange={(v) => setData('employment_status', v)}
                                disabled={data.action === 'view'}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="probationary">Probationary</SelectItem>
                                    <SelectItem value="regular">Regular</SelectItem>
                                    <SelectItem value="casual">Casual</SelectItem>
                                    <SelectItem value="resigned">Resigned</SelectItem>
                                    <SelectItem value="terminated">Terminated</SelectItem>
                                </SelectContent>
                            </Select>
                            
                            {errors.employment_status && (
                                <p className="text-sm text-red-500">{errors.employment_status}</p>
                            )}
                        </div>

                        {/* Employment Type */}
                        <div>
                            <Label>Employment Type</Label>
                            <Select
                                value={data.employment_type}
                                onValueChange={(v) => setData('employment_type', v)}
                                disabled={data.action === 'view'}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="full_time">Full-time</SelectItem>
                                    <SelectItem value="part_time">Part-time</SelectItem>
                                    <SelectItem value="contractual">Contractual</SelectItem>
                                    <SelectItem value="intern">Intern</SelectItem>
                                    <SelectItem value="project_based">Project-based</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.employment_type && (
                                <p className="text-sm text-red-500">{errors.employment_type}</p>
                            )}
                        </div>

                        {/* Salary */}
                        <div>
                            <Label>Salary</Label>
                            <Input
                                type="number"
                                value={data.salary}
                                readOnly={data.action === 'view'}
                                onChange={(e) => setData('salary', Number(e.target.value))}
                            />
                            
                            {errors.salary && (
                                <p className="text-sm text-red-500">{errors.salary}</p>
                            )}
                        </div>

                        {/* Allowance */}
                        <div>
                            <Label>Allowance</Label>
                            <Input
                                type="number"
                                value={data.allowance}
                                readOnly={data.action === 'view'}
                                onChange={(e) => setData('allowance', Number(e.target.value))}
                            />
                        </div>

                        {/* Date Hired */}
                        <div>
                            <Label>Date Hired</Label>
                            <Input
                                type="date"
                                value={data.hired_at}
                                readOnly={data.action === 'view'}
                                onChange={(e) => setData('hired_at', e.target.value)}
                            />
                            
                            {errors.hired_at && (
                                <p className="text-sm text-red-500">{errors.hired_at}</p>
                            )}
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <Label>Date of Birth</Label>
                            <Input
                                type="date"
                                value={data.date_of_birth}
                                readOnly={data.action === 'view'}
                                onChange={(e) => setData('date_of_birth', e.target.value)}
                            />
                            
                            {errors.date_of_birth && (
                                <p className="text-sm text-red-500">{errors.date_of_birth}</p>
                            )}
                        </div>

                        {/* Gender */}
                        <div>
                            <Label>Gender</Label>
                            <Select
                                value={data.gender}
                                onValueChange={(v) => setData('gender', v)}
                                disabled={data.action === 'view'}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            
                            {errors.gender && (
                                <p className="text-sm text-red-500">{errors.gender}</p>
                            )}
                        </div>

                        {/* Marital Status */}
                        <div>
                            <Label>Marital Status</Label>
                            <Select
                                value={data.marital_status}
                                onValueChange={(v) => setData('marital_status', v)}
                                disabled={data.action === 'view'}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="single">Single</SelectItem>
                                    <SelectItem value="married">Married</SelectItem>
                                    <SelectItem value="widowed">Widowed</SelectItem>
                                </SelectContent>
                            </Select>
                            
                            {errors.marital_status && (
                                <p className="text-sm text-red-500">{errors.marital_status}</p>
                            )}
                        </div>

                        {/* Address (full width) */}
                        <div className="col-span-2">
                            <Label>Address</Label>
                            <Input
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                readOnly={data.action === 'view'}
                            />
                            
                            {errors.address && (
                                <p className="text-sm text-red-500">{errors.address}</p>
                            )}
                        </div>

                    </div>
                    {data.action !== 'view' && (
                        <DialogFooter className='p-6'>
                            <Button onClick={submit} disabled={processing}>
                                {processing ? 'Saving...' : 'Save Employee'}
                            </Button>
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>


        </AppLayout>
    );
}