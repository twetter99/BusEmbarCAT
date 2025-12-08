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
  /** Stock disponible para recambios/reparaciones */
  stockRecambio?: number;
  /** Mínimo recomendado de stock de recambio */
  stockMinimoRecambio?: number;
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

/**
 * Asignación de material a un vehículo específico
 * Vincula los equipos del pedido con vehículos del módulo de Control de Flota
 */
export interface AsignacionVehiculo {
  /** ID único de la asignación */
  id: string;
  /** Referencia al vehículo (Vehicle.uniqueId de data.ts) */
  vehiculoId: string;
  /** Número de calca del autobús (codBus) */
  calca: string;
  /** Matrícula del vehículo */
  matricula: string;
  /** ID del operador (para validación cruzada) */
  operadorId: string;
  /** Nombre del operador */
  operadorNombre: string;
  /** Cantidad de unidades asignadas a este vehículo */
  cantidad: number;
  /** Números de serie asignados (se completa en la entrega) */
  numerosSerie?: string[];
  /** Estado de la asignación */
  estadoAsignacion: 'pendiente' | 'en_transito' | 'instalado';
  /** Fecha de instalación real */
  fechaInstalacion?: Date;
}

export interface LineaPedidoC5 {
  id: string;
  productoId: string;
  sku: string;
  nombre: string;
  cantidadPedida: number;
  cantidadEntregada: number;
  /** Si es Kit Integral, aquí se desglosan los componentes necesarios */
  componentesDesglosados?: { productoId: string; cantidad: number }[];
  /** Asignaciones a vehículos específicos (opcional - si no hay, va a stock operador) */
  asignaciones?: AsignacionVehiculo[];
}

/** Tipo de destino de entrega */
export type TipoDestinoEntrega = 'almacen_sermetra' | 'operador_directo';

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
  /** Tipo de destino: almacén Sermetra o directo a operador */
  tipoDestino?: TipoDestinoEntrega;
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

// ============================================
// NÚMEROS DE SERIE Y TRAZABILIDAD
// ============================================

/**
 * Estado de un número de serie
 */
export type EstadoNumeroSerieC5 = 
  | 'disponible'      // En almacén, listo para asignar
  | 'reservado'       // Reservado para un pedido en preparación
  | 'instalado'       // Instalado en un vehículo
  | 'en_garantia'     // Enviado al proveedor por garantía
  | 'en_reparacion'   // En reparación
  | 'baja';           // Dado de baja (destruido, obsoleto, etc.)

/**
 * Ubicación física de un número de serie
 */
export type UbicacionSerieC5 = 
  | 'almacen_sermetra'   // Almacén central de Sermetra
  | 'operador'           // En instalaciones del operador (stock operador)
  | 'vehiculo'           // Instalado en un vehículo específico
  | 'proveedor'          // En proveedor (garantía o reparación)
  | 'baja';              // Dado de baja

/**
 * Número de serie individual de un equipo del contrato C5
 * Permite trazabilidad completa de cada unidad
 */
export interface NumeroSerieC5 {
  id: string;
  numeroSerie: string;              // 'ANT-2025-00042'
  lote?: string;                    // 'LOT-2025-Q1-001' (para kits)
  
  // Producto
  productoId: string;               // 'EP-001'
  sku: string;                      // 'CA01-1524035M-X'
  productoNombre: string;           // 'Antena Tribanda'
  
  /** Indica si esta unidad está designada como recambio */
  esRecambio?: boolean;
  
  // Estado actual
  estado: EstadoNumeroSerieC5;
  ubicacion: UbicacionSerieC5;
  
  // Ubicación específica (según el campo ubicacion)
  operadorId?: string;
  operadorNombre?: string;
  vehiculoId?: string;
  vehiculoCalca?: string;
  vehiculoMatricula?: string;
  
