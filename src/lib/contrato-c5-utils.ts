/**
 * Utilidades para el Contrato C-5/2025
 * Cálculos de componentes, validaciones y helpers
 */

import { differenceInDays, addDays, isAfter, isBefore, addMonths } from 'date-fns';
import { composicionKitIntegral, catalogoProductosC5, componentesKitC5 } from './contrato-c5-data';
import { 
  CONTRATO_C5_CONFIG,
  type ProductoC5, 
  type ReparacionC5, 
  type GarantiaC5, 
  type NecesidadComponente,
  type ResumenStockKit,
} from './contrato-c5-types';

// ============================================
// CÁLCULO DE COMPONENTES PARA KITS
// ============================================

/**
 * Calcula los componentes necesarios para fabricar N kits
 */
export function calcularComponentesKit(numKits: number): NecesidadComponente[] {
  return composicionKitIntegral.map(comp => {
    const producto = catalogoProductosC5.find(p => p.id === comp.productoId);
    const cantidadNecesaria = comp.cantidadPorKit * numKits;
    const stockDisponible = producto ? producto.stockActual - (producto.stockReservado || 0) : 0;
    
    return {
      productoId: comp.productoId,
      sku: comp.sku,
      nombre: comp.nombre,
      subcategoria: comp.subcategoria,
      cantidadPorKit: comp.cantidadPorKit,
      cantidadNecesaria,
      stockDisponible,
      stockSuficiente: stockDisponible >= cantidadNecesaria,
      faltante: Math.max(0, cantidadNecesaria - stockDisponible),
    };
  });
}

/**
 * Calcula cuántos kits completos se pueden fabricar con el stock actual
 */
export function calcularKitsFabricables(): ResumenStockKit {
  let minKitsFabricables = Infinity;
  let componenteLimitante: { nombre: string; stock: number; necesarioPorKit: number } | null = null;
  const detalles: { nombre: string; stockDisponible: number; kitsFabricables: number }[] = [];

  for (const comp of composicionKitIntegral) {
    const producto = catalogoProductosC5.find(p => p.id === comp.productoId);
    if (!producto) continue;

    const stockDisponible = producto.stockActual - (producto.stockReservado || 0);
    const kitsConEsteComponente = Math.floor(stockDisponible / comp.cantidadPorKit);
    
    detalles.push({
      nombre: comp.nombre,
      stockDisponible,
      kitsFabricables: kitsConEsteComponente,
    });

    if (kitsConEsteComponente < minKitsFabricables) {
      minKitsFabricables = kitsConEsteComponente;
      componenteLimitante = {
        nombre: comp.nombre,
        stock: stockDisponible,
        necesarioPorKit: comp.cantidadPorKit,
      };
    }
  }

  return {
    kitsFabricables: minKitsFabricables === Infinity ? 0 : minKitsFabricables,
    componenteLimitante,
    detalleComponentes: detalles,
  };
}

/**
 * Verifica si hay stock suficiente para fabricar N kits
 */
export function verificarStockParaKits(numKits: number): { 
  suficiente: boolean; 
  componentesFaltantes: NecesidadComponente[];
} {
  const necesidades = calcularComponentesKit(numKits);
  const faltantes = necesidades.filter(n => !n.stockSuficiente);
  
  return {
    suficiente: faltantes.length === 0,
    componentesFaltantes: faltantes,
  };
}

// ============================================
// CONTROL DE GARANTÍAS
// ============================================

/**
 * Calcula la fecha de fin de garantía según el contrato (24 meses)
 */
export function calcularFinGarantia(fechaEntrega: Date): Date {
  return addMonths(fechaEntrega, CONTRATO_C5_CONFIG.garantiaMeses);
}

/**
 * Verifica si una garantía está vigente
 */
export function garantiaVigente(garantia: GarantiaC5): boolean {
  return isAfter(garantia.fechaFinGarantia, new Date());
}

/**
 * Calcula los días restantes de garantía
 */
export function diasRestantesGarantia(garantia: GarantiaC5): number {
  const hoy = new Date();
  return differenceInDays(garantia.fechaFinGarantia, hoy);
}

/**
 * Verifica si la garantía está próxima a vencer (dentro de los próximos 60 días)
 */
