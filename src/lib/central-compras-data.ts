/**
 * Datos mock para la Central de Compras - Contrato C-5/2025
 * 
 * Flujo: Operadores crean solicitudes → Central agrupa → Pedido a WINFIN → Distribución
 */

import { sub, add } from 'date-fns';
import type {
  SolicitudOperador,
  PedidoProveedor,
  StockCentralC5,
  KPIsCentralCompras,
} from './contrato-c5-types';

const today = new Date();

// ============================================
// CONFIGURACIÓN PROVEEDOR WINFIN
// ============================================

export const WINFIN_CONFIG = {
  nombre: 'WINFIN',
  leadTimeDias: 45, // Tiempo medio de fabricación
  minimosProduccion: {
    'EP-001': 25,  // Antena Tribanda - mínimo 25 uds
    'EP-002': 20,  // Switch Ethernet - mínimo 20 uds
    'EP-003': 15,  // Kit Integral - mínimo 15 uds
  } as Record<string, number>,
  descuentosVolumen: [
    { desdeUnidades: 50, descuento: 5 },
    { desdeUnidades: 100, descuento: 10 },
    { desdeUnidades: 150, descuento: 15 },
  ],
};

// ============================================
// OPERADORES DEL CONTRATO C-5
// ============================================

// Subset de operadores de mockOperators (src/lib/data.ts) para las demos de C5
// Los IDs deben coincidir exactamente con los definidos en mockOperators
export const operadoresC5 = [
  { id: 'op-01', nombre: 'ALSINA GRAELLS DE AUTO TRANSPORTES, SA', codigo: 'ALG' },
  { id: 'op-02', nombre: 'AUTOCARES JULIÀ, SL', codigo: 'AJU' },
  { id: 'op-03', nombre: 'AUTOCARS DEL PENEDÈS, SA', codigo: 'ADP' },
  { id: 'op-04', nombre: 'AUTOCARS PRAT, SA', codigo: 'APR' },
  { id: 'op-10', nombre: 'HISPANO LLACUNENSE, SL', codigo: 'HLL' },
  { id: 'op-11', nombre: 'MONTFERRI HERMANOS, SL', codigo: 'MFH' },
  { id: 'op-13', nombre: 'TUS, SCCL', codigo: 'TUS' },
  { id: 'op-20', nombre: 'TUSGSAL', codigo: 'TUS' },
  { id: 'op-24', nombre: 'LA HISPANO IGUALADINA, SL', codigo: 'HIFE' },
  { id: 'op-41', nombre: 'TEISA', codigo: 'TEI' },
];

// ============================================
// SOLICITUDES DE OPERADORES (MOCK)
// ============================================