  // Fechas clave
  fechaEntrada: Date;               // Cuando llegó al almacén
  fechaReserva?: Date;              // Cuando se reservó para un pedido
  fechaInstalacion?: Date;          // Cuando se instaló en el vehículo
  fechaBaja?: Date;                 // Cuando se dio de baja
  
  // Referencias a otros documentos
  pedidoOrigenId?: string;          // Pedido por el que entró al sistema
  pedidoOrigenCodigo?: string;
  pedidoDestinoId?: string;         // Pedido para el que está reservado
  pedidoDestinoCodigo?: string;
  garantiaId?: string;              // Si está en garantía
  garantiaCodigo?: string;
  reparacionId?: string;            // Si está en reparación
  reparacionCodigo?: string;
  
  // Metadatos
  notas?: string;
  creadoPor: string;
  actualizadoPor?: string;
  fechaActualizacion?: Date;
}

/**
 * Tipo de movimiento de un número de serie
 */
export type TipoMovimientoSerieC5 = 
  | 'entrada'              // Entrada inicial al almacén
  | 'reserva'              // Reservado para un pedido
  | 'liberacion_reserva'   // Liberación de reserva
  | 'instalacion'          // Instalación en vehículo
  | 'desinstalacion'       // Desinstalación del vehículo
  | 'garantia_salida'      // Envío a proveedor por garantía
  | 'garantia_entrada'     // Retorno de proveedor (garantía)
  | 'reparacion_salida'    // Envío a reparación
  | 'reparacion_entrada'   // Retorno de reparación
  | 'baja';                // Baja del sistema

/**
 * Movimiento histórico de un número de serie
 * Permite ver el historial completo de cada unidad
 */
export interface MovimientoSerieC5 {
  id: string;
  numeroSerieId: string;
  numeroSerie: string;              // Duplicado para facilitar consultas
  tipo: TipoMovimientoSerieC5;
  fecha: Date;
  
  // Estado antes y después del movimiento
  estadoAnterior?: EstadoNumeroSerieC5;
  estadoNuevo: EstadoNumeroSerieC5;
  ubicacionAnterior?: UbicacionSerieC5;
  ubicacionNueva: UbicacionSerieC5;
  
  // Contexto del movimiento (referencias)
  pedidoRef?: string;               // ID del pedido relacionado
  pedidoCodigo?: string;
  garantiaRef?: string;             // ID de la garantía relacionada
  garantiaCodigo?: string;
  reparacionRef?: string;           // ID de la reparación relacionada
  reparacionCodigo?: string;
  vehiculoRef?: string;             // ID del vehículo
  vehiculoCalca?: string;
  operadorRef?: string;             // ID del operador
  operadorNombre?: string;
  
  // Metadatos
  realizadoPor: string;
  notas?: string;
}

// ============================================
// ESTADOS LOGÍSTICOS Y ENVÍOS
// ============================================

/**
 * Estados del proceso de envío
 */
export type EstadoEnvioC5 = 
  | 'pendiente_preparacion'  // Esperando picking
  | 'en_preparacion'         // Picking en curso
  | 'preparado'              // Listo para enviar
  | 'en_transito'            // En camino
  | 'entregado'              // Entregado al destino
  | 'entregado_parcial'      // Entrega parcial (faltan unidades)
  | 'incidencia';            // Con incidencia reportada

/**
 * Tipos de incidencia en envío
 */
export type TipoIncidenciaEnvio = 
  | 'falta_unidades'         // Faltan unidades respecto al albarán
  | 'dano_transporte'        // Daños durante el transporte
  | 'producto_incorrecto'    // Producto diferente al solicitado
  | 'direccion_incorrecta'   // Problema con la dirección
  | 'rechazo_cliente'        // Cliente rechaza la entrega
  | 'otro';                  // Otro tipo de incidencia

/**
 * Incidencia en un envío
 */
