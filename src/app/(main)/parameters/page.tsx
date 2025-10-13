
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ParametersPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Paràmetres Generals</CardTitle>
            <CardDescription>
              Ajusteu la configuració general de l'aplicació.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="company-name">Nom de l'Empresa</Label>
              <Input id="company-name" defaultValue="BusEmbarCAT" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select defaultValue="ca">
                <SelectTrigger id="language">
                  <SelectValue placeholder="Seleccionar idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ca">Català</SelectItem>
                  <SelectItem value="es">Espanyol</SelectItem>
                  <SelectItem value="en">Anglès</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="default-sla">SLA per defecte per a incidències (dies)</Label>
              <Input id="default-sla" type="number" defaultValue="3" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="ml-auto">Guardar Canvis</Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
