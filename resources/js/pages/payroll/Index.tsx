import AppLayout from '@/layouts/app-layout'
import { dashboard } from '@/routes'
import { Head, Link, router, useForm } from '@inertiajs/react'
import { type BreadcrumbItem } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { route } from 'ziggy-js'
import { Checkbox } from '@/components/ui/checkbox'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { useState } from 'react'

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
  division: {
    name: string
  }
}

interface Props {
  payrolls: PayrollItem[]
  divisions: [{id: number, name: string}]
}

export default function PayrollIndex({ payrolls, divisions}: Props) {

  const [confirmAction, setConfirmAction] = useState<{
    id: number
    type: 'paid' | 'cancel'
  } | null>(null)

  const { data, setData, post, processing, errors} = useForm({
    period_start: '',
    period_end: '',
    pay_date: '',
    apply_deductions: false,
    division_id: '',
  })

  const createPayroll = () => {
    post(route('payrolls.store'))
  }

  const proceedAction = () => {
  if (!confirmAction) return

    if (confirmAction.type === 'paid') {
      router.patch(route('payrolls.markPaid', confirmAction.id))
    }

    if (confirmAction.type === 'cancel') {
      router.patch(route('payrolls.cancel', confirmAction.id))
    }

    setConfirmAction(null)
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
            <div>
                <Label>Division</Label>
                <Select
                    value={String(data.division_id)}
                    onValueChange={(v) => setData('division_id', (v))}
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
                <TableHead>Division</TableHead>
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
                  <TableCell>{p.division.name}</TableCell>
                  <TableCell>{p.pay_date}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold
                        ${p.status === 'Paid' && 'bg-green-100 text-green-700'}
                        ${p.status === 'draft' && 'bg-yellow-100 text-yellow-700'}
                        ${p.status === 'Cancel' && 'bg-red-100 text-red-700'}
                      `}
                    >
                      {p.status.toUpperCase()}
                    </span>
                </TableCell>
                  <TableCell className='gap-2 flex'>
                    <Link href={route('payrolls.show', p.id)}>
                      <Button variant="link">View</Button>
                    </Link>

                    {p.status === 'draft' && (
                      <>
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => setConfirmAction({ id: p.id, type: 'paid' })}
                        >
                          Mark Paid
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setConfirmAction({ id: p.id, type: 'cancel' })}
                        >
                          Cancel
                        </Button>
                      </>
                    )}

                    {p.status === 'paid' && (
                      <span className="text-sm text-green-600 font-medium">Paid</span>
                    )}

                    {p.status === 'cancelled' && (
                      <span className="text-sm text-red-600 font-medium">Cancelled</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.type === 'paid'
                ? 'Mark payroll as paid?'
                : 'Cancel payroll?'}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {confirmAction?.type === 'paid'
                ? 'This action will finalize the payroll and cannot be undone.'
                : 'This payroll will be cancelled and cannot be processed.'}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>

            <AlertDialogAction
              className={
                confirmAction?.type === 'paid'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
              onClick={proceedAction}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </AppLayout>
  )
}