export function garantiaProximaVencer(garantia: GarantiaC5): boolean {
  const diasRestantes = diasRestantesGarantia(garantia);
  return diasRestantes > 0 && diasRestantes <= CONTRATO_C5_CONFIG.diasAlertaGarantia;
}

/**
 * Determina el estado de una garantía
 */
export function determinarEstadoGarantia(garantia: GarantiaC5): GarantiaC5['estado'] {
  const diasRestantes = diasRestantesGarantia(garantia);
  
  if (diasRestantes <= 0) return 'vencida';
  if (diasRestantes <= CONTRATO_C5_CONFIG.diasAlertaGarantia) return 'proxima_vencer';
  return 'vigente';
}

// ============================================
// CONTROL DE SLA EN REPARACIONES
// ============================================

/**
 * Obtiene el SLA en días según el tipo de incidencia
 */
export function obtenerSLADias(tipoIncidencia: 'averia' | 'vandalismo'): number {
  return tipoIncidencia === 'averia' 
    ? CONTRATO_C5_CONFIG.slaReparacionAveriaDias 
    : CONTRATO_C5_CONFIG.slaReparacionVandalismoDias;
}

/**
 * Calcula la fecha límite de SLA para una reparación
 */
export function calcularFechaLimiteSLA(fechaReporte: Date, tipoIncidencia: 'averia' | 'vandalismo'): Date {
  const slaDias = obtenerSLADias(tipoIncidencia);
  return addDays(fechaReporte, slaDias);
}

/**
 * Calcula los días transcurridos desde el reporte de una reparación
 */
export function diasTranscurridosReparacion(reparacion: ReparacionC5): number {
  const fechaFin = reparacion.fechaResolucion || new Date();
  return differenceInDays(fechaFin, reparacion.fechaReporte);
}

/**
 * Calcula los días restantes para cumplir el SLA
 */
export function diasRestantesSLA(reparacion: ReparacionC5): number {
  if (reparacion.estado === 'cerrada') {
    // Si ya está cerrada, calculamos si cumplió o no
    const diasUsados = differenceInDays(reparacion.fechaResolucion!, reparacion.fechaReporte);
    return reparacion.slaDias - diasUsados;
  }
  return differenceInDays(reparacion.fechaLimiteSLA, new Date());
}

/**
 * Verifica si una reparación está cumpliendo el SLA
 */
export function cumpleSLA(reparacion: ReparacionC5): boolean {
  if (reparacion.estado === 'cerrada') {
    // Si ya está cerrada, verificamos si se cerró a tiempo
    return reparacion.fechaResolucion ? isBefore(reparacion.fechaResolucion, reparacion.fechaLimiteSLA) : false;
  }
  // Si sigue abierta, verificamos si aún hay tiempo
  return isAfter(reparacion.fechaLimiteSLA, new Date());
}

/**
 * Verifica si una reparación está en riesgo de incumplir SLA
 */
export function slaEnRiesgo(reparacion: ReparacionC5): boolean {
  if (reparacion.estado === 'cerrada') return false;
  const diasRestantes = diasRestantesSLA(reparacion);
  return diasRestantes > 0 && diasRestantes <= CONTRATO_C5_CONFIG.diasAlertaSLA;
}

/**
 * Calcula el porcentaje de avance del SLA (100% = tiempo agotado)
 */
export function porcentajeAvanceSLA(reparacion: ReparacionC5): number {
  const diasUsados = diasTranscurridosReparacion(reparacion);
  return Math.min(100, Math.round((diasUsados / reparacion.slaDias) * 100));
}

// ============================================
// HELPERS DE STOCK
// ============================================

/**
 * Calcula el stock disponible (actual - reservado)
 */
export function stockDisponible(producto: ProductoC5): number {
  return producto.stockActual - (producto.stockReservado || 0);
}

/**
 * Verifica si un producto tiene stock bajo
 */
export function stockBajo(producto: ProductoC5): boolean {
  if (!producto.stockMinimo) return false;
  return stockDisponible(producto) <= producto.stockMinimo;
}

/**
 * Calcula el porcentaje de uso del stock máximo del contrato
 */