export const mockSolicitudesOperador: SolicitudOperador[] = [
  // Solicitud urgente - servida desde stock
  {
    id: 'sol-001',
    codigo: 'SOL-2025-0001',
    operadorId: 'op-01',
    operadorNombre: 'ALSINA GRAELLS DE AUTO TRANSPORTES, SA',
    tipo: 'urgente',
    prioridad: 'critica',
    motivo: 'incidencia',
    justificacion: 'Switch dañado por sobretensión en bus 300. Vehículo inoperativo.',
    vehiculosAfectados: ['VEH-ALSINAGR-300'],
    lineas: [
      {
        id: 'lin-001-1',
        productoId: 'EP-002',
        sku: 'EX43008-00-I-AA',
        nombre: 'Switch Ethernet Industrial',
        cantidadSolicitada: 1,
        cantidadAprobada: 1,
        cantidadEntregada: 1,
        vehiculosDestino: [{ vehiculoId: 'VEH-ALSINAGR-300', calca: '300', matricula: '6916-HCR', cantidad: 1 }],
      },
    ],
    estado: 'servida_stock',
    servidaDesdeStock: true,
    fechaCreacion: sub(today, { days: 5 }),
    fechaEnvio: sub(today, { days: 5 }),
    fechaAprobacion: sub(today, { days: 5 }),
    fechaEntrega: sub(today, { days: 4 }),
    creadoPor: 'Operador Alsina',
    aprobadoPor: 'G.S.S. (Jefe de Proyecto)',
    notas: 'Servido desde stock de urgencias. Tiempo respuesta: 24h.',
  },
  
  // Solicitud normal - pendiente de agregación
  {
    id: 'sol-002',
    codigo: 'SOL-2025-0002',
    operadorId: 'op-02',
    operadorNombre: 'AUTOCARES JULIA, SL',
    tipo: 'normal',
    prioridad: 'media',
    motivo: 'nueva_flota',
    justificacion: 'Incorporación de 5 nuevos vehículos a la flota en enero 2026.',
    lineas: [
      {
        id: 'lin-002-1',
        productoId: 'EP-001',
        sku: 'CA01-1524035M-X',
        nombre: 'Antena Tribanda',
        cantidadSolicitada: 5,
        cantidadEntregada: 0,
      },
      {
        id: 'lin-002-2',
        productoId: 'EP-002',
        sku: 'EX43008-00-I-AA',
        nombre: 'Switch Ethernet Industrial',
        cantidadSolicitada: 5,
        cantidadEntregada: 0,
      },
      {
        id: 'lin-002-3',
        productoId: 'EP-003',
        sku: 'KIT-INT-001',
        nombre: 'Kit Integral Preinstalación',
        cantidadSolicitada: 5,
        cantidadEntregada: 0,
      },
    ],
    estado: 'aprobada',
    servidaDesdeStock: false,
    fechaCreacion: sub(today, { days: 10 }),
    fechaEnvio: sub(today, { days: 10 }),
    fechaAprobacion: sub(today, { days: 8 }),
    creadoPor: 'Operador Julia',
    aprobadoPor: 'G.S.S. (Jefe de Proyecto)',
  },
  
  // Solicitud normal - pendiente de aprobación
  {
    id: 'sol-003',
    codigo: 'SOL-2025-0003',
    operadorId: 'op-03',
    operadorNombre: 'AUTOCARS DEL PENEDÈS, SA',
    tipo: 'normal',
    prioridad: 'media',
    motivo: 'nueva_flota',
    justificacion: 'Renovación parcial de flota - 8 vehículos nuevos.',
    lineas: [
      {
        id: 'lin-003-1',
        productoId: 'EP-001',
        sku: 'CA01-1524035M-X',
        nombre: 'Antena Tribanda',
        cantidadSolicitada: 8,
        cantidadEntregada: 0,
      },
      {
        id: 'lin-003-2',
        productoId: 'EP-002',
        sku: 'EX43008-00-I-AA',
        nombre: 'Switch Ethernet Industrial',
        cantidadSolicitada: 8,
        cantidadEntregada: 0,
      },
      {
        id: 'lin-003-3',
        productoId: 'EP-003',
        sku: 'KIT-INT-001',
        nombre: 'Kit Integral Preinstalación',
        cantidadSolicitada: 8,
        cantidadEntregada: 0,
      },
    ],
    estado: 'enviada',
    servidaDesdeStock: false,
    fechaCreacion: sub(today, { days: 3 }),
    fechaEnvio: sub(today, { days: 3 }),
    creadoPor: 'Operador Penedès',
  },
  
  // Solicitud aprobada - incluida en pedido proveedor
  {
    id: 'sol-004',
    codigo: 'SOL-2025-0004',
    operadorId: 'op-10',
    operadorNombre: 'HISPANO LLACUNENSE, SL',
    tipo: 'normal',
    prioridad: 'baja',
    motivo: 'ampliacion',
    justificacion: 'Equipamiento adicional para 3 vehículos sin T-movilidad.',
    lineas: [
      {
        id: 'lin-004-1',
        productoId: 'EP-001',
        sku: 'CA01-1524035M-X',
        nombre: 'Antena Tribanda',
        cantidadSolicitada: 3,
        cantidadAprobada: 3,
        cantidadEntregada: 0,
      },
      {
        id: 'lin-004-2',
        productoId: 'EP-002',
        sku: 'EX43008-00-I-AA',
        nombre: 'Switch Ethernet Industrial',
        cantidadSolicitada: 3,
        cantidadAprobada: 3,
        cantidadEntregada: 0,
      },
    ],
    estado: 'asignada_pedido',
    pedidoProveedorId: 'ped-prov-001',
    servidaDesdeStock: false,
    fechaCreacion: sub(today, { days: 20 }),
    fechaEnvio: sub(today, { days: 20 }),
    fechaAprobacion: sub(today, { days: 18 }),
    creadoPor: 'Operador Hispano',
    aprobadoPor: 'G.S.S. (Jefe de Proyecto)',
  },
  
  // Solicitud en tránsito
  {
    id: 'sol-005',
    codigo: 'SOL-2025-0005',
    operadorId: 'op-13',
    operadorNombre: 'TUS, SCCL',
    tipo: 'normal',
    prioridad: 'alta',
    motivo: 'nueva_flota',
    justificacion: 'Flota de 12 buses híbridos nuevos - entrega urgente Q1 2026.',
    lineas: [
      {
        id: 'lin-005-1',
        productoId: 'EP-001',
        sku: 'CA01-1524035M-X',
        nombre: 'Antena Tribanda',
        cantidadSolicitada: 12,
        cantidadAprobada: 12,
        cantidadEntregada: 0,
      },
      {
        id: 'lin-005-2',
        productoId: 'EP-002',
        sku: 'EX43008-00-I-AA',
        nombre: 'Switch Ethernet Industrial',
        cantidadSolicitada: 12,
        cantidadAprobada: 12,
        cantidadEntregada: 0,
      },
      {
        id: 'lin-005-3',
        productoId: 'EP-003',
        sku: 'KIT-INT-001',
        nombre: 'Kit Integral Preinstalación',
        cantidadSolicitada: 12,
        cantidadAprobada: 12,
        cantidadEntregada: 0,
      },
    ],
    estado: 'asignada_pedido',
    pedidoProveedorId: 'ped-prov-001',
    servidaDesdeStock: false,
    fechaCreacion: sub(today, { days: 25 }),
    fechaEnvio: sub(today, { days: 25 }),
    fechaAprobacion: sub(today, { days: 23 }),
    creadoPor: 'Operador TUS',
    aprobadoPor: 'G.S.S. (Jefe de Proyecto)',
  },
  
  // Solicitud urgente - pendiente
  {
    id: 'sol-006',
    codigo: 'SOL-2025-0006',
    operadorId: 'op-11',
    operadorNombre: 'MONTFERRI HERMANOS, SL',
    tipo: 'urgente',
    prioridad: 'alta',
    motivo: 'sustitucion',
    justificacion: 'Antena con pérdida de señal GPS. Afecta al tracking del vehículo.',
    vehiculosAfectados: ['VEH-MONTFERR-354'],
    lineas: [
      {
        id: 'lin-006-1',
        productoId: 'EP-001',
        sku: 'CA01-1524035M-X',
        nombre: 'Antena Tribanda',
        cantidadSolicitada: 1,
        cantidadEntregada: 0,
      },
    ],
    estado: 'enviada',
    servidaDesdeStock: false,
    fechaCreacion: sub(today, { hours: 6 }),
    fechaEnvio: sub(today, { hours: 6 }),
    creadoPor: 'Operador Montferri',
  },
  
  // Solicitud borrador
  {
    id: 'sol-007',
    codigo: 'SOL-2025-0007',
    operadorId: 'op-04',
    operadorNombre: 'AUTOCARS PRAT, SA',
    tipo: 'normal',
    prioridad: 'baja',
    motivo: 'nueva_flota',
    justificacion: '',
    lineas: [
      {
        id: 'lin-007-1',
        productoId: 'EP-003',
        sku: 'KIT-INT-001',
        nombre: 'Kit Integral Preinstalación',
        cantidadSolicitada: 2,
        cantidadEntregada: 0,
      },
    ],
    estado: 'borrador',
    servidaDesdeStock: false,
    fechaCreacion: sub(today, { days: 1 }),
    creadoPor: 'Operador Prat',
  },
];

