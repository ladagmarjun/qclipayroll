// @/hooks/use-permission.ts
import { usePage } from '@inertiajs/react'

export function usePermission() {
    const { auth }: any = usePage().props

    const hasPermission = (permission?: string) => {
        if (!permission) return true
        return auth.permissions?.includes(permission)
    }

    const hasRole = (role?: string) => {
        if (!role) return true
        return auth.roles?.includes(role)
    }

    return { hasPermission, hasRole }
}
