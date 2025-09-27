
import type { Role } from './types';
import {
  AreaChart,
  Bus,
  Truck,
  HardDrive,
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
  Replace,
  Group,
  FileText,
  Settings,
} from 'lucide-react';

export type NavItem = {
    id: string;
    href: string;
    label: string;
    icon: LucideIcon;
    subItems?: NavItem[];
}

export type NavConfig = {
    main: NavItem[];
    config: NavItem[];
}

export const navItems: NavConfig = {
    main: [
      { id: 'dashboard', href: '/', label: 'Dashboard Principal', icon: AreaChart },
      { id: 'operators', href: '/operators', label: 'Operadores', icon: Group },
      { id: 'fleet', href: '/vehicles', label: 'Control de Flota', icon: Truck },
      { id: 'equipment', href: '/equipment', label: 'Equipamiento', icon: HardDrive },
      { id: 'installations', href: '/installations', label: 'Instalaciones (LOT 2)', icon: Replace },
      { 
        id: 'maintenance', 
        href: '/maintenance', 
        label: 'Mantenimientos', 
        icon: Wrench,
        subItems: [
            { id: 'preventive', href: '/maintenance/preventive', label: 'Preventivo (LOT 1)', icon: CalendarCheck },
            { id: 'corrective', href: '/maintenance/corrective', label: 'Correctivo (Averías)', icon: Siren },
        ]
      },
      { id: 'inventory', href: '/inventory', label: 'Inventario y Stock', icon: Boxes },
      { id: 'reports', href: '/summarize', label: 'Reportes y Analítica', icon: FileText },
    ],
    config: [
        { id: 'users', href: '/users', label: 'Usuarios y Roles', icon: Users },
        { 
            id: 'system-config', 
            href: '/config', 
            label: 'Configuración', 
            icon: Settings,
            subItems: [
                 { id: 'parameters', href: '/parameters', label: 'Parámetros', icon: SlidersHorizontal },
            ]
        },
        { id: 'access', href: '/access', label: 'Mi Acceso', icon: KeyRound },
    ]
}

const permissions: Record<Role, { read: string[], write: string[] }> = {
    'Administrador': {
        read: ['*'],
        write: ['*'],
    },
    'Operador': {
        read: [
            'dashboard', 'vehicles', 'equipment', 'tasks', 'checklists', 'summarize', 'incidents', 'inventory', 'breakdowns', 'preventive', 'corrective', 'maintenance', 'installations',
            'fleet', 'reports', 'access'
        ],
        write: [
            'dashboard', 'vehicles', 'equipment', 'tasks', 'checklists', 'incidents', 'inventory', 'breakdowns', 'installations'
        ],
    },
    'Sermetra': {
        read: [
            'dashboard', 'vehicles', 'equipment', 'tasks', 'checklists', 'summarize', 'incidents', 'inventory', 'breakdowns', 'preventive', 'corrective', 'maintenance', 'installations',
            'operators', 'fleet', 'reports', 'system-config', 'users', 'access', 'parameters'
        ],
        write: [],
    }
}

// Test mode flag - set to false to enable permission checks
const TEST_MODE = false;

export const hasPermission = (role: Role, itemId: string, accessType: 'read' | 'write' = 'read'): boolean => {
    if (TEST_MODE) return true;
    
    const rolePermissions = permissions[role];
    if (!rolePermissions) return false;

    const canAccess = (list: string[]) => list.includes('*') || list.includes(itemId);

    if (accessType === 'read') {
        // Check main item
        if (canAccess(rolePermissions.read)) return true;
        
        // Check sub-items
        const allItems = [...navItems.main, ...navItems.config];
        const parentItem = allItems.find(item => item.subItems?.some(sub => sub.id === itemId));
        if (parentItem && canAccess(rolePermissions.read)) return true;

        return false;
    }

    if (accessType === 'write') {
        return canAccess(rolePermissions.write);
    }
    
    return false;
}
