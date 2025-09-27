
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import {
  Bus,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useAuth } from '@/hooks/use-auth';
import { hasPermission, navItems, NavItem } from '@/lib/permissions';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const renderNavItems = (items: NavItem[], userRole: string, currentPath: string) => {
  return items.map((item) => {
    if (!hasPermission(userRole, item.id)) return null;

    if (item.subItems && item.subItems.length > 0) {
      const isParentActive = item.subItems.some(sub => currentPath.startsWith(sub.href));
      return (
        <SidebarMenuItem key={item.label} className="!p-0">
          <Collapsible defaultOpen={isParentActive}>
            <CollapsibleTrigger asChild className="w-full">
               <SidebarMenuButton
                isActive={isParentActive}
                icon={<item.icon />}
                className="justify-between group"
                >
                <span>{item.label}</span>
                <ChevronRight className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.subItems.map(subItem => hasPermission(userRole, subItem.id) && (
                    <SidebarMenuItem key={subItem.href}>
                        <SidebarMenuSubButton asChild isActive={currentPath === subItem.href}>
                            <Link href={subItem.href}>
                                {subItem.icon && <subItem.icon />}
                                <span>{subItem.label}</span>
                            </Link>
                        </SidebarMenuSubButton>
                    </SidebarMenuItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem key={item.label}>
        <SidebarMenuButton
          asChild
          isActive={currentPath === item.href}
          icon={<item.icon />}
          tooltip={{ children: item.label }}
        >
          <Link href={item.href}>
            {item.label}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  });
};


export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  
  const getNavTitle = () => {
    const allItems = [...navItems.main, ...navItems.config];
    for (const item of allItems) {
      if (item.href === pathname) {
        return item.label;
      }
      if (item.subItems) {
        const subItem = item.subItems.find(sub => pathname.startsWith(sub.href));
        if (subItem) return subItem.label;
      }
    }
    // Specific check for detail pages
    if (pathname.startsWith('/vehicles/')) return 'Ficha del Vehículo';
    if (pathname.startsWith('/maintenance/preventive/')) return 'Ficha de Mantenimiento';
    
    return 'Panel de control';
  }

  if (!user) return null;

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
                <SidebarGroup>
                    <SidebarGroupLabel>Principal</SidebarGroupLabel>
                    {renderNavItems(navItems.main, user.role, pathname)}
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarGroup>
                    <SidebarGroupLabel>Configuración</SidebarGroupLabel>
                     {renderNavItems(navItems.config, user.role, pathname)}
                </SidebarGroup>
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="justify-start gap-2 w-full px-2">
                         <Avatar className="h-8 w-8">
                           {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={userAvatar.description} />}
                           <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                         </Avatar>
                         <div className="text-left">
                            <p className="truncate text-sm font-medium">{user.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{user.role}</p>
                         </div>
                    </Button>
                </DropdownMenuTrigger>
                 <DropdownMenuContent className="w-56 mb-2" side="top" align="start">
                    <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><User className="mr-2 h-4 w-4" /><span>Perfil</span></DropdownMenuItem>
                    <DropdownMenuItem><Settings className="mr-2 h-4 w-4" /><span>Configuración</span></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /><span>Cerrar sesión</span></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-col w-full">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight font-headline">
              {getNavTitle()}
            </h2>
          </div>
          <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                         <Avatar className="h-8 w-8">
                           {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={userAvatar.description} />}
                           <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
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
                    <DropdownMenuItem onClick={handleLogout}>Cerrar sesión</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
        <SidebarInset>{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
