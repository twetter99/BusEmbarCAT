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
          <CardTitle>Gestió d'Accés</CardTitle>
          <CardDescription>
            Tanqueu la vostra sessió actual de forma segura.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={handleLogout}>Tancar Sessió</Button>
        </CardContent>
      </Card>
    </main>
  );
}