// ============================================
// PEDIDOS A PROVEEDOR (WINFIN)
// ============================================

export const mockPedidosProveedor: PedidoProveedor[] = [
  {
    id: 'ped-prov-001',
    codigo: 'PED-WINFIN-2025-001',
    proveedorNombre: 'WINFIN',
    solicitudesIncluidas: ['sol-004', 'sol-005'],
    lineas: [
      {
        id: 'lpp-001-1',
        productoId: 'EP-001',
        sku: 'CA01-1524035M-X',
        nombre: 'Antena Tribanda',
        cantidadTotal: 15, // 3 + 12
        cantidadRecibida: 0,
        cantidadDistribuida: 0,
        cantidadMinimaFabricacion: 25,
        cumpleMinimoFabricacion: false, // 15 < 25
        desgloseSolicitudes: [
          { solicitudId: 'sol-004', solicitudCodigo: 'SOL-2025-0004', operadorId: 'op-10', operadorNombre: 'HISPANO LLACUNENSE, SL', cantidad: 3 },
          { solicitudId: 'sol-005', solicitudCodigo: 'SOL-2025-0005', operadorId: 'op-13', operadorNombre: 'TUS, SCCL', cantidad: 12 },
        ],
      },
      {
        id: 'lpp-001-2',
        productoId: 'EP-002',
        sku: 'EX43008-00-I-AA',
        nombre: 'Switch Ethernet Industrial',
        cantidadTotal: 15,
        cantidadRecibida: 0,
        cantidadDistribuida: 0,
        cantidadMinimaFabricacion: 20,
        cumpleMinimoFabricacion: false, // 15 < 20
        desgloseSolicitudes: [
          { solicitudId: 'sol-004', solicitudCodigo: 'SOL-2025-0004', operadorId: 'op-10', operadorNombre: 'HISPANO LLACUNENSE, SL', cantidad: 3 },
          { solicitudId: 'sol-005', solicitudCodigo: 'SOL-2025-0005', operadorId: 'op-13', operadorNombre: 'TUS, SCCL', cantidad: 12 },
        ],
      },
      {
        id: 'lpp-001-3',
        productoId: 'EP-003',
        sku: 'KIT-INT-001',
        nombre: 'Kit Integral Preinstalación',
        cantidadTotal: 12,
        cantidadRecibida: 0,
        cantidadDistribuida: 0,
        cantidadMinimaFabricacion: 15,
        cumpleMinimoFabricacion: false, // 12 < 15
        desgloseSolicitudes: [
          { solicitudId: 'sol-005', solicitudCodigo: 'SOL-2025-0005', operadorId: 'op-13', operadorNombre: 'TUS, SCCL', cantidad: 12 },
        ],
      },
    ],
    totalUnidades: 42,
    cumpleMinimosFabricacion: false,
    estado: 'borrador',
    fechaCreacion: sub(today, { days: 15 }),
    creadoPor: 'G.S.S. (Jefe de Proyecto)',
    notas: 'Pendiente de agregar más solicitudes para alcanzar mínimos de fabricación.',
  },
  
  // Pedido anterior ya entregado
  {
    id: 'ped-prov-002',
    codigo: 'PED-WINFIN-2024-003',
    proveedorNombre: 'WINFIN',
    solicitudesIncluidas: ['sol-hist-001', 'sol-hist-002', 'sol-hist-003'],
    lineas: [
      {
        id: 'lpp-002-1',
        productoId: 'EP-001',
        sku: 'CA01-1524035M-X',
        nombre: 'Antena Tribanda',
        cantidadTotal: 30,
        cantidadRecibida: 30,
        cantidadDistribuida: 30,
        cantidadMinimaFabricacion: 25,
        cumpleMinimoFabricacion: true,
        descuentoVolumen: 5, // 5% por superar 50 uds totales
        desgloseSolicitudes: [
          { solicitudId: 'sol-hist-001', solicitudCodigo: 'SOL-2024-0045', operadorId: 'op-01', operadorNombre: 'ALSINA GRAELLS DE AUTO TRANSPORTES, SA', cantidad: 10 },
          { solicitudId: 'sol-hist-002', solicitudCodigo: 'SOL-2024-0046', operadorId: 'op-02', operadorNombre: 'AUTOCARES JULIÀ, SL', cantidad: 8 },
          { solicitudId: 'sol-hist-003', solicitudCodigo: 'SOL-2024-0047', operadorId: 'op-13', operadorNombre: 'TUS, SCCL', cantidad: 12 },
        ],
      },
      {
        id: 'lpp-002-2',
        productoId: 'EP-002',
        sku: 'EX43008-00-I-AA',
        nombre: 'Switch Ethernet Industrial',
        cantidadTotal: 30,
        cantidadRecibida: 30,
        cantidadDistribuida: 30,
        cantidadMinimaFabricacion: 20,
        cumpleMinimoFabricacion: true,
        descuentoVolumen: 5,
        desgloseSolicitudes: [
          { solicitudId: 'sol-hist-001', solicitudCodigo: 'SOL-2024-0045', operadorId: 'op-01', operadorNombre: 'ALSINA GRAELLS DE AUTO TRANSPORTES, SA', cantidad: 10 },
          { solicitudId: 'sol-hist-002', solicitudCodigo: 'SOL-2024-0046', operadorId: 'op-02', operadorNombre: 'AUTOCARES JULIÀ, SL', cantidad: 8 },
          { solicitudId: 'sol-hist-003', solicitudCodigo: 'SOL-2024-0047', operadorId: 'op-13', operadorNombre: 'TUS, SCCL', cantidad: 12 },
        ],
      },
    ],
    totalUnidades: 60,
    cumpleMinimosFabricacion: true,
    ahorroEstimadoEscala: 5,
    estado: 'distribuido',
    fechaCreacion: sub(today, { months: 3 }),
    fechaEnvioProveedor: sub(today, { months: 3, days: -2 }),
    fechaConfirmacion: sub(today, { months: 3, days: -5 }),
    fechaEntregaEstimada: sub(today, { months: 2 }),
    fechaRecepcion: sub(today, { months: 2, days: 3 }),
    fechaDistribucion: sub(today, { months: 2, days: 10 }),
    importeTotal: 45600,
    creadoPor: 'G.S.S. (Jefe de Proyecto)',
  },
];

