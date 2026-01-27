import AppLayout from '@/layouts/app-layout'
import { dashboard } from '@/routes'
import { Head, useForm } from '@inertiajs/react'
import { type BreadcrumbItem } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { route } from 'ziggy-js'

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Payroll', href: dashboard().url },
  { title: 'Payroll Details', href: '#' },
]

interface PayrollItem {
  id: number
  employee_name: string
  basic_salary: number
  gross_pay: number
  total_deductions: number
  net_pay: number
}

interface Props {
  payroll: {
    id: number
    payroll_code: string
    period_start: string
    period_end: string
    pay_date: string
    status: string
    items: PayrollItem[]
  }
}

export default function PayrollShow({ payroll }: Props) {
  const { post, processing } = useForm({})

  const payPayroll = () => {
    post(route('payrolls.pay', payroll.id))
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Payroll ${payroll.payroll_code}`} />

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Payroll Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>Payroll Code: <b>{payroll.payroll_code}</b></div>
          <div>Period: <b>{payroll.period_start} - {payroll.period_end}</b></div>
          <div>Pay Date: <b>{payroll.pay_date}</b></div>
          <div>Status: <b>{payroll.status}</b></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payroll Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead className="text-right">Gross</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Net</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payroll.items.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.employee_name}</TableCell>
                  <TableCell className="text-right">{item.gross_pay}</TableCell>
                  <TableCell className="text-right">{item.total_deductions}</TableCell>
                  <TableCell className="text-right">{item.net_pay}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-end mt-4">
            <Button onClick={payPayroll} disabled={processing || payroll.status === 'paid'}>
              {processing ? 'Processing...' : 'Mark as Paid'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  )
}
