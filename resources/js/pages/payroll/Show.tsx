import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'
import { useState } from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp } from 'lucide-react'

/* ---------------- TYPES ---------------- */

interface Payroll {
  id: number
  payroll_date: string
  date_from: string
  date_to: string
  status: string
}

interface PayrollItem {
  id: number
  employee: {
    employee_no: string
    name: string
    position?: string
  }
  basic_salary: number
  total_attendance: number
  total_overtime: number
  gross_pay: number
  total_deductions: number
  net_pay: number
  earnings: {
    type: string
    label: string
    amount: number
  }[]
  deductions: {
    type: string
    label: string
    source: string
    amount: number
  }[]
}

interface Props {
  payroll: Payroll
  items: PayrollItem[]
}

/* ---------------- COMPONENT ---------------- */

export default function Show({ payroll, items }: Props) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  return (
    <AppLayout>
      <Head title="Payroll Details" />

      {/* HEADER */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Payroll Details</span>
            <Badge variant={payroll.status === 'Approved' ? 'default' : 'secondary'}>
              {payroll.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Payroll Date: <strong>{payroll.payroll_date}</strong> <br />
          Period: <strong>{payroll.date_from}</strong> → <strong>{payroll.date_to}</strong>
        </CardContent>
      </Card>

      {/* PAYROLL TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Employees Payroll</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead />
                <TableHead>Employee No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead className="text-right">Gross Pay</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Net Pay</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {items.map((item) => {
                const isOpen = expandedRow === item.id

                return (
                  <>
                    {/* MAIN ROW */}
                    <TableRow key={item.id}>
                      <TableCell>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            setExpandedRow(isOpen ? null : item.id)
                          }
                        >
                          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </Button>
                      </TableCell>

                      <TableCell>{item.employee.employee_no}</TableCell>
                      <TableCell>{item.employee.name}</TableCell>
                      <TableCell>{item.employee.position ?? '-'}</TableCell>
                      <TableCell className="text-right">
                        ₱ {item.gross_pay}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        ₱ {item.total_deductions}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ₱ {item.net_pay}
                      </TableCell>
                    </TableRow>

                    {/* EXPANDED ROW */}
                    {isOpen && (
                      <TableRow className="bg-muted/40">
                        <TableCell colSpan={7}>
                          <div className="grid grid-cols-2 gap-6 p-4">
                            {/* EARNINGS */}
                            <div>
                              <h4 className="font-semibold mb-2">Earnings</h4>
                              {item.earnings.length ? (
                                item.earnings.map((e, i) => (
                                  <div
                                    key={i}
                                    className="flex justify-between text-sm"
                                  >
                                    <span>{e.label}</span>
                                    <span>₱{e.amount.toFixed(2)}</span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  No earnings
                                </p>
                              )}
                            </div>

                            {/* DEDUCTIONS */}
                            <div>
                              <h4 className="font-semibold mb-2">Deductions</h4>
                              {item.deductions.length ? (
                                item.deductions.map((d, i) => (
                                  <div
                                    key={i}
                                    className="flex justify-between text-sm"
                                  >
                                    <span>
                                      {d.label}
                                      <span className="text-xs text-muted-foreground">
                                        {' '}
                                        ({d.source})
                                      </span>
                                    </span>
                                    <span>₱{d.amount.toFixed(2)}</span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  No deductions
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  )
}