// ============================================
// STOCK CENTRAL CON URGENCIAS
// ============================================

export const mockStockCentral: StockCentralC5[] = [
  {
    productoId: 'EP-001',
    productoNombre: 'Antena Tribanda',
    sku: 'CA01-1524035M-X',
    stockTotal: 45,
    stockDisponible: 30,
    stockReservadoSolicitudes: 10,
    stockReservadoUrgencias: 5,
    stockMinimoUrgencias: 5,
    stockMinimoReposicion: 20,
    stockMaximoContrato: 200,
    nivelAlerta: 'ok',
    diasStockEstimado: 90,
    consumoMedioDiario: 0.5,
  },
  {
    productoId: 'EP-002',
    productoNombre: 'Switch Ethernet Industrial',
    sku: 'EX43008-00-I-AA',
    stockTotal: 38,
    stockDisponible: 28,
    stockReservadoSolicitudes: 5,
    stockReservadoUrgencias: 5,
    stockMinimoUrgencias: 5,
    stockMinimoReposicion: 15,
    stockMaximoContrato: 200,
    nivelAlerta: 'ok',
    diasStockEstimado: 112,
    consumoMedioDiario: 0.34,
  },
  {
    productoId: 'EP-003',
    productoNombre: 'Kit Integral Preinstalación',
    sku: 'KIT-INT-001',
    stockTotal: 25,
    stockDisponible: 12,
    stockReservadoSolicitudes: 8,
    stockReservadoUrgencias: 5,
    stockMinimoUrgencias: 5,
    stockMinimoReposicion: 10,
    stockMaximoContrato: 200,
    nivelAlerta: 'bajo',
    diasStockEstimado: 48,
    consumoMedioDiario: 0.52,
  },
];