export interface IncidenciaEnvioC5 {
  id: string;
  envioId: string;
  tipo: TipoIncidenciaEnvio;
  descripcion: string;
  unidadesAfectadas?: number;
  /** URLs de fotos mock (simuladas) */
  fotos?: string[];
  fechaReporte: Date;
  reportadoPor: string;
  estado: 'abierta' | 'en_gestion' | 'resuelta';
  resolucion?: string;
  fechaResolucion?: Date;
}

/**
 * Registro de un envío logístico
 */
export interface EnvioC5 {
  id: string;
  codigo: string;
  pedidoId: string;
  pedidoCodigo: string;
  operadorId: string;
  operadorNombre: string;
  estado: EstadoEnvioC5;
  /** Series incluidas en este envío */
  seriesEnviadas: string[];
  /** Fecha de preparación del envío */
  fechaPreparacion?: Date;
  /** Fecha de salida del almacén */
  fechaSalida?: Date;
  /** Fecha estimada de llegada */
  fechaEstimadaLlegada?: Date;
  /** Fecha real de entrega */
  fechaEntrega?: Date;
  /** Dirección de destino */
  direccionDestino: string;
  /** Datos del transportista */
  transportista?: string;
  numeroSeguimiento?: string;
  /** Albarán de entrega */
  albaranNumero?: string;
  /** Firma de recepción (URL mock) */
  firmaRecepcion?: string;
  /** Incidencias asociadas */
  incidencias?: IncidenciaEnvioC5[];
  /** Notas adicionales */
  notas?: string;
  creadoPor: string;
}

/**
 * Filtros para búsqueda de números de serie
 */
export interface FiltrosNumeroSerieC5 {
  busqueda?: string;                // Búsqueda por número de serie o lote
  productoId?: string;
  estado?: EstadoNumeroSerieC5;
  ubicacion?: UbicacionSerieC5;
  operadorId?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
}

/**
 * KPIs de números de serie
 */
export interface KPIsNumeroSerieC5 {
  totalSeries: number;
  porEstado: Record<EstadoNumeroSerieC5, number>;
  porProducto: Record<string, number>;
  instaladasEsteMes: number;
  enGarantiaReparacion: number;
  bajasEsteMes: number;
}

// ============================================
// QUALITY ASSURANCE (QA) - CONTROL DE CALIDAD
// ============================================

/**
 * Tipos de control de calidad
 * - inbound: Recepción de mercancía (Switch/Antena)
 * - manufacturing: Ensamblaje de Kits
 * - outbound: Cierre de picking antes de envío
 */
export type TipoQualityGate = 'inbound' | 'manufacturing' | 'outbound';

/**
 * Estados del control de calidad
 */
export type EstadoQualityGate = 
  | 'pendiente'      // Aún no iniciado
  | 'en_progreso'    // Checklist parcialmente completado
  | 'aprobado'       // Todos los checks OK y firmado
  | 'rechazado'      // Algún check NOK - requiere acción correctiva
  | 'bloqueado';     // No se puede avanzar hasta resolver

/**
 * Item individual de un checklist de calidad
 */
export interface ChecklistItemQC {
  id: string;
  codigo: string;          // Código único del check (ej: "MFG-001")
  descripcion: string;     // Descripción del check
  obligatorio: boolean;    // Si es bloqueante
  verificado: boolean;     // Si se ha marcado como OK
  fechaVerificacion?: Date;
  verificadoPor?: string;  // userId
  observaciones?: string;
  evidencias?: string[];   // URLs de fotos/documentos
}

/**
 * Firma digital de validación de calidad
 */
export interface FirmaDigitalQC {
  id: string;
  usuarioId: string;
  usuarioNombre: string;
  usuarioRol: string;
  fechaFirma: Date;
  tipoFirma: 'aprobacion' | 'rechazo';
  observaciones?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Quality Gate completo
 */
export interface QualityGateC5 {
  id: string;
  tipo: TipoQualityGate;
  estado: EstadoQualityGate;
  
