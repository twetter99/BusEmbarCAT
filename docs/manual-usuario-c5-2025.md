# Manual de Usuario - Módulo Contrato C-5/2025

## Sistema BusEmbarCAT - Gestión de Equipamiento de Comunicaciones para Autobuses

---

## Índice

1. [Introducción](#1-introducción)
2. [Estructura del Módulo](#2-estructura-del-módulo)
3. [Dashboard Principal C-5](#3-dashboard-principal-c-5)
4. [Módulo de Sol·licituds d'Operador](#4-módulo-de-solicituds-doperador)
5. [Central de Compres](#5-central-de-compres)
6. [Comandes WINFIN](#6-comandes-winfin)
7. [Estoc Central](#7-estoc-central)
8. [Lliuraments a Operadors](#8-lliuraments-a-operadors)
9. [Inventari i Traçabilitat](#9-inventari-i-traçabilitat)
10. [Sèries i Lots](#10-sèries-i-lots)
11. [Moviments](#11-moviments)
12. [Logística i Pick&Pack](#12-logística-i-pickpack)
13. [Recambi i Mínims](#13-recambi-i-mínims)
14. [Garanties i RMA](#14-garanties-i-rma)
15. [Informes i KPIs](#15-informes-i-kpis)
16. [Glosario de Estados](#16-glosario-de-estados)

---

## 1. Introducción

### 1.1 Propósito del Módulo

El módulo **Contrato C-5/2025** de BusEmbarCAT está diseñado para gestionar de forma integral el ciclo de vida completo del equipamiento de comunicaciones para autobuses:

- **Antenas Tribanda** (GPS + 4G/LTE + WiFi)
- **Switches Ethernet PoE** vehiculares
- **Kits Integrales** de conectividad

### 1.2 Usuarios del Sistema

| Rol | Permisos | Descripción |
|-----|----------|-------------|
| **Administrador** | Acceso completo | Gestión total del sistema |
| **Sermetra** | Gestión central | Compras, stock, logística y garantías |
| **Operador** | Lectura + solicitudes | Consulta de inventario y creación de solicitudes |

### 1.3 Flujo General del Sistema

```
OPERADOR                     SERMETRA                      PROVEEDOR (WINFIN)
    │                            │                              │
    ├─ Crea Solicitud ──────────▶│                              │
    │                            ├─ Aprueba/Rechaza             │
    │                            │                              │
    │                            ├─ Agrupa en Pedido ──────────▶│
    │                            │                              │
    │                            │◀───────── Envía Material ────┤
    │                            │                              │
    │◀─── Recibe Lliurament ────┤                              │
    │                            │                              │
    ├─ Instala en Vehículo       │                              │
    │                            │                              │
    ├─ Reporta Incidencia ──────▶│                              │
    │                            ├─ Gestiona Garantía/RMA ─────▶│
```

---

## 2. Estructura del Módulo

### 2.1 Menú de Navegación

El módulo C-5/2025 se accede desde el menú lateral principal bajo **"Contracte C-5/2025"** y contiene los siguientes submenús:

| Menú | Icono | Descripción |
|------|-------|-------------|
| Dashboard C-5 | 📊 | Panel principal con KPIs y alertas |
| Sol·licituds Operador | 📋 | Peticiones de material de operadores |
| Central de Compres | 🏢 | Gestión centralizada de aprovisionamiento |
| Comandes WINFIN | 🚚 | Pedidos al proveedor WINFIN |
| Estoc Central | 📦 | Niveles de stock en almacén Sermetra |
| Lliuraments a Operadors | 📦✓ | Entregas programadas a operadores |
| Inventari i Traçabilitat | 📦 | Catálogo de productos y stock |
| Sèries i Lots | 🔖 | Seguimiento por número de serie |
| Moviments | 📜 | Historial de movimientos de stock |
| Logística i Pick&Pack | 🚛 | Preparación y envío de pedidos |
| Recambi i Mínims | 🔧 | Gestión de stock de recambio |
| Garanties i RMA | 🛡️ | Garantías y reparaciones |
| Informes i KPIs | 📈 | Reportes y métricas de rendimiento |

---

## 3. Dashboard Principal C-5

### 3.1 Vista General

El Dashboard C-5 proporciona una visión ejecutiva del estado del contrato con los siguientes indicadores clave:

### 3.2 KPIs Principales

| Indicador | Descripción | Umbral de Alerta |
|-----------|-------------|------------------|
| **Equipos en Estoc** | Cantidad total de equipos principales en almacén | Barra de capacidad |
| **Kits Fabricables** | Número de kits completos que se pueden ensamblar | Indica componente limitante |
| **Comandes Actives** | Pedidos pendientes de entrega | - |
| **Reparacions Obertes** | Equipos en proceso de reparación | Alerta si hay riesgo SLA |

### 3.3 Panel de Alertas

El dashboard muestra alertas automáticas para:

- 🔴 **Stock bajo**: Productos por debajo del mínimo
- 🟡 **SLA en riesgo**: Reparaciones próximas a vencer
- 🟠 **Garantías próximas**: Equipos con garantía a punto de expirar

### 3.4 Estadísticas de Central de Compras

| Métrica | Descripción |
|---------|-------------|
| Solicitudes pendientes | Awaiting approval |
| Solicitudes aprobadas | Ready for ordering |
| Pedidos proveedor activos | En curso con WINFIN |
| Stock con alertas | Productos con nivel crítico |

---

## 4. Módulo de Sol·licituds d'Operador

### 4.1 Descripción

Los operadores de autobuses utilizan este módulo para solicitar equipamiento nuevo o de reposición.

### 4.2 Pantalla Principal

**Elementos de la pantalla:**

- **Barra de búsqueda**: Filtrar por número de solicitud, operador o producto
- **Filtros**: Por estado y operador
- **Tabla de solicitudes**: Lista todas las peticiones con su estado actual
- **Botón "Nova Sol·licitud"**: Crear nueva petición

### 4.3 Estados de una Solicitud

| Estado | Badge | Descripción |
|--------|-------|-------------|
| **Esborrany** | 📝 Gris | Borrador sin enviar |
| **Pendent Aprovació** | ⏳ Ámbar | Enviada, esperando aprobación de Sermetra |
| **Aprovada** | ✅ Verde | Aprobada, pendiente de asignar a pedido |
| **Rebutjada** | ❌ Rojo | Rechazada con motivo |
| **En Comanda** | 📦 Púrpura | Incluida en pedido a WINFIN |
| **En Trànsit** | 🚚 Ámbar | Material en camino |
| **Entregada** | ✓ Esmeralda | Material recibido por operador |
| **Servida (Stock)** | ⚡ Verde azulado | Servida desde stock de urgencias |

### 4.4 Tipos de Solicitud

| Tipo | Descripción | Color |
|------|-------------|-------|
| **nova_instal·lació** | Equipamiento para vehículos nuevos | Verde |
| **ampliació** | Equipos adicionales para flota existente | Azul |
| **substitució** | Reemplazo de equipos dañados/obsoletos | Ámbar |
| **reparació** | Material para reparación | Rojo |

### 4.5 Crear Nueva Solicitud

1. Clic en **"Nova Sol·licitud"**
2. Se abre formulario lateral (Sheet)
3. Completar campos:
   - **Tipus**: Seleccionar tipo de solicitud
   - **Prioritat**: Baixa / Normal / Alta
   - **Productes**: Agregar líneas con producto y cantidad
   - **Notes**: Observaciones adicionales
4. Clic en **"Desar Esborrany"** o **"Enviar Sol·licitud"**

### 4.6 Ver Detalle de Solicitud

Al hacer clic en el icono de **ojo** (👁️) se abre un modal centrado con:

- **Encabezado**: Código, estado y fecha
- **Información del operador**: Nombre y código
- **Líneas del pedido**: Productos, cantidades y estados
- **Histórico**: Cambios de estado con fecha y usuario
- **Acciones**: Según permisos (aprobar, rechazar, etc.)

---

## 5. Central de Compres

### 5.1 Descripción

Módulo exclusivo para Sermetra donde se gestionan las solicitudes aprobadas y se agrupan en pedidos al proveedor.

### 5.2 Funcionalidades Principales

1. **Vista de solicitudes aprobadas**: Lista de peticiones listas para procesar
2. **Selección múltiple**: Checkbox para agrupar solicitudes
3. **Generar pedido WINFIN**: Crear orden de compra consolidada
4. **Servir desde stock**: Atender urgencias con stock disponible

### 5.3 Workflow de Central de Compras

```
Solicitudes Aprobadas
        │
        ├─────────────────────────────┐
        ▼                             ▼
  [Agrupar en Pedido]          [Servir Stock Urgencias]
        │                             │
        ▼                             ▼
  Genera Pedido WINFIN        Actualiza Stock
        │                             │
        ▼                             ▼
  Estado: asignada_pedido     Estado: servida_stock
```

### 5.4 KPIs del Módulo

- **Pedidos en borrador**: Pendientes de enviar a WINFIN
- **Solicitudes pendientes**: Aprobadas sin asignar
- **Descuento por volumen**: Aplicable según cantidad total

---

## 6. Comandes WINFIN

### 6.1 Descripción

Gestión de los pedidos realizados al proveedor WINFIN Electronics (fabricante del equipamiento).

### 6.2 Estados del Pedido

| Estado | Step | Descripción |
|--------|------|-------------|
| **Esborrany** | 0 | Pedido creado, no enviado |
| **Enviat** | 1 | Enviado a WINFIN |
| **Confirmat** | 2 | WINFIN confirma recepción |
| **En Fabricació** | 3 | Material en producción |
| **En Trànsit** | 4 | Enviado desde WINFIN |
| **Recepció Parcial** | 5 | Recibido parcialmente |
| **Rebut** | 6 | Recibido completamente |
| **Distribuït** | 7 | Distribuido a operadores |

### 6.3 Elementos del Detalle

- **Timeline visual**: Progreso del pedido con iconos
- **Líneas del pedido**: Productos, cantidades, precios
- **Fechas clave**: Pedido, confirmación, envío estimado, recepción
- **Trazabilidad**: Vínculo a solicitudes origen

### 6.4 Acciones Disponibles

| Acción | Condición | Descripción |
|--------|-----------|-------------|
| Enviar a WINFIN | Estado = borrador | Transmitir pedido |
| Registrar Recepción | Estado = en_transito | Confirmar llegada |
| Registrar Parcial | Si falta material | Anotar faltantes |

---

## 7. Estoc Central

### 7.1 Descripción

Panel de control del inventario en almacén Sermetra con gestión de buffer para urgencias.

### 7.2 KPIs del Stock

| Indicador | Descripción |
|-----------|-------------|
| **Stock Total** | Unidades totales en almacén |
| **Disponible** | Stock libre (no reservado) |
| **Reservat Urgències** | Buffer para situaciones críticas |
| **Productes en Alerta** | Con nivel bajo o crítico |

### 7.3 Niveles de Alerta

| Nivel | Color | Descripción |
|-------|-------|-------------|
| **OK** | 🟢 Verde | Stock sobre mínimo |
| **Baix** | 🟡 Ámbar | Bajo mínimo, requiere reposición |
| **Crític** | 🔴 Rojo | Stock crítico, urgente |
| **Esgotat** | ⚫ Rojo oscuro | Sin stock |

### 7.4 Información por Producto

- SKU y nombre del producto
- Stock actual vs. mínimo
- Stock reservado para urgencias
- Última fecha de movimiento
- Tendencia de consumo

---

## 8. Lliuraments a Operadors

### 8.1 Descripción

Gestión de las entregas de material desde almacén central a los operadores de autobuses.

### 8.2 Estados de Entrega

| Estado | Icono | Descripción |
|--------|-------|-------------|
| **Pendent** | ⏳ | Pendiente de preparar |
| **En preparació** | 📦 | En proceso de picking |
| **Preparat** | ✓📦 | Listo para enviar |
| **En trànsit** | 🚚 | En ruta al operador |
| **Lliurat** | ✅ | Entregado correctamente |
| **Parcial** | ⚠️ | Entrega incompleta |

### 8.3 Tipos de Entrega

| Tipo | Color | Prioridad |
|------|-------|-----------|
| **Normal** | Azul | Estándar |
| **Urgència** | Rojo | Alta prioridad |
| **Reposició** | Púrpura | Reemplazo garantía |

### 8.4 Detalle de Entrega

El modal de detalle muestra:

- **Datos del operador**: Nombre, código, contacto, dirección
- **Líneas de entrega**: Productos, cantidades, series asignadas
- **Tracking**: Número de seguimiento del transportista
- **Fechas**: Creación, preparación, envío, entrega prevista

---

## 9. Inventari i Traçabilitat

### 9.1 Descripción

Catálogo completo de productos con información de stock y composición de kits.

### 9.2 Pestañas del Módulo

| Pestaña | Contenido |
|---------|-----------|
| **Equipos** | Productos principales (antenas, switches, kits) |
| **Components** | Componentes individuales del kit integral |
| **Moviments** | Historial reciente de movimientos |

### 9.3 Información de Equipos Principales

| Campo | Descripción |
|-------|-------------|
| SKU | Código único del producto |
| Nombre | Descripción del producto |
| Stock Actual | Unidades en almacén |
| Stock Reservado | Unidades comprometidas |
| Stock Mínimo | Umbral de reposición |
| Disponible | Actual - Reservado |

### 9.4 Composición del Kit Integral

El sistema muestra la estructura de componentes necesarios para ensamblar un Kit Integral:

- Placa de conexiones Harting
- Conectores Harting macho/hembra
- Cableado específico
- Tornillería y herrajes
- Caja estanca

### 9.5 Cálculo de Kits Fabricables

El sistema calcula automáticamente cuántos kits completos se pueden ensamblar basándose en:

```
Kits Fabricables = MIN(stock_componente_i / cantidad_requerida_i)
```

Se indica qué componente es el limitante.

---

## 10. Sèries i Lots

### 10.1 Descripción

Seguimiento individual de cada unidad por su número de serie único.

### 10.2 Información de Serie

| Campo | Descripción |
|-------|-------------|
| **Número de Serie** | Identificador único del fabricante |
| **Producto** | Tipo de equipo |
| **Estado** | Disponible, instalado, reparación, etc. |
| **Ubicación** | Almacén, operador, vehículo |
| **Fecha entrada** | Alta en sistema |
| **Garantía hasta** | Fecha fin de garantía |

### 10.3 Estados de Serie

| Estado | Descripción |
|--------|-------------|
| **Disponible** | En stock, listo para usar |
| **Reservat** | Asignado a un pedido |
| **Instal·lat** | Montado en un vehículo |
| **En Garantia** | Enviado a WINFIN por garantía |
| **En Reparació** | En taller Sermetra |
| **Baixa** | Dado de baja (irreparable) |

### 10.4 Ubicaciones

| Ubicación | Código |
|-----------|--------|
| Magatzem Sermetra | almacen_sermetra |
| Operador | operador |
| Vehicle | vehiculo |
| Proveïdor | proveedor |
| Baixa | baja |

### 10.5 Historial de Movimientos

Cada serie tiene un historial completo de:
- Entradas y salidas
- Reservas y liberaciones
- Instalaciones y desinstalaciones
- Envíos a garantía/reparación
- Cambios de ubicación

---

## 11. Moviments

### 11.1 Descripción

Registro completo de todos los movimientos de stock con filtros avanzados.

### 11.2 Tipos de Movimiento

| Tipo | Color | Descripción |
|------|-------|-------------|
| **Entrada** | Verde | Ingreso de material (de proveedor) |
| **Reserva** | Azul | Asignación a pedido |
| **Alliberament Reserva** | Cyan | Cancelación de reserva |
| **Instal·lació** | Púrpura | Montaje en vehículo |
| **Desinstal·lació** | Naranja | Desmontaje de vehículo |
| **Garantia (Sortida)** | Rojo | Envío a WINFIN por garantía |
| **Garantia (Entrada)** | Verde azulado | Retorno de garantía |
| **Reparació (Sortida)** | Ámbar | Envío a taller |
| **Reparació (Entrada)** | Lima | Retorno de reparación |
| **Baixa** | Gris | Baja definitiva |

### 11.3 Filtros Disponibles

- **Búsqueda**: Por número de serie o referencia
- **Producto**: Tipo de equipo
- **Tipo de movimiento**: Multiselección
- **Operador**: Operador involucrado
- **Rango de fechas**: Desde / Hasta

### 11.4 Exportación

Los movimientos se pueden exportar a:
- CSV
- Excel
- PDF

---

## 12. Logística i Pick&Pack

### 12.1 Descripción

Gestión operativa de la preparación y envío de pedidos a operadores.

### 12.2 Estados del Envío

| Estado | Descripción |
|--------|-------------|
| **Pendent Preparació** | En cola de picking |
| **En Preparació** | Picking en curso |
| **Preparat** | Listo, pendiente de transporte |
| **En Trànsit** | Con el transportista |
| **Lliurat** | Entregado al destino |
| **Lliurament Parcial** | Faltan unidades |
| **Incidència** | Problema reportado |

### 12.3 Proceso de Pick&Pack

1. **Recibir orden** de entrega desde Central de Compras
2. **Preparar picking list** con ubicaciones en almacén
3. **Escanear series** de los productos
4. **Verificar cantidades**
5. **Embalar** y generar etiqueta
6. **Entregar a transportista**
7. **Registrar tracking number**

### 12.4 Gestión de Incidencias

Tipos de incidencia registrables:

| Tipo | Descripción |
|------|-------------|
| **Falten Unitats** | Cantidad recibida menor que enviada |
| **Danys Transport** | Material dañado en transporte |
| **Producte Incorrecte** | Producto equivocado |
| **Adreça Incorrecta** | Dirección de entrega errónea |
| **Rebuig Client** | Operador rechaza la entrega |
| **Altre** | Otros motivos |

---

## 13. Recambi i Mínims

### 13.1 Descripción

Gestión del stock de recambio para garantizar disponibilidad en reparaciones.

### 13.2 Conceptos Clave

| Concepto | Descripción |
|----------|-------------|
| **Stock Recambi** | Unidades reservadas exclusivamente para reparaciones |
| **Stock Mínim Recambi** | Umbral mínimo de recambio |
| **Unitats Marcades** | Series específicas marcadas como recambio |

### 13.3 Niveles de Alerta

| Nivel | Porcentaje | Color |
|-------|------------|-------|
| **OK** | ≥100% | Verde |
| **Bajo** | 50-99% | Ámbar |
| **Crítico** | <50% | Rojo |

### 13.4 Acciones del Módulo

| Acción | Descripción |
|--------|-------------|
| **Ajustar mínimo** | Modificar el stock mínimo de recambio |
| **Marcar como recambio** | Asignar series al pool de recambio |
| **Liberar recambio** | Quitar marca de recambio a una serie |

---

## 14. Garanties i RMA

### 14.1 Descripción

Módulo integral para la gestión de garantías de fabricante y reparaciones internas (RMA - Return Merchandise Authorization).

### 14.2 Pestañas del Módulo

| Pestaña | Contenido |
|---------|-----------|
| **Reparacions** | Equipos en proceso de reparación |
| **Garanties Actives** | Equipos bajo cobertura de garantía |
| **Catàleg de Fallos** | Lista de fallos conocidos por producto |

### 14.3 Estados de Reparación

| Estado | Descripción |
|--------|-------------|
| **Pendent** | Abierta, sin asignar |
| **Diagnòstic** | En proceso de diagnóstico |
| **Esperant Recanvi** | Requiere pieza de recambio |
| **En Reparació** | En taller, reparando |
| **Prova** | En pruebas post-reparación |
| **Tancada** | Reparación finalizada |

### 14.4 SLA de Reparación

El contrato establece plazos máximos según tipo de incidencia:

| Tipo | SLA (días) |
|------|------------|
| Avería | 10 |
| Vandalismo | 15 |
| Desgaste | 15 |
| Otros | 10 |

### 14.5 Indicadores de SLA

| Indicador | Significado |
|-----------|-------------|
| 🟢 Dentro de SLA | Tiempo restante > 20% |
| 🟡 En riesgo | Tiempo restante ≤ 20% |
| 🔴 Fuera de SLA | Plazo vencido |

### 14.6 Catálogo de Fallos

El sistema incluye un catálogo predefinido de fallos comunes:

**Antena Tribanda (ANT-F0X):**
- Pérdida señal GPS
- Pérdida señal 4G/LTE
- Pérdida señal WiFi
- Daño físico antena

**Switch Ethernet (SWT-F0X):**
- Puerto Ethernet dañado
- No enciende / No alimenta
- Daño físico carcasa

**Kit Integral (KIT-F0X):**
- Fallo conector Harting
- Cortocircuito placa
- Cable roto

### 14.7 Crear Nueva Reparación

1. Clic en **"Nova Reparació"**
2. Seleccionar:
   - **Operador** afectado
   - **Producto** tipo de equipo
   - **Número de serie**
   - **Fallo** del catálogo o descripción manual
3. Adjuntar **fotografías** (opcional)
4. **Guardar**

### 14.8 Garantías Activas

Vista de todos los equipos bajo garantía del fabricante:

| Campo | Descripción |
|-------|-------------|
| Serie | Número de serie |
| Producto | Tipo de equipo |
| Fecha instalación | Inicio garantía |
| Fecha fin | Vencimiento |
| Días restantes | Countdown |
| Operador | Ubicación actual |

Alertas automáticas para garantías próximas a vencer (30 días).

---

## 15. Informes i KPIs

### 15.1 Descripción

Panel de reporting con métricas de rendimiento del contrato C-5.

### 15.2 Períodos Disponibles

- **Mensual**: Último mes
- **Trimestral**: Últimos 3 meses

### 15.3 KPIs de Stock

| KPI | Descripción | Objetivo |
|-----|-------------|----------|
| **Roturas de stock** | Eventos donde stock < mínimo | 0 |
| **Índice de rotación** | Consumo anual / Stock medio | >2 |
| **Cobertura de stock** | Días de stock disponible | >30 días |

### 15.4 KPIs de Reparaciones

| KPI | Descripción | Objetivo |
|-----|-------------|----------|
| **Cumplimiento SLA** | % reparaciones dentro de plazo | >95% |
| **Tiempo medio reparación** | MTTR (Mean Time To Repair) | <5 días |
| **Reparaciones abiertas** | Total activas | - |
| **Tasa de reincidencia** | % equipos reparados >1 vez | <5% |

### 15.5 KPIs de Garantías

| KPI | Descripción | Objetivo |
|-----|-------------|----------|
| **Reclamaciones activas** | En proceso con WINFIN | - |
| **Tiempo medio resolución** | Días hasta cierre | <15 días |
| **Tasa aceptación** | % reclamaciones aceptadas | >90% |

### 15.6 Gráficos Disponibles

- **Evolución de stock**: Líneas temporales
- **Reparaciones por tipo**: Gráfico de barras
- **SLA cumplimiento**: Gráfico de pastel
- **Entregas por operador**: Barras apiladas

---

## 16. Glosario de Estados

### 16.1 Estados de Solicitud de Operador

```
borrador → enviada → aprobada → asignada_pedido → en_transito → entregada
                  ↘ rechazada
                  ↘ aprobada → servida_stock
```

### 16.2 Estados de Pedido WINFIN

```
borrador → enviado_proveedor → confirmado → en_fabricacion → enviado → recibido → distribuido
                                                           ↘ recibido_parcial ↗
```

### 16.3 Estados de Entrega (Lliurament)

```
pendent → en_preparacio → preparat → en_transit → lliurat
                                    ↘ parcial
                                    ↘ incidencia
```

### 16.4 Estados de Serie

```
disponible → reservado → instalado → en_garantia → disponible
                      ↘ en_reparacion → disponible
                      ↘ baja
```

### 16.5 Estados de Reparación

```
pendent → diagnostic → esperant_recanvi → en_reparacio → prova → tancada
        ↘ diagnostic → en_reparacio → prova → tancada
```

---

## Anexo A: Configuración del Contrato C-5

| Parámetro | Valor |
|-----------|-------|
| Stock máximo equipos principales | 100 uds/tipo |
| Stock mínimo equipos principales | 20 uds/tipo |
| Buffer urgencias | 10% del stock |
| SLA reparación avería | 10 días |
| SLA reparación vandalismo | 15 días |
| Garantía WINFIN | 24 meses |
| Descuento volumen >50 uds | 5% |
| Descuento volumen >100 uds | 10% |

---

## Anexo B: Contactos

| Rol | Responsabilidad |
|-----|-----------------|
| **Sermetra - Almacén** | Recepción, picking, envíos |
| **Sermetra - Compras** | Pedidos WINFIN, negociación |
| **Sermetra - SAT** | Reparaciones, garantías |
| **WINFIN Electronics** | Proveedor, soporte técnico |
| **Operadores** | Solicitudes, instalación, reporte incidencias |

---

## Historial de Versiones

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | Enero 2025 | Versión inicial del manual |

---

*Manual generado para BusEmbarCAT v2 - Módulo Contrato C-5/2025*
*© 2025 Sermetra - Todos los derechos reservados*