// ============================================
// KPIs CENTRAL DE COMPRAS
// ============================================

export const mockKPIsCentralCompras: KPIsCentralCompras = {
  // Solicitudes
  solicitudesPendientes: 3,
  solicitudesUrgentes: 1,
  solicitudesServidasStock: 8,
  tiempoMedioAprobacionHoras: 18,
  
  // Agregación
  pedidosProveedorActivos: 1,
  porcentajeCumplimientoMinimos: 67,
  ahorroAcumuladoEscala: 12450,
  
  // Stock urgencias
  productosConStockUrgenciaBajo: 0,
  urgenciasServidasUltimos30Dias: 3,
  urgenciasNoServidasPorStock: 0,
  
  // Eficiencia
  tiempoMedioEntregaDias: 52,
  solicitudesEntregadasEnPlazo: 94,
};

// ============================================
// HELPERS
// ============================================

/**
 * Calcula si un conjunto de solicitudes cumple mínimos de fabricación
 */
export function calcularCumplimientoMinimos(
  lineas: { productoId: string; cantidad: number }[]
): { cumple: boolean; detalle: { productoId: string; cantidad: number; minimo: number; cumple: boolean }[] } {
  const agregado: Record<string, number> = {};
  
  lineas.forEach(l => {
    agregado[l.productoId] = (agregado[l.productoId] || 0) + l.cantidad;
  });
  
  const detalle = Object.entries(agregado).map(([productoId, cantidad]) => {
    const minimo = WINFIN_CONFIG.minimosProduccion[productoId] || 0;
    return {
      productoId,
      cantidad,
      minimo,
      cumple: cantidad >= minimo,
    };
  });
  
  return {
    cumple: detalle.every(d => d.cumple),
    detalle,
  };
}