  // Referencia a la entidad que se está controlando
  referenciaId: string;          // ID del pedido, lote, etc.
  referenciaTipo: 'pedido' | 'lote_recepcion' | 'orden_fabricacion';
  referenciaCodigo: string;      // Código legible (ej: "PED-C5-2025-001")
  
  // Checklist
  checklist: ChecklistItemQC[];
  
  // Firma digital (requerida para aprobar)
  firma?: FirmaDigitalQC;
  
  // Metadatos
  fechaCreacion: Date;
  fechaInicio?: Date;
  fechaCierre?: Date;
  creadoPor: string;
  
  // Si hay rechazo, motivo y acción correctiva
  motivoRechazo?: string;
  accionCorrectiva?: string;
}

/**
 * Definición de checklist predefinido por tipo
 */
export interface PlantillaChecklistQC {
  tipo: TipoQualityGate;
  nombre: string;
  descripcion: string;
  items: Omit<ChecklistItemQC, 'verificado' | 'fechaVerificacion' | 'verificadoPor'>[];
}

/**
 * Log de actividad de QA
 */
export interface LogActividadQA {
  id: string;
  qualityGateId: string;
  accion: 'creado' | 'iniciado' | 'check_verificado' | 'firmado' | 'aprobado' | 'rechazado';
  usuarioId: string;
  usuarioNombre: string;
  fecha: Date;
  detalles?: string;
  checklistItemId?: string;
}

/**
 * KPIs de SLA para licitación
 */
export interface KPIsSLAC5 {
  // DOA (Dead On Arrival) - % de equipos defectuosos en entrega
  calidadEntregaDOA: {
    objetivo: number;     // < 0.5%
    actual: number;
    tendencia: 'mejora' | 'estable' | 'empeora';
    totalEntregas: number;
    entregasDefectuosas: number;
  };
  
  // Conformidad de pedidos - % pedidos sin incidencias
  conformidadPedidos: {
    objetivo: number;     // 100%
    actual: number;
    tendencia: 'mejora' | 'estable' | 'empeora';
    totalPedidos: number;
    pedidosConformes: number;
  };
  
  // Cumplimiento de plazo - % entregas en fecha
  cumplimientoPlazo: {
    objetivo: number;     // 100%
    actual: number;
    tendencia: 'mejora' | 'estable' | 'empeora';
    entregasEnPlazo: number;
    entregasFueraPlazo: number;
  };
  
  // Tiempo respuesta RMA
  tiempoRespuestaRMA: {
    objetivoHoras: number;  // < 48h
    actualHoras: number;
    tendencia: 'mejora' | 'estable' | 'empeora';
    rmasCerrados: number;
    tiempoMedioHoras: number;
  };
}

// ============================================
// CENTRAL DE COMPRAS - SOLICITUDES OPERADOR
// ============================================

/**
 * Tipo de solicitud del operador
 */
export type TipoSolicitudOperador = 'normal' | 'urgente' | 'incidencia';

/**
 * Motivo de la solicitud
 */
export type MotivoSolicitud = 
  | 'nueva_flota'      // Nuevos vehículos incorporados
  | 'sustitucion'      // Reemplazo de equipo dañado/obsoleto
  | 'ampliacion'       // Ampliación de equipamiento
  | 'incidencia';      // Por avería/vandalismo

/**
 * Estado de la solicitud del operador
 */
export type EstadoSolicitudOperador = 
  | 'borrador'           // Operador está preparando
  | 'enviada'            // Enviada a Central de Compras
  | 'aprobada'           // Central aprueba
  | 'rechazada'          // Central rechaza (con motivo)
  | 'asignada_pedido'    // Incluida en un pedido a proveedor
  | 'en_transito'        // Pedido proveedor enviado
  | 'entregada'          // Material recibido por operador
  | 'servida_stock';     // Servida desde stock urgencias (solo urgentes)

/**
 * Línea de solicitud del operador
 */
export interface LineaSolicitudOperador {
  id: string;
  productoId: string;
  sku: string;
  nombre: string;
  cantidadSolicitada: number;
  cantidadAprobada?: number;      // Puede ser menor si no hay stock
  cantidadEntregada: number;
  /** Vehículos destino (opcional) */
  vehiculosDestino?: {
    vehiculoId: string;
    calca: string;
    matricula: string;
    cantidad: number;
  }[];
}

/**
 * Solicitud de material de un operador
 * Es la petición individual antes de ser agregada en un pedido a proveedor
 */
export interface SolicitudOperador {
  id: string;
  codigo: string;                    // SOL-2025-0001
  
