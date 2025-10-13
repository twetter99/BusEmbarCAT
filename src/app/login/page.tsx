'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Bus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
        router.push('/');
        return;
    }
    
    const autoLogin = async () => {
      try {
        const loggedInUser = await login('admin@busembacat.com', 'password'); // La contraseña es irrelevante para el mock
        if (loggedInUser) {
          router.push('/');
        } else {
          toast({
            variant: 'destructive',
            title: "Error d'inici de sessió automàtic",
            description: "No s'ha pogut trobar l'usuari de prova.",
          });
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error del servidor',
          description: "No s'ha pogut connectar amb el servidor. Intenteu-ho més tard.",
        });
      }
    };

    autoLogin();
  }, [login, router, toast, user]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center size-14 bg-primary rounded-2xl">
            <Bus className="size-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Iniciant Sessió</CardTitle>
          <CardDescription>
            Accedint al mode de proves...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-20">
            <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    </main>
  );
}
