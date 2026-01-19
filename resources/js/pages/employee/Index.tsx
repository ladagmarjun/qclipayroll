import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employees',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employees" />
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Employees</CardTitle>
                    <CardDescription>
                    List of registered employees
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Position</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                    
                    </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AppLayout>
    );
}