
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
  LayoutDashboard,
  CalendarClock,
  PlayCircle,
  History,
  ShieldAlert,
  BarChart3,
  Calendar as CalendarIcon,
  FileSpreadsheet,
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
      { id: 'operators', href: '/operators', label: 'Operadors', icon: Group },
      { id: 'fleet', href: '/vehicles', label: 'Control de Flota', icon: Truck },
      { id: 'equipment', href: '/equipment', label: 'Equipament', icon: HardDrive },
      { id: 'installations', href: '/installations', label: 'Instal·lacions i Traspassos', icon: Replace },
      { 
        id: 'maintenance', 
        href: '#', 
        label: 'Manteniment', 
        icon: Wrench,
        subItems: [
            { id: 'preventive-dashboard', href: '/maintenance/preventive', label: 'Dashboard Preventiu', icon: LayoutDashboard },
            { id: 'planning', href: '/maintenance/preventive/planning', label: 'Planificació', icon: CalendarIcon },
            { id: 'active', href: '/maintenance/preventive/active', label: 'Intervencions Actives', icon: PlayCircle },
            { id: 'history', href: '/maintenance/preventive/history', label: 'Historial i Traçabilitat', icon: History },
            { id: 'due', href: '/maintenance/preventive/due', label: 'Control de Venciments', icon: ShieldAlert },
            { id: 'analysis', href: '/maintenance/preventive/analysis', label: 'Anàlisi i Informes', icon: BarChart3 },
            { id: 'plan-config', href: '/maintenance/preventive/config', label: 'Configuració del Pla', icon: Settings },
            { id: 'corrective', href: '/maintenance/corrective', label: 'Correctiu (Avaries)', icon: Siren },
        ]
      },
      { id: 'inventory', href: '/inventory', label: 'Inventari i Estoc', icon: Boxes },
      { id: 'reports', href: '/reports', label: 'Informes i Analítica', icon: FileText },
      { id: 'contrato-c4', href: '/contrato-c4-2025', label: 'Contracte C-4/2025', icon: FileSpreadsheet },
    ],
    config: [
        { id: 'users', href: '/users', label: 'Usuaris i Rols', icon: Users },
        { 
            id: 'system-config', 
            href: '/config', 
            label: 'Configuració', 
            icon: Settings,
            subItems: [
                 { id: 'parameters', href: '/parameters', label: 'Paràmetres Generals', icon: SlidersHorizontal },
            ]
        },
        { id: 'access', href: '/access', label: 'El Meu Accés', icon: KeyRound },
    ]
}

const permissions: Record<Role, { read: string[], write: string[] }> = {
    'Administrador': {
        read: ['*'],
        write: ['*'],
    },
    'Operador': {
        read: [
            'dashboard', 'vehicles', 'equipment', 'tasks', 'checklists', 'reports', 'incidents', 'inventory', 'breakdowns', 'preventive', 'corrective', 'maintenance', 'installations',
            'fleet', 'reports', 'access',
            // Grant access to new submodules
            'preventive-dashboard', 'planning', 'active', 'history', 'due', 'analysis', 'plan-config'
        ],
        write: [
            'dashboard', 'vehicles', 'equipment', 'tasks', 'checklists', 'incidents', 'inventory', 'breakdowns', 'installations'
        ],
    },
    'Sermetra': {
        read: [
            'dashboard', 'vehicles', 'equipment', 'tasks', 'checklists', 'reports', 'incidents', 'inventory', 'breakdowns', 'preventive', 'corrective', 'maintenance', 'installations',
            'operators', 'fleet', 'reports', 'system-config', 'users', 'access', 'parameters', 'contrato-c4',
            // Grant access to new submodules
            'preventive-dashboard', 'planning', 'active', 'history', 'due', 'analysis', 'plan-config'
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