  // Operador solicitante
  operadorId: string;
  operadorNombre: string;
  
  // Tipo y prioridad
  tipo: TipoSolicitudOperador;
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  motivo: MotivoSolicitud;
  
  // Justificación (obligatoria para urgentes/incidencias)
  justificacion?: string;
  vehiculosAfectados?: string[];     // IDs de vehículos si es incidencia
  
  // Líneas solicitadas
  lineas: LineaSolicitudOperador[];
  
  // Estado y trazabilidad
  estado: EstadoSolicitudOperador;
  pedidoProveedorId?: string;        // Si fue asignada a pedido proveedor
  
  // Fechas
  fechaCreacion: Date;
  fechaEnvio?: Date;
  fechaAprobacion?: Date;
  fechaRechazo?: Date;
  motivoRechazo?: string;
  fechaEntrega?: Date;
  
  // Si es urgente, puede servirse desde stock
  servidaDesdeStock: boolean;
  
  // Auditoría
  creadoPor: string;
  aprobadoPor?: string;
  notas?: string;
}

// ============================================
// CENTRAL DE COMPRAS - PEDIDOS A PROVEEDOR
// ============================================

/**
 * Estado del pedido a proveedor (WINFIN)
 */
export type EstadoPedidoProveedor = 
  | 'borrador'              // En preparación
  | 'enviado_proveedor'     // Enviado a WINFIN
  | 'confirmado'            // WINFIN confirma recepción
  | 'en_fabricacion'        // En proceso de fabricación
  | 'enviado'               // WINFIN ha enviado
  | 'recibido_parcial'      // Recepción parcial en almacén
  | 'recibido'              // Todo recibido
  | 'distribuido';          // Material distribuido a operadores

/**
 * Línea de pedido a proveedor (agregación de solicitudes)
 */
export interface LineaPedidoProveedor {
  id: string;
  productoId: string;
  sku: string;
  nombre: string;
  
  // Cantidades
  cantidadTotal: number;
  cantidadRecibida: number;
  cantidadDistribuida: number;
  
  // Mínimo de fabricación del proveedor
  cantidadMinimaFabricacion: number;
  cumpleMinimoFabricacion: boolean;
  
  // Precio (si aplica)
  precioUnitario?: number;
  descuentoVolumen?: number;
  
  // Desglose por solicitud origen
  desgloseSolicitudes: {
    solicitudId: string;
    solicitudCodigo: string;
    operadorId: string;
    operadorNombre: string;
    cantidad: number;
  }[];
}

/**
 * Pedido agregado a proveedor (WINFIN)
 */
export interface PedidoProveedor {
  id: string;
  codigo: string;                    // PED-WINFIN-2025-001
  
  // Proveedor (siempre WINFIN)
  proveedorNombre: string;           // "WINFIN"
  
  // Solicitudes incluidas
  solicitudesIncluidas: string[];    // IDs de SolicitudOperador
  
  // Líneas consolidadas
  lineas: LineaPedidoProveedor[];
  
  // Análisis de agregación
  totalUnidades: number;
  cumpleMinimosFabricacion: boolean;
  ahorroEstimadoEscala?: number;     // % ahorro por volumen
  
  // Estado
  estado: EstadoPedidoProveedor;
  