/**
 * Calcula descuento por volumen
 */
export function calcularDescuentoVolumen(totalUnidades: number): number {
  const descuento = WINFIN_CONFIG.descuentosVolumen
    .filter(d => totalUnidades >= d.desdeUnidades)
    .sort((a, b) => b.desdeUnidades - a.desdeUnidades)[0];
  
  return descuento?.descuento || 0;
}

/**
 * Genera código de solicitud
 */
export function generarCodigoSolicitud(): string {
  const year = new Date().getFullYear();
  const num = String(mockSolicitudesOperador.length + 1).padStart(4, '0');
  return `SOL-${year}-${num}`;
}

/**
 * Genera código de pedido proveedor
 */
export function generarCodigoPedidoProveedor(): string {
  const year = new Date().getFullYear();
  const num = String(mockPedidosProveedor.length + 1).padStart(3, '0');
  return `PED-WINFIN-${year}-${num}`;
}

/**
 * Genera código de lliurament
 */
export function generarCodigoLliurament(): string {
  const year = new Date().getFullYear();
  const num = String(mockLliuraments.length + 1).padStart(4, '0');
  return `LLI-${year}-${num}`;
}

// ============================================
// LLIURAMENTS A OPERADORS (Mock Data)
// ============================================

import type { Lliurament } from './contrato-c5-types';