export function porcentajeStockUsado(producto: ProductoC5): number {
  if (!producto.stockMaximoContrato) return 0;
  return Math.round((producto.stockActual / producto.stockMaximoContrato) * 100);
}

/**
 * Obtiene productos con stock bajo
 */
export function obtenerProductosStockBajo(): ProductoC5[] {
  return catalogoProductosC5.filter(stockBajo);
}

/**
 * Agrupa productos por categoría
 */
export function agruparPorCategoria(productos: ProductoC5[]): Record<string, ProductoC5[]> {
  return productos.reduce((acc, prod) => {
    const cat = prod.categoria;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(prod);
    return acc;
  }, {} as Record<string, ProductoC5[]>);
}

/**
 * Agrupa componentes del kit por subcategoría
 */
export function agruparComponentesPorSubcategoria(): Record<string, ProductoC5[]> {
  return componentesKitC5.reduce((acc, comp) => {
    const subcat = comp.subcategoria || 'otros';
    if (!acc[subcat]) acc[subcat] = [];
    acc[subcat].push(comp);
    return acc;
  }, {} as Record<string, ProductoC5[]>);
}

// ============================================
// ESTADÍSTICAS Y KPIs
// ============================================

/**
 * Calcula estadísticas de reparaciones
 */
export function calcularEstadisticasReparaciones(reparaciones: ReparacionC5[]): {
  total: number;
  abiertas: number;
  cerradas: number;
  enSLA: number;
  fueraSLA: number;
  tiempoMedioDias: number;
  tasaCumplimientoSLA: number;
} {
  const cerradas = reparaciones.filter(r => r.estado === 'cerrada');
  const abiertas = reparaciones.filter(r => r.estado !== 'cerrada');
  
  const enSLA = reparaciones.filter(cumpleSLA).length;
  const fueraSLA = reparaciones.length - enSLA;
  
  const tiempoMedioDias = cerradas.length > 0
    ? Math.round(cerradas.reduce((sum, r) => sum + diasTranscurridosReparacion(r), 0) / cerradas.length)
    : 0;
  
  const tasaCumplimientoSLA = reparaciones.length > 0
    ? Math.round((enSLA / reparaciones.length) * 100)
    : 100;

  return {
    total: reparaciones.length,
    abiertas: abiertas.length,
    cerradas: cerradas.length,
    enSLA,
    fueraSLA,
    tiempoMedioDias,
    tasaCumplimientoSLA,
  };
}

/**
 * Calcula estadísticas de garantías
 */
export function calcularEstadisticasGarantias(garantias: GarantiaC5[]): {
  total: number;
  vigentes: number;
  proximasVencer: number;
  vencidas: number;
} {
  return {
    total: garantias.length,
    vigentes: garantias.filter(g => g.estado === 'vigente').length,
    proximasVencer: garantias.filter(g => g.estado === 'proxima_vencer').length,
    vencidas: garantias.filter(g => g.estado === 'vencida').length,
  };
}

// ============================================
// FORMATTERS
// ============================================

export const LABELS_CATEGORIA: Record<string, string> = {
  equipo_principal: 'Equipos Principales',
  componente_kit: 'Componentes del Kit',
};

export const LABELS_SUBCATEGORIA: Record<string, string> = {
  fueton_alargador: 'Fuetons / Alargadores de Antena',
  placa_conexiones: 'Placa de Conexiones (Borner)',
  contra_conector: 'Contra-conector MCC',
  conector_harting: 'Conectores Harting',
  cables_conectores: 'Otros Cables y Conectores',
};

export const LABELS_ESTADO_REPARACION: Record<string, string> = {
  abierta: 'Abierta',
  en_diagnostico: 'En Diagnóstico',
  en_reparacion: 'En Reparación',
  pendiente_repuesto: 'Pendiente Repuesto',
  reparada: 'Reparada',
  sustitucion: 'Sustitución',
  cerrada: 'Cerrada',
};

export const LABELS_TIPO_INCIDENCIA: Record<string, string> = {
  averia: 'Avería',
  vandalismo: 'Vandalismo',
};

export const LABELS_ESTADO_GARANTIA: Record<string, string> = {
  vigente: 'Vigente',
  proxima_vencer: 'Próxima a Vencer',
  vencida: 'Vencida',
};
