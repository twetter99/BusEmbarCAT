/**
 * Tipos TypeScript para el Contrato C-5/2025
 * Gestión de Equipos de Comunicaciones para Buses
 * 
 * Equipos principales: Antena Tribanda, Switch Ethernet, Kit Integral
 * Volumetría máxima: 200 unidades por equipo principal
 * Garantía: 2 años desde entrega
 * SLA Reparaciones: 7 días (avería) / 15 días (vandalismo)
 */

// ============================================
// CATEGORÍAS Y SUBCATEGORÍAS
// ============================================

export type CategoriaProductoC5 = 
  | 'equipo_principal'
  | 'componente_kit';

export type SubcategoriaComponente = 
  | 'fueton_alargador'
  | 'placa_conexiones'
  | 'contra_conector'
  | 'conector_harting'
  | 'cables_conectores';

// ============================================
// CONSTANTES DEL CONTRATO
// ============================================

export const CONTRATO_C5_CONFIG = {
  stockMaximoEquiposPrincipales: 200,
  garantiaMeses: 24,
  plazoMaximoEntregaMeses: 3,
  slaReparacionAveriaDias: 7,
  slaReparacionVandalismoDias: 15,
  diasAlertaGarantia: 60, // días antes de vencer para alertar
  diasAlertaSLA: 2, // días antes de vencer SLA para alertar
} as const;

// ============================================
// PRODUCTOS
// ============================================

export interface ProductoC5 {
  id: string;
  sku: string;
  nombre: string;
  descripcion?: string;
  categoria: CategoriaProductoC5;
  subcategoria?: SubcategoriaComponente;
  /** Cantidad de este componente que lleva cada Kit Integral */
  cantidadPorKit?: number;
  /** Stock máximo permitido por contrato (200 para equipos principales) */
  stockMaximoContrato?: number;
  stockActual: number;
  stockMinimo: number;
  stockReservado: number;
  /** Indica si requiere número de serie individual */
  requiereNumeroSerie: boolean;
  unidadMedida: 'ud' | 'm' | 'pack';
  activo: boolean;
}

// ============================================
// COMPOSICIÓN DEL KIT INTEGRAL
// ============================================

export interface ComponenteKit {
  productoId: string;
  sku: string;
  nombre: string;
  cantidadPorKit: number;
  subcategoria: SubcategoriaComponente;
}

// ============================================
// INVENTARIO Y STOCK
// ============================================

export interface UnidadSerieC5 {
  id: string;
  productoId: string;
  numeroSerie: string;
  estado: 'disponible' | 'reservado' | 'instalado' | 'en_reparacion' | 'baja';
  fechaEntrada: Date;
  fechaInstalacion?: Date;
  vehiculoInstalado?: string;
  operadorId?: string;
  garantiaId?: string;
}

export type TipoMovimientoC5 = 
  | 'entrada_stock'
  | 'reserva_pedido'
  | 'salida_instalacion'
  | 'devolucion_reparacion'
  | 'baja';

export interface MovimientoStockC5 {
  id: string;
  tipo: TipoMovimientoC5;
  productoId: string;
  productoNombre: string;
  cantidad: number;
  numeroSerie?: string;
  fecha: Date;
  pedidoRef?: string;
  vehiculoRef?: string;
  operadorId?: string;
  realizadoPor: string;
  notas?: string;
}

// ============================================
// PEDIDOS Y ENTREGAS
// ============================================

export type EstadoPedidoC5 = 
  | 'borrador'
  | 'confirmado'
  | 'en_preparacion'
  | 'enviado'
  | 'entregado'
  | 'entregado_parcial';

export interface LineaPedidoC5 {
  id: string;
  productoId: string;
  sku: string;
  nombre: string;
  cantidadPedida: number;
  cantidadEntregada: number;
  /** Si es Kit Integral, aquí se desglosan los componentes necesarios */
  componentesDesglosados?: { productoId: string; cantidad: number }[];
}

export interface PedidoC5 {
  id: string;
  codigo: string;
  operadorId: string;
  operadorNombre: string;
  estado: EstadoPedidoC5;
  fechaCreacion: Date;
  fechaConfirmacion?: Date;
  /** Fecha límite = fechaConfirmacion + 3 meses */
  fechaEntregaLimite?: Date;
  fechaEntregaReal?: Date;
  lineas: LineaPedidoC5[];
  direccionEntrega?: string;
  notas?: string;
  creadoPor: string;
}

// ============================================
// GARANTÍAS
// ============================================

