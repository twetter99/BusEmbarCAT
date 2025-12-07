'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Bus, Loader2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await login(email, password, rememberMe);
      
      if (result.user) {
        toast({
          title: 'Benvingut!',
          description: `Has iniciat sessió com a ${result.user.name}`,
        });
        router.push('/');
      } else {
        setError(result.error || "Error d'autenticació desconegut.");
      }
    } catch (err) {
      setError("Error del servidor. Intenteu-ho més tard.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex items-center justify-center size-14 bg-primary rounded-2xl">
              <Bus className="size-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Carregant...</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-20">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center size-14 bg-primary rounded-2xl">
            <Bus className="size-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-headline">BusEmbarCAT</CardTitle>
          <CardDescription>
            Inicia sessió per accedir al sistema
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Error message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email">Correu electrònic</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@busembarcat.cat"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Label htmlFor="password">Contrasenya</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {/* Remember me checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                Recorda la sessió (30 dies)
              </Label>
            </div>

            {/* Submit button */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciant sessió...
                </>
              ) : (
                'Iniciar sessió'
              )}
            </Button>
          </CardContent>
        </form>

        <CardFooter className="flex flex-col text-center text-xs text-muted-foreground">
          <p>© 2025 BusEmbarCAT</p>
        </CardFooter>
      </Card>
    </main>
  );
}
