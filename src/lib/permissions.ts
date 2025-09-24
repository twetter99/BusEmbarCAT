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
  LucideIcon
} from 'lucide-react';

type NavItem = {
    id: string;
    href: string;
    label: string;
    icon: LucideIcon;
    subItems?: NavItem[];
}

type NavConfig = {
    production: NavItem[];
    configuration: NavItem[];
}

export const navItems: NavConfig = {
    production: [
      { id: 'dashboard', href: '/', label: 'Panel de control', icon: Bus },
      { id: 'vehicles', href: '/vehicles', label: 'Vehículos', icon: Truck },
      { id: 'equipment', href: '/equipment', label: 'Equipamiento', icon: HardDrive },
      { id: 'tasks', href: '/tasks', label: 'Tareas', icon: ClipboardList },
      { id: 'checklists', href: '/checklists', label: 'Checklists', icon: CheckSquare },
      { id: 'summarize', href: '/summarize', label: 'Resumen IA', icon: Sparkles },
      { id: 'incidents', href: '/incidents', label: 'Incidencias', icon: Siren },
      { id: 'inventory', href: '/inventory', label: 'Inventario', icon: Boxes },
    ],
    configuration: [
        { id: 'users', href: '/settings/users', label: 'Usuarios y Roles', icon: Users },
        { id: 'operators', href: '/settings/operators', label: 'Operadores', icon: Building },
        { id: 'parameters', href: '/settings/parameters', label: 'Parámetros', icon: SlidersHorizontal },
        { id: 'access', href: '/settings/access', label: 'Accesos', icon: KeyRound },
    ]
}

const permissions: Record<Role, { read: string[], write: string[] }> = {
    'Administrador': {
        read: ['*'],
        write: ['*'],
    },
    'Operador': {
        read: [
            'dashboard', 'vehicles', 'equipment', 'tasks', 'checklists', 'summarize', 'incidents', 'inventory'
        ],
        write: [
            'dashboard', 'vehicles', 'equipment', 'tasks', 'checklists', 'incidents', 'inventory'
        ],
    },
    'Sermetra': {
        read: [
            'dashboard', 'vehicles', 'equipment', 'tasks', 'checklists', 'summarize', 'incidents', 'inventory'
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
