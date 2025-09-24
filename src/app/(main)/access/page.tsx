'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function AccessPage() {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Gestión de Acceso</CardTitle>
          <CardDescription>
            Cierra tu sesión actual de forma segura.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={handleLogout}>Cerrar Sesión</Button>
        </CardContent>
      </Card>
    </main>
  );
}
