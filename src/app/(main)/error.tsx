'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TriangleAlert } from 'lucide-react';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <div className="mx-auto bg-destructive/10 p-3 rounded-full">
                    <TriangleAlert className="h-8 w-8 text-destructive" />
                </div>
                <CardTitle className="mt-4">Alguna cosa ha anat malament!</CardTitle>
                <CardDescription>{error.message || "S'ha produït un error inesperat."}</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => reset()}>
                    Tornar a intentar
                </Button>
            </CardContent>
        </Card>
        </div>
    </main>
  );
}