export type EstadoGarantia = 
  | 'vigente'
  | 'proxima_vencer'  // < 90 días para vencer
  | 'vencida'
  | 'reclamada';

export interface GarantiaC5 {
  id: string;
  productoId: string;
  productoNombre: string;
  numeroSerie: string;
  fechaEntrega: Date;
  /** fechaEntrega + 24 meses */
  fechaFinGarantia: Date;
  estado: EstadoGarantia;
  vehiculoInstalado?: string;
  operadorId: string;
  operadorNombre: string;
  /** Referencias a RMAs asociados */
  rmasAsociados?: string[];
}

// ============================================
// REPARACIONES (RMA con SLA)
// ============================================

export type TipoIncidenciaC5 = 'averia' | 'vandalismo';

export type EstadoReparacionC5 = 
  | 'abierta'
  | 'en_diagnostico'
  | 'en_reparacion'
  | 'reparado'
  | 'sustituido'
  | 'cerrada';

export interface ReparacionC5 {
  id: string;
  codigo: string;
  productoId: string;
  productoNombre: string;
  numeroSerie: string;
  tipoIncidencia: TipoIncidenciaC5;
  /** 7 días para avería, 15 días para vandalismo */
  slaDias: number;
  descripcion: string;
  estado: EstadoReparacionC5;
  fechaReporte: Date;
  fechaLimiteSLA: Date;
  fechaResolucion?: Date;
  diasTranscurridos: number;
  cumpleSLA: boolean;
  vehiculoOrigen?: string;
  operadorId: string;
  operadorNombre: string;
  garantiaRef?: string;
  diagnostico?: string;
  accionCorrectiva?: string;
  numeroSerieSustitucion?: string;
  evidencias?: EvidenciaReparacion[];
  asignadoA?: string;
}

export interface EvidenciaReparacion {
  id: string;
  tipo: 'foto' | 'documento' | 'nota';
  url?: string;
  descripcion: string;
  fecha: Date;
  subidoPor: string;
}

// ============================================
// DASHBOARD Y ALERTAS
// ============================================

export type TipoAlerta = 
  | 'stock_bajo'
  | 'stock_maximo_alcanzado'
  | 'entrega_pendiente'
  | 'garantia_proxima_vencer'
  | 'reparacion_sla_riesgo'
  | 'reparacion_sla_incumplido';

export interface AlertaC5 {
  id: string;
  tipo: TipoAlerta;
  nivel: 'info' | 'warning' | 'critical';
  titulo: string;
  descripcion: string;
  entidadRef?: string;
  fecha: Date;
  leida: boolean;
}

export interface KPIsContratoC5 {
  // Stock
  equiposPrincipalesEnStock: number;
  equiposPrincipalesInstalados: number;
  componentesConStockBajo: number;
  porcentajeStockUsado: number; // vs máximo 200
  
  // Pedidos
  pedidosPendientes: number;
  pedidosEntregadosEnPlazo: number;
  pedidosTotales: number;
  
  // Garantías
  garantiasVigentes: number;
  garantiasProximasVencer: number;
  
  // Reparaciones
  reparacionesAbiertas: number;
  reparacionesEnSLA: number;
  reparacionesFueraSLA: number;
  tiempoMedioReparacionDias: number;
  
  fechaActualizacion: Date;
}

// ============================================
// FILTROS
// ============================================

export interface FiltrosInventarioC5 {
  categoria?: CategoriaProductoC5;
  subcategoria?: SubcategoriaComponente;
  stockBajo?: boolean;
  busqueda?: string;
}

export interface FiltrosReparacionesC5 {
  tipoIncidencia?: TipoIncidenciaC5;
  estado?: EstadoReparacionC5;
  operadorId?: string;
  slaEnRiesgo?: boolean;
  fechaDesde?: Date;
  fechaHasta?: Date;
}

// ============================================
// UTILIDADES DE CÁLCULO
// ============================================

export interface NecesidadComponente {
  productoId: string;
  sku: string;
  nombre: string;
  subcategoria: SubcategoriaComponente;
  cantidadPorKit: number;
  cantidadNecesaria: number;
  stockDisponible: number;
  stockSuficiente: boolean;
  faltante: number;
}

export interface ResumenStockKit {
  kitsFabricables: number;
  componenteLimitante: {
    nombre: string;
    stock: number;
    necesarioPorKit: number;
  } | null;
  detalleComponentes: {
    nombre: string;
    stockDisponible: number;
    kitsFabricables: number;
  }[];
}
