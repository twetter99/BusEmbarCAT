import type { Role } from './types';
import {
  Bus,
  Truck,
  HardDrive,
  ClipboardList,
  CheckSquare,
  Sparkles,
  Siren,
  Boxes,
  Users,
  Building,
  SlidersHorizontal,
  KeyRound,
  LucideIcon,
  Wrench,
  CalendarCheck,
  ShieldCheck,
} from 'lucide-react';

export type NavItem = {
    id: string;
    href: string;
    label: string;
    icon: LucideIcon;
    subItems?: NavItem[];
}

export type NavConfig = {
    production: NavItem[];
    configuration: NavItem[];
}

export const navItems: NavConfig = {
    production: [
      { id: 'dashboard', href: '/', label: 'Panel de control', icon: Bus },
      { id: 'vehicles', href: '/vehicles', label: 'Vehículos', icon: Truck },
      { id: 'equipment', href: '/equipment', label: 'Equipamiento', icon: HardDrive },
      { id: 'maintenance', href: '#', label: 'Mantenimiento y averías', icon: Wrench, subItems: [
        { id: 'preventive', href: '/maintenance/preventive', label: 'Preventivo', icon: CalendarCheck },
        { id: 'corrective', href: '/maintenance/corrective', label: 'Correctivo', icon: ShieldCheck },
      ]},
      { id: 'summarize', href: '/summarize', label: 'Resumen IA', icon: Sparkles },
      { id: 'inventory', href: '/inventory', label: 'Inventario', icon: Boxes },
    ],
    configuration: [
        { id: 'users', href: '/users', label: 'Usuarios y Roles', icon: Users },
        { id: 'operators', href: '/operators', label: 'Operadores', icon: Building },
        { id: 'parameters', href: '/parameters', label: 'Parámetros', icon: SlidersHorizontal },
        { id: 'access', href: '/access', label: 'Accesos', icon: KeyRound },
    ]
}

const permissions: Record<Role, { read: string[], write: string[] }> = {
    'Administrador': {
        read: ['*'],
        write: ['*'],
    },
    'Operador': {
        read: [
            'dashboard', 'vehicles', 'equipment', 'tasks', 'checklists', 'summarize', 'incidents', 'inventory', 'breakdowns', 'preventive', 'corrective', 'maintenance'
        ],
        write: [
            'dashboard', 'vehicles', 'equipment', 'tasks', 'checklists', 'incidents', 'inventory', 'breakdowns'
        ],
    },
    'Sermetra': {
        read: [
            'dashboard', 'vehicles', 'equipment', 'tasks', 'checklists', 'summarize', 'incidents', 'inventory', 'breakdowns', 'preventive', 'corrective', 'maintenance'
        ],
        write: [],
    }
}

// Test mode flag - set to false to enable permission checks
const TEST_MODE = true;

export const hasPermission = (role: Role, itemId: string, accessType: 'read' | 'write' = 'read'): boolean => {
    if (TEST_MODE) return true;
    
    const rolePermissions = permissions[role];
    if (!rolePermissions) return false;

    const canAccess = (list: string[]) => list.includes('*') || list.includes(itemId);

    if (accessType === 'read') {
        return canAccess(rolePermissions.read);
    }

    if (accessType === 'write') {
        return canAccess(rolePermissions.write);
    }
    
    return false;
}
