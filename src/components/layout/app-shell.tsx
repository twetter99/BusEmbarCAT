'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Bus,
  Truck,
  HardDrive,
  ClipboardList,
  CheckSquare,
  Sparkles,
  Siren,
  Boxes,
  User,
  LogOut,
  Settings,
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const navItems = [
  { href: '/', label: 'Panel de control', icon: Bus },
  { href: '/vehicles', label: 'Vehículos', icon: Truck },
  { href: '/equipment', label: 'Equipamiento', icon: HardDrive },
  { href: '/tasks', label: 'Tareas', icon: ClipboardList },
  { href: '/checklists', label: 'Checklists', icon: CheckSquare },
  { href: '/summarize', label: 'Resumen IA', icon: Sparkles },
  { href: '/incidents', label: 'Incidencias', icon: Siren },
  { href: '/inventory', label: 'Inventario', icon: Boxes },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-10 bg-primary rounded-lg">
                <Bus className="size-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-sidebar-foreground font-headline">BusEmbarCAT</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    icon={<item.icon />}
                    tooltip={{ children: item.label }}
                  >
                    {item.label}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="justify-start gap-2 w-full px-2">
                         <Avatar className="h-8 w-8">
                           {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={userAvatar.description} />}
                           <AvatarFallback>U</AvatarFallback>
                         </Avatar>
                         <span className="truncate">Supervisor de Mantenimiento</span>
                    </Button>
                </DropdownMenuTrigger>
                 <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
                    <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><User className="mr-2 h-4 w-4" /><span>Perfil</span></DropdownMenuItem>
                    <DropdownMenuItem><Settings className="mr-2 h-4 w-4" /><span>Configuración</span></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><LogOut className="mr-2 h-4 w-4" /><span>Cerrar sesión</span></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-col w-full">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight font-headline">
              {navItems.find(item => item.href === pathname)?.label ?? 'Panel de control'}
            </h2>
          </div>
          <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                         <Avatar className="h-8 w-8">
                           {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={userAvatar.description} />}
                           <AvatarFallback>U</AvatarFallback>
                         </Avatar>
                         <span className="sr-only">Menú de usuario</span>
                    </Button>
                </DropdownMenuTrigger>
                 <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Perfil</DropdownMenuItem>
                    <DropdownMenuItem>Configuración</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
        <SidebarInset>{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
