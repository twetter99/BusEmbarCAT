# Scripts de Datos - Contracte C-4/2025

Scripts para poblar y gestionar los datos de muestra del módulo Contracte C-4/2025.

## 📁 Archivos

- `seed-contrato-c4.ts` - Crea 15 ejemplos de muestra
- `clear-contrato-c4.ts` - Limpia todos los datos

## 🚀 Uso

### Poblar la base de datos con datos de muestra

```bash
npx tsx scripts/seed-contrato-c4.ts
```

Este script creará:
- ✅ **15 Vehículos** (vehicles)
- ✅ **15 Validadores Magnéticos** (contrato_c4_2025_inventory)
  - 12 Activos
  - 3 De Baixa
- ✅ **15 Órdenes de Trabajo** (contrato_c4_2025_workOrders)
  - 6 Pendientes
  - 9 Completadas

### Limpiar los datos

```bash
npx tsx scripts/clear-contrato-c4.ts
```

## 📊 Datos de Muestra

### Vehículos (15)

| ID | Código Bus | Operador |
|----|-----------|----------|
| vehicle-001 | AG-300-TMB | operator-001 |
| vehicle-002 | AG-301-TMB | operator-001 |
| vehicle-003 | AG-302-TMB | operator-001 |
| vehicle-004 | AJ-100-TUS | operator-002 |
| vehicle-005 | AJ-101-TUS | operator-002 |
| ... | ... | ... |

### Validadores Magnéticos (15)

| Nº Sèrie | Model | Vehicle | Estado |
|----------|-------|---------|--------|
| SN-MAG-001 | INDRA | AG-300-TMB | Activa |
| SN-MAG-002 | ASCOM | AG-301-TMB | Activa |
| SN-MAG-003 | INDRA | AG-302-TMB | Activa |
| SN-MAG-006 | INDRA | AJ-102-TUS | **De Baixa** |
| SN-MAG-009 | ASCOM | TR-202-TRAM | **De Baixa** |
| SN-MAG-013 | ASCOM | SG-501-SGN | **De Baixa** |
| ... | ... | ... | ... |

### Órdenes de Trabajo (15)

| ID | Cochera | Estado | Vehicle |
|----|---------|--------|---------|
| wo-001 | Cotxera de Ponent | Pendiente | AG-300-TMB |
| wo-002 | Cotxera de Ponent | Pendiente | AG-301-TMB |
| wo-003 | Cotxera del Nord | Completada | AJ-100-TUS |
| wo-004 | Cotxera del Nord | Completada | AJ-101-TUS |
| ... | ... | ... | ... |

**Distribución por Cochera:**
- 🏢 Cotxera de Ponent: 3 OTs
- 🏢 Cotxera del Nord: 3 OTs
- 🏢 Cotxera de Llevant: 3 OTs
- 🏢 Cotxera Central: 3 OTs
- 🏢 Cotxera Sud: 3 OTs

## 📈 KPIs Resultantes

Con estos datos de muestra, verás:

```
Parc Viu:              12 validadores
Unitats de Baixa:      3 validadores
Reducció a Facturar:   0.30% ((3/25) × 2.5%)
Ràtio Compliment OTs:  60.0% (9/15)
```

## ⚠️ Requisitos

### 1. Configuración de Firebase

Asegúrate de tener configurado el archivo `src/firebase/config.ts`:

```typescript
export const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  // ... resto de config
};
```

### 2. Reglas de Firestore

Necesitas tener las reglas de seguridad configuradas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /vehicles/{vehicleId} {
      allow read, write: if true; // Temporal para desarrollo
    }
    
    match /contrato_c4_2025_inventory/{inventoryId} {
      allow read, write: if true; // Temporal para desarrollo
    }
    
    match /contrato_c4_2025_workOrders/{workOrderId} {
      allow read, write: if true; // Temporal para desarrollo
    }
  }
}
```

**⚠️ IMPORTANTE:** Las reglas `if true` son solo para desarrollo. En producción, usa autenticación adecuada.

### 3. Dependencias

El proyecto ya debe tener instaladas:
- `firebase` (SDK de Firebase)
- `tsx` (para ejecutar TypeScript directamente)

Si falta `tsx`:
```bash
npm install -D tsx
```

## 🧪 Verificación

Después de ejecutar el seed:

1. **Dashboard C-4** (`/contrato-c4-2025`):
   - Verás los 4 KPIs actualizados
   - Gráfico de tarta con 6 pendientes vs 9 completadas

2. **Inventari Validadores** (`/contrato-c4-2025/inventory`):
   - Tabla con 15 validadores
   - 3 marcados como "De Baixa" (rojo)
   - 12 marcados como "Activa" (verde)
   - Botón "Donar de Baixa" en los activos

3. **Ordres de Treball** (`/contrato-c4-2025/work`):
   - 15 órdenes agrupadas por cochera
   - Mezcla de pendientes y completadas

## 🔄 Flujo de Trabajo Recomendado

```bash
# 1. Primera vez: Poblar datos
npx tsx scripts/seed-contrato-c4.ts

# 2. Probar la funcionalidad "Donar de Baixa" en la UI
# (Marca algunos equipos como "De Baixa" desde la interfaz)

# 3. Ver cómo se actualizan los KPIs en tiempo real

# 4. Si quieres resetear todo:
npx tsx scripts/clear-contrato-c4.ts

# 5. Volver a poblar:
npx tsx scripts/seed-contrato-c4.ts
```

## 🎯 Casos de Prueba

### Prueba 1: Ver Dashboard
1. Ejecuta el seed
2. Ve a `/contrato-c4-2025`
3. Verifica que se muestran los KPIs correctos

### Prueba 2: Dar de Baja un Equipo
1. Ve a `/contrato-c4-2025/inventory`
2. Haz clic en "Donar de Baixa" en SN-MAG-001
3. Confirma en el diálogo
4. Verifica que:
   - El badge cambia a rojo "De Baixa"
   - El botón desaparece
   - Aparece un toast de confirmación
5. Ve al Dashboard y verifica que:
   - "Parc Viu" disminuye de 12 a 11
   - "Unitats de Baixa" aumenta de 3 a 4
   - "Reducció a Facturar" se recalcula automáticamente

### Prueba 3: Actualización en Tiempo Real
1. Abre el Dashboard en una pestaña
2. Abre el Inventario en otra pestaña
3. Da de baja un equipo desde el Inventario
4. Observa cómo el Dashboard se actualiza automáticamente sin refrescar

## 📝 Notas

- Los IDs son fijos para facilitar el debugging
- Los datos son consistentes (todas las referencias existen)
- Los vehículos están distribuidos entre 5 operadores diferentes
- Las cocheras representan diferentes ubicaciones geográficas
- Las fechas de completado son recientes (octubre 2025)

## 🐛 Troubleshooting

### Error: "Permission denied"
- Verifica las reglas de Firestore
- Asegúrate de que el usuario tiene permisos de escritura

### Error: "Firebase not initialized"
- Verifica que `src/firebase/config.ts` existe y tiene la configuración correcta
- Revisa que las credenciales de Firebase son válidas

### Los datos no aparecen en la UI
- Refresca la página (Ctrl+R)
- Verifica la consola del navegador para errores
- Comprueba que las colecciones se crearon en Firebase Console
