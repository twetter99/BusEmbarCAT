import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function PreventivePage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Mantenimiento Preventivo</CardTitle>
          <CardDescription>
            Planes, calendario y programación de mantenimiento preventivo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Página en construcción.</p>
        </CardContent>
      </Card>
    </main>
  );
}
