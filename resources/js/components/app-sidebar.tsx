import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, User } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        permission: 'home',
    },
    {
        title: 'Attendances',
        href: '/attendances',
        icon: LayoutGrid,
        permission: 'view attendance',
    },
    {
        title: 'Overtimes',
        href: '/overtimes',
        icon: LayoutGrid,
        permission: 'view overtime',
    },
    {
        title: 'Employee Deductions',
        href: "/employeegovernmentdeductions",
        icon: LayoutGrid,
        permission: 'view employee deduction',
    },
    {
        title: 'Payroll',
        href: "/payrolls",
        icon: LayoutGrid,
        permission: 'view payroll',
    },
];

const managementItems: NavItem[] = [
    {
        title: 'Employees',
        href: "/employees",
        icon: LayoutGrid,
        permission: 'view employee',
    },
    {
        title: 'Divisions',
        href: "/divisions",
        icon: LayoutGrid,
        permission: 'view division',
    },
    {
        title: 'Departments',
        href:  "/departments",
        icon: LayoutGrid,
        permission: 'view departments',
    },
    {
        title: 'Positions',
        href: "/positions",
        icon: LayoutGrid,
        permission: 'view positions',
    },
    {
        title: 'Schedules',
        href: "/schedules",
        icon: LayoutGrid,
        permission: 'schedule',
    },
    {
        title: 'Government Deductions',
        href: "/governmentdeductions",
        icon: LayoutGrid,
        permission: 'government deduction',
    },
    // {
    //     title: 'Employee Loans',
    //     href: "/loanmanagements",
    //     icon: LayoutGrid,
    // },
    {
        title: 'Users',
        href: "/users",
        icon: User,
        permission: 'view user',
    },
    {
        title: 'Roles',
        href: "/roles",
        icon: LayoutGrid,
        permission: 'manage roles',
    },
];

const footerNavItems: NavItem[] = [
  
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain title='Home' items={mainNavItems} />
                <NavMain title='Management' items={managementItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
