
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
  Barcode,
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
      { 
        id: 'contrato-c4', 
        href: '#', 
        label: 'Contracte C-4/2025', 
        icon: FileSpreadsheet,
        subItems: [
            { id: 'c4-dashboard', href: '/contrato-c4-2025', label: 'Dashboard C-4', icon: LayoutDashboard },
            { id: 'c4-planning', href: '/contrato-c4-2025/planning', label: 'Planificació', icon: CalendarIcon },
            { id: 'c4-work', href: '/contrato-c4-2025/work', label: 'Ordres de Treball', icon: CalendarCheck },
            { id: 'c4-tracking', href: '/contrato-c4-2025/tracking', label: 'Seguiment i Informes', icon: FileText },
            { id: 'c4-inventory', href: '/contrato-c4-2025/inventory', label: 'Inventari Validadores', icon: Boxes },
        ]
      },
      { 
        id: 'contrato-c5', 
        href: '#', 
        label: 'Contracte C-5/2025', 
        icon: Boxes,
        subItems: [
            { id: 'c5-dashboard', href: '/contrato-c5-2025', label: 'Dashboard C-5', icon: LayoutDashboard },
            { id: 'c5-pedidos', href: '/contrato-c5-2025/pedidos', label: 'Comandes i Fabricació', icon: FileSpreadsheet },
            { id: 'c5-inventario', href: '/contrato-c5-2025/inventario', label: 'Inventari i Traçabilitat', icon: Boxes },
            { id: 'c5-series', href: '/contrato-c5-2025/series', label: 'Sèries i Lots', icon: Barcode },
            { id: 'c5-movimientos', href: '/contrato-c5-2025/movimientos', label: 'Moviments', icon: History },
            { id: 'c5-logistica', href: '/contrato-c5-2025/logistica', label: 'Logística i Pick&Pack', icon: Truck },
            { id: 'c5-recambios', href: '/contrato-c5-2025/recambios', label: 'Recambi i Mínims', icon: Wrench },
            { id: 'c5-garantias', href: '/contrato-c5-2025/garantias', label: 'Garanties i RMA', icon: ShieldCheck },
            { id: 'c5-reporting', href: '/contrato-c5-2025/reporting', label: 'Informes i KPIs', icon: BarChart3 },
        ]
      },
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
            'fleet', 'reports', 'access', 'contrato-c4', 'c4-dashboard', 'c4-inventory', 'c4-planning', 'c4-work', 'c4-tracking',
            'contrato-c5', 'c5-dashboard', 'c5-pedidos', 'c5-inventario', 'c5-logistica', 'c5-recambios', 'c5-garantias', 'c5-reporting',
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
            'operators', 'fleet', 'reports', 'system-config', 'users', 'access', 'parameters', 'contrato-c4', 'c4-dashboard', 'c4-inventory', 'c4-planning', 'c4-work', 'c4-tracking',
            'contrato-c5', 'c5-dashboard', 'c5-pedidos', 'c5-inventario', 'c5-logistica', 'c5-recambios', 'c5-garantias', 'c5-reporting',
            // Grant access to new submodules
            'preventive-dashboard', 'planning', 'active', 'history', 'due', 'analysis', 'plan-config'
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