export const mockLliuraments: Lliurament[] = [
  {
    id: 'lli-001',
    codigo: 'LLI-2025-0001',
    operadorId: 'op-01',
    operadorNombre: 'ALSINA GRAELLS DE AUTO TRANSPORTES, SA',
    operadorCodi: 'ALG',
    tipo: 'normal',
    estado: 'lliurat',
    fechaCreacion: new Date('2025-10-15'),
    fechaPreparacion: new Date('2025-10-16'),
    fechaEnvio: new Date('2025-10-17'),
    fechaEntrega: new Date('2025-10-18'),
    pedidoProveedorId: 'ped-winfin-001',
    pedidoProveedorCodigo: 'PED-WINFIN-2025-001',
    lineas: [
      {
        id: 'lli-001-l1',
        productoId: 'ant-001',
        productoSku: 'ANT-TRI-5G',
        productoNombre: 'Antena Tribanda 5G',
        cantidadSolicitada: 12,
        cantidadPreparada: 12,
        cantidadEntregada: 12,
        numerosSerieEntregados: ['ANT-2025-001', 'ANT-2025-002', 'ANT-2025-003'],
      },
      {
        id: 'lli-001-l2',
        productoId: 'swt-001',
        productoSku: 'SWT-ETH-8P',
        productoNombre: 'Switch Ethernet 8 Ports',
        cantidadSolicitada: 8,
        cantidadPreparada: 8,
        cantidadEntregada: 8,
      },
    ],
    direccionEntrega: 'Base Operativa Alsina Graells, C/ Motors 42, 08040 Barcelona',
    contactoEntrega: 'Joan Martínez',
    telefonoContacto: '934 123 456',
    albaranEntrega: 'ALB-2025-0015',
    firmaRecepcion: true,
  },
  {
    id: 'lli-002',
    codigo: 'LLI-2025-0002',
    operadorId: 'op-02',
    operadorNombre: 'AUTOCARES JULIÀ, SL',
    operadorCodi: 'AJU',
    tipo: 'urgencia',
    estado: 'lliurat',
    fechaCreacion: new Date('2025-11-05'),
    fechaPreparacion: new Date('2025-11-05'),
    fechaEnvio: new Date('2025-11-06'),
    fechaEntrega: new Date('2025-11-06'),
    lineas: [
      {
        id: 'lli-002-l1',
        productoId: 'ant-001',
        productoSku: 'ANT-TRI-5G',
        productoNombre: 'Antena Tribanda 5G',
        cantidadSolicitada: 3,
        cantidadPreparada: 3,
        cantidadEntregada: 3,
        numerosSerieEntregados: ['ANT-2025-045', 'ANT-2025-046', 'ANT-2025-047'],
        solicitudOrigenId: 'sol-004',
      },
    ],
    direccionEntrega: 'Base Operativa Julià, C/ Indústria 45, 08740 Sant Andreu de la Barca',
    contactoEntrega: 'Pere Soler',
    telefonoContacto: '936 789 012',
    observaciones: 'Lliurament urgent des de buffer',
    albaranEntrega: 'ALB-2025-0022',
    firmaRecepcion: true,
  },
  {
    id: 'lli-003',
    codigo: 'LLI-2025-0003',
    operadorId: 'op-20',
    operadorNombre: 'TUSGSAL',
    operadorCodi: 'TUS',
    tipo: 'normal',
    estado: 'en_transit',
    fechaCreacion: new Date('2025-12-01'),
    fechaPreparacion: new Date('2025-12-02'),
    fechaEnvio: new Date('2025-12-05'),
    fechaEstimadaEntrega: new Date('2025-12-09'),
    pedidoProveedorId: 'ped-winfin-002',
    pedidoProveedorCodigo: 'PED-WINFIN-2025-002',
    lineas: [
      {
        id: 'lli-003-l1',
        productoId: 'kit-001',
        productoSku: 'KIT-INT-BUS',
        productoNombre: 'Kit Integral Bus',
        cantidadSolicitada: 10,
        cantidadPreparada: 10,
        cantidadEntregada: 0,
      },
    ],
    direccionEntrega: 'Cotxeres TUSGSAL, Av. Martí Pujol 123, 08913 Badalona',
    contactoEntrega: 'Anna García',
    telefonoContacto: '933 456 789',
  },
  {
    id: 'lli-004',
    codigo: 'LLI-2025-0004',
    operadorId: 'op-03',
    operadorNombre: 'AUTOCARS DEL PENEDÈS, SA',
    operadorCodi: 'ADP',
    tipo: 'normal',
    estado: 'preparat',
    fechaCreacion: new Date('2025-12-03'),
    fechaPreparacion: new Date('2025-12-06'),
    fechaEstimadaEntrega: new Date('2025-12-12'),
    pedidoProveedorId: 'ped-winfin-002',
    pedidoProveedorCodigo: 'PED-WINFIN-2025-002',
    lineas: [
      {
        id: 'lli-004-l1',
        productoId: 'swt-001',
        productoSku: 'SWT-ETH-8P',
        productoNombre: 'Switch Ethernet 8 Ports',
        cantidadSolicitada: 15,
        cantidadPreparada: 15,
        cantidadEntregada: 0,
      },
      {
        id: 'lli-004-l2',
        productoId: 'ant-001',
        productoSku: 'ANT-TRI-5G',
        productoNombre: 'Antena Tribanda 5G',
        cantidadSolicitada: 10,
        cantidadPreparada: 10,
        cantidadEntregada: 0,
      },
    ],
    direccionEntrega: 'Base Autocars del Penedès, C/ Migdia 8, 08720 Vilafranca del Penedès',
    contactoEntrega: 'Marta Puig',
    telefonoContacto: '938 901 234',
  },
  {
    id: 'lli-005',
    codigo: 'LLI-2025-0005',
    operadorId: 'op-24',
    operadorNombre: 'LA HISPANO IGUALADINA, SL',
    operadorCodi: 'HIFE',
    tipo: 'normal',
    estado: 'en_preparacio',
    fechaCreacion: new Date('2025-12-06'),
    fechaEstimadaEntrega: new Date('2025-12-15'),
    pedidoProveedorId: 'ped-winfin-002',
    pedidoProveedorCodigo: 'PED-WINFIN-2025-002',
    lineas: [
      {
        id: 'lli-005-l1',
        productoId: 'ant-001',
        productoSku: 'ANT-TRI-5G',
        productoNombre: 'Antena Tribanda 5G',
        cantidadSolicitada: 20,
        cantidadPreparada: 8,
        cantidadEntregada: 0,
      },
    ],
    direccionEntrega: 'Estació HIFE, C/ Pau Casals 10, 08700 Igualada',
    contactoEntrega: 'Jordi Roca',
    telefonoContacto: '938 012 345',
    observaciones: 'Preparació en curs - 8 de 20 unitats preparades',
  },
  {
    id: 'lli-006',
    codigo: 'LLI-2025-0006',
    operadorId: 'op-13',
    operadorNombre: 'TUS, SCCL',
    operadorCodi: 'TUS',
    tipo: 'normal',
    estado: 'pendent',
    fechaCreacion: new Date('2025-12-07'),
    fechaEstimadaEntrega: new Date('2025-12-20'),
    lineas: [
      {
        id: 'lli-006-l1',
        productoId: 'kit-001',
        productoSku: 'KIT-INT-BUS',
        productoNombre: 'Kit Integral Bus',
        cantidadSolicitada: 25,
        cantidadPreparada: 0,
        cantidadEntregada: 0,
        solicitudOrigenId: 'sol-001',
      },
    ],
    direccionEntrega: 'Base TUS, C/ Sant Antoni 15, 08202 Sabadell',
    contactoEntrega: 'Carles Vidal',
    telefonoContacto: '934 234 567',
    observaciones: 'Pendent de recepció de material de WINFIN',
  },
];
