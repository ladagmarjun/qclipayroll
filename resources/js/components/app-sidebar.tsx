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
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Attendances',
        href: '/attendances',
        icon: LayoutGrid,
    },
    {
        title: 'Overtimes',
        href: '/overtimes',
        icon: LayoutGrid,
    },
    {
        title: 'Employee Deductions',
        href: "/employeegovernmentdeductions",
        icon: LayoutGrid,
    },
    {
        title: 'Payroll',
        href: "/payrolls",
        icon: LayoutGrid,
    },
];

const managementItems: NavItem[] = [
    {
        title: 'Employees',
        href: "/employees",
        icon: LayoutGrid,
    },
    {
        title: 'Divisions',
        href: "/divisions",
        icon: LayoutGrid,
    },
    {
        title: 'Departments',
        href:  "/departments",
        icon: LayoutGrid,
    },
    {
        title: 'Positions',
        href: "/positions",
        icon: LayoutGrid,
    },
    {
        title: 'Schedules',
        href: "/schedules",
        icon: LayoutGrid,
    },
    {
        title: 'Government Deductions',
        href: "/governmentdeductions",
        icon: LayoutGrid,
    },
    // {
    //     title: 'Employee Loans',
    //     href: "/loanmanagements",
    //     icon: LayoutGrid,
    // },
    {
        title: 'Users',
        href: "/users",
        icon: LayoutGrid,
    },
    {
        title: 'Roles',
        href: "/roles",
        icon: LayoutGrid,
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
