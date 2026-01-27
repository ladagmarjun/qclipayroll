import AppLayout from '@/layouts/app-layout'
import { dashboard } from '@/routes'
import { Head, Link, useForm } from '@inertiajs/react'
import { type BreadcrumbItem } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { route } from 'ziggy-js'
import { Checkbox } from '@/components/ui/checkbox'

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Payroll', href: dashboard().url },
]

interface PayrollItem {
  id: number
  payroll_code: string
  period_start: string
  period_end: string
  pay_date: string
  status: string
}

interface Props {
  payrolls: PayrollItem[]
}

export default function PayrollIndex({ payrolls }: Props) {
  const { data, setData, post, processing, errors} = useForm({
    period_start: '',
    period_end: '',
    pay_date: '',
    apply_deductions: false,
  })

  const createPayroll = () => {
    post(route('payrolls.store'))
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Payroll" />

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Create Payroll</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Period Start</Label>
              <Input type="date" value={data.period_start} onChange={e => setData('period_start', e.target.value)} />
              {errors.period_start && (
                  <p className="text-sm text-red-500">{errors.period_start}</p>
              )}
            </div>
            <div>
              <Label>Period End</Label>
              <Input type="date" value={data.period_end} onChange={e => setData('period_end', e.target.value)} />
               {errors.period_end && (
                  <p className="text-sm text-red-500">{errors.period_end}</p>
              )}
            </div>
            <div>
              <Label>Pay Date</Label>
              <Input type="date" value={data.pay_date} onChange={e => setData('pay_date', e.target.value)} />
              {errors.pay_date && (
                  <p className="text-sm text-red-500">{errors.pay_date}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={data.apply_deductions}
                onCheckedChange={(v) => setData('apply_deductions', Boolean(v))}
              />
              <Label>Apply deductions (SSS, PhilHealth, Loans)</Label>
            </div>
          </div>
          <Button onClick={createPayroll} disabled={processing}>
            {processing ? 'Generating...' : 'Generate Payroll'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payroll Runs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payroll Code</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Pay Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrolls.map(p => (
                <TableRow key={p.id}>
                  <TableCell>{p.payroll_code}</TableCell>
                  <TableCell>{p.period_start} - {p.period_end}</TableCell>
                  <TableCell>{p.pay_date}</TableCell>
                  <TableCell>{p.status}</TableCell>
                  <TableCell>
                    <Link href={route('payrolls.show', p.id)}>
                      <Button variant="link">View</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  )
}
