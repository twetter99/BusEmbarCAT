'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Download, FileSpreadsheet, FileText, FileDown } from 'lucide-react';
import { 
  exportToCSV, 
  exportToExcel, 
  exportToPDF,
  type ExportColumn,
} from '@/lib/export-utils';
import { useToast } from '@/hooks/use-toast';

interface ExportButtonsProps {
  filename: string;
  title: string;
  columns: ExportColumn[];
  data: Record<string, unknown>[];
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ExportButtons({
  filename,
  title,
  columns,
  data,
  variant = 'outline',
  size = 'default',
}: ExportButtonsProps) {
  const { toast } = useToast();

  const handleExportCSV = () => {
    try {
      exportToCSV({ filename, title, columns, data });
      toast({
        title: 'CSV exportat',
        description: `S'ha generat ${filename}.csv amb ${data.length} registres.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No s\'ha pogut generar el fitxer CSV.',
        variant: 'destructive',
      });
    }
  };

  const handleExportExcel = () => {
    try {
      exportToExcel({ filename, title, columns, data });
      toast({
        title: 'Excel exportat',
        description: `S'ha generat ${filename}.xls amb ${data.length} registres.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No s\'ha pogut generar el fitxer Excel.',
        variant: 'destructive',
      });
    }
  };

  const handleExportPDF = () => {
    try {
      exportToPDF({ filename, title, columns, data });
      toast({
        title: 'PDF preparat',
        description: 'S\'ha obert la finestra d\'impressió per generar el PDF.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No s\'ha pogut generar el PDF.',
        variant: 'destructive',
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size}>
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Format d'exportació</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleExportCSV}>
          <FileText className="mr-2 h-4 w-4" />
          CSV (dades)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportExcel}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Excel (.xls)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF}>
          <FileDown className="mr-2 h-4 w-4" />
          PDF (informe)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Componente simplificado para exportación rápida con iconos individuales
interface QuickExportProps {
  filename: string;
  title: string;
  columns: ExportColumn[];
  data: Record<string, unknown>[];
}

export function QuickExportButtons({ filename, title, columns, data }: QuickExportProps) {
  const { toast } = useToast();

  const handleExportCSV = () => {
    exportToCSV({ filename, title, columns, data });
    toast({ title: 'CSV exportat', description: `${data.length} registres.` });
  };

  const handleExportExcel = () => {
    exportToExcel({ filename, title, columns, data });
    toast({ title: 'Excel exportat', description: `${data.length} registres.` });
  };

  const handleExportPDF = () => {
    exportToPDF({ filename, title, columns, data });
    toast({ title: 'PDF preparat' });
  };

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" onClick={handleExportCSV} title="Exportar CSV">
        <FileText className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={handleExportExcel} title="Exportar Excel">
        <FileSpreadsheet className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={handleExportPDF} title="Exportar PDF">
        <FileDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
