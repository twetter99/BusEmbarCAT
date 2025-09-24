import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function InstallationsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <Tabs defaultValue="new-installations">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="new-installations">
              Nuevas Instalaciones (0)
            </TabsTrigger>
            <TabsTrigger value="decommissioning">
              Desinstalaciones (0)
            </TabsTrigger>
            <TabsTrigger value="transfers">Traspasos (0)</TabsTrigger>
            <TabsTrigger value="history">Historial (0)</TabsTrigger>
          </TabsList>
        </div>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Instalaciones y Traspasos</CardTitle>
            <CardDescription>
              Gestiona instalaciones nuevas, desinstalaciones y traspasos de
              equipos entre vehículos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TabsContent value="new-installations" className="m-0">
              <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">
                  No hay nuevas instalaciones planificadas.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="decommissioning" className="m-0">
              <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">
                  No hay desinstalaciones en curso.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="transfers" className="m-0">
              <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">
                  No hay traspasos programados.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="history" className="m-0">
              <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">
                  No hay historial de operaciones disponible.
                </p>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </main>
  );
}