  // Fechas
  fechaCreacion: Date;
  fechaEnvioProveedor?: Date;
  fechaConfirmacion?: Date;
  fechaEntregaEstimada?: Date;
  fechaRecepcion?: Date;
  fechaDistribucion?: Date;
  
  // Económico (opcional)
  importeTotal?: number;
  
  // Auditoría
  creadoPor: string;
  notas?: string;
}

// ============================================
// STOCK CENTRAL (CON BUFFER URGENCIAS)
// ============================================

/**
 * Nivel de alerta del stock
 */
export type NivelAlertaStock = 'ok' | 'bajo' | 'critico' | 'agotado';

/**
 * Stock central con separación de urgencias
 */
export interface StockCentralC5 {
  productoId: string;
  productoNombre: string;
  sku: string;
  
  // Stock disponible
  stockTotal: number;
  stockDisponible: number;           // Total - Reservado
  
  // Reservas
  stockReservadoSolicitudes: number; // Para solicitudes aprobadas
  stockReservadoUrgencias: number;   // Buffer fijo para emergencias
  
  // Configuración
  stockMinimoUrgencias: number;      // Mínimo a mantener para emergencias
  stockMinimoReposicion: number;     // Nivel para disparar reposición
  stockMaximoContrato: number;       // Límite contractual (200)
  
  // Alertas
  nivelAlerta: NivelAlertaStock;
  
  // Métricas
  diasStockEstimado?: number;        // Días que dura el stock actual
  consumoMedioDiario?: number;
}

// ============================================
// KPIs CENTRAL DE COMPRAS
// ============================================

export interface KPIsCentralCompras {
  // Solicitudes
  solicitudesPendientes: number;
  solicitudesUrgentes: number;
  solicitudesServidasStock: number;
  tiempoMedioAprobacionHoras: number;
  
  // Agregación
  pedidosProveedorActivos: number;
  porcentajeCumplimientoMinimos: number;
  ahorroAcumuladoEscala: number;
  
  // Stock urgencias
  productosConStockUrgenciaBajo: number;
  urgenciasServidasUltimos30Dias: number;
  urgenciasNoServidasPorStock: number;
  
  // Eficiencia
  tiempoMedioEntregaDias: number;
  solicitudesEntregadasEnPlazo: number;
}

// ============================================
// LLIURAMENTS A OPERADORS
// ============================================

export type EstadoLliurament = 
  | 'pendent'        // Pendiente de preparar
  | 'en_preparacio'  // En preparación (pick & pack)
  | 'preparat'       // Preparado para envío
  | 'en_transit'     // En tránsito
  | 'lliurat'        // Entregado
  | 'parcial';       // Entrega parcial

export type TipusLliurament =
  | 'normal'         // Entrega normal desde pedido proveedor
  | 'urgencia'       // Entrega urgente desde buffer
  | 'reposicio';     // Reposición por RMA/garantía

export interface LineaLliurament {
  id: string;
  productoId: string;
  productoSku: string;
  productoNombre: string;
  cantidadSolicitada: number;
  cantidadPreparada: number;
  cantidadEntregada: number;
  numerosSeriePreparados?: string[];
  numerosSerieEntregados?: string[];
  solicitudOrigenId?: string;
}

export interface Lliurament {
  id: string;
  codigo: string;  // Format: LLI-YYYY-NNNN
  operadorId: string;
  operadorNombre: string;
  operadorCodi: string;
  tipo: TipusLliurament;
  estado: EstadoLliurament;
  fechaCreacion: Date;
  fechaPreparacion?: Date;
  fechaEnvio?: Date;
  fechaEntrega?: Date;
  fechaEstimadaEntrega?: Date;
  pedidoProveedorId?: string;
  pedidoProveedorCodigo?: string;
  lineas: LineaLliurament[];
  direccionEntrega: string;
  contactoEntrega?: string;
  telefonoContacto?: string;
  observaciones?: string;
  albaranEntrega?: string;
  firmaRecepcion?: boolean;
}
