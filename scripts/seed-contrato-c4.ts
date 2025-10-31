/**
 * Script para poblar Firestore con datos de muestra del Contracte C-4/2025
 * 
 * Ejecutar con: npx tsx scripts/seed-contrato-c4.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { firebaseConfig } from '../src/firebase/config';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Datos de muestra
const sampleVehicles = [
  { id: 'vehicle-001', uniqueId: 'VEH-AG-300', codBus: 'AG-300-TMB', operatorId: 'operator-001' },
  { id: 'vehicle-002', uniqueId: 'VEH-AG-301', codBus: 'AG-301-TMB', operatorId: 'operator-001' },
  { id: 'vehicle-003', uniqueId: 'VEH-AG-302', codBus: 'AG-302-TMB', operatorId: 'operator-001' },
  { id: 'vehicle-004', uniqueId: 'VEH-AJ-100', codBus: 'AJ-100-TUS', operatorId: 'operator-002' },
  { id: 'vehicle-005', uniqueId: 'VEH-AJ-101', codBus: 'AJ-101-TUS', operatorId: 'operator-002' },
  { id: 'vehicle-006', uniqueId: 'VEH-AJ-102', codBus: 'AJ-102-TUS', operatorId: 'operator-002' },
  { id: 'vehicle-007', uniqueId: 'VEH-TR-200', codBus: 'TR-200-TRAM', operatorId: 'operator-003' },
  { id: 'vehicle-008', uniqueId: 'VEH-TR-201', codBus: 'TR-201-TRAM', operatorId: 'operator-003' },
  { id: 'vehicle-009', uniqueId: 'VEH-TR-202', codBus: 'TR-202-TRAM', operatorId: 'operator-003' },
  { id: 'vehicle-010', uniqueId: 'VEH-MB-400', codBus: 'MB-400-MNB', operatorId: 'operator-004' },
  { id: 'vehicle-011', uniqueId: 'VEH-MB-401', codBus: 'MB-401-MNB', operatorId: 'operator-004' },
  { id: 'vehicle-012', uniqueId: 'VEH-SG-500', codBus: 'SG-500-SGN', operatorId: 'operator-005' },
  { id: 'vehicle-013', uniqueId: 'VEH-SG-501', codBus: 'SG-501-SGN', operatorId: 'operator-005' },
  { id: 'vehicle-014', uniqueId: 'VEH-SG-502', codBus: 'SG-502-SGN', operatorId: 'operator-005' },
  { id: 'vehicle-015', uniqueId: 'VEH-SG-503', codBus: 'SG-503-SGN', operatorId: 'operator-005' },
];

const sampleInventory = [
  { id: 'inv-001', definitionRef: 'validadora_magnetica_svv', model: 'INDRA', serialNumber: 'SN-MAG-001', vehicleRef: 'vehicle-001', status: 'Activa' },
  { id: 'inv-002', definitionRef: 'validadora_magnetica_svv', model: 'ASCOM', serialNumber: 'SN-MAG-002', vehicleRef: 'vehicle-002', status: 'Activa' },
  { id: 'inv-003', definitionRef: 'validadora_magnetica_svv', model: 'INDRA', serialNumber: 'SN-MAG-003', vehicleRef: 'vehicle-003', status: 'Activa' },
  { id: 'inv-004', definitionRef: 'validadora_magnetica_svv', model: 'ASCOM', serialNumber: 'SN-MAG-004', vehicleRef: 'vehicle-004', status: 'Activa' },
  { id: 'inv-005', definitionRef: 'validadora_magnetica_svv', model: 'INDRA', serialNumber: 'SN-MAG-005', vehicleRef: 'vehicle-005', status: 'Activa' },
  { id: 'inv-006', definitionRef: 'validadora_magnetica_svv', model: 'INDRA', serialNumber: 'SN-MAG-006', vehicleRef: 'vehicle-006', status: 'De Baixa' },
  { id: 'inv-007', definitionRef: 'validadora_magnetica_svv', model: 'ASCOM', serialNumber: 'SN-MAG-007', vehicleRef: 'vehicle-007', status: 'Activa' },
  { id: 'inv-008', definitionRef: 'validadora_magnetica_svv', model: 'INDRA', serialNumber: 'SN-MAG-008', vehicleRef: 'vehicle-008', status: 'Activa' },
  { id: 'inv-009', definitionRef: 'validadora_magnetica_svv', model: 'ASCOM', serialNumber: 'SN-MAG-009', vehicleRef: 'vehicle-009', status: 'De Baixa' },
  { id: 'inv-010', definitionRef: 'validadora_magnetica_svv', model: 'INDRA', serialNumber: 'SN-MAG-010', vehicleRef: 'vehicle-010', status: 'Activa' },
  { id: 'inv-011', definitionRef: 'validadora_magnetica_svv', model: 'ASCOM', serialNumber: 'SN-MAG-011', vehicleRef: 'vehicle-011', status: 'Activa' },
  { id: 'inv-012', definitionRef: 'validadora_magnetica_svv', model: 'INDRA', serialNumber: 'SN-MAG-012', vehicleRef: 'vehicle-012', status: 'Activa' },
  { id: 'inv-013', definitionRef: 'validadora_magnetica_svv', model: 'ASCOM', serialNumber: 'SN-MAG-013', vehicleRef: 'vehicle-013', status: 'De Baixa' },
  { id: 'inv-014', definitionRef: 'validadora_magnetica_svv', model: 'INDRA', serialNumber: 'SN-MAG-014', vehicleRef: 'vehicle-014', status: 'Activa' },
  { id: 'inv-015', definitionRef: 'validadora_magnetica_svv', model: 'ASCOM', serialNumber: 'SN-MAG-015', vehicleRef: 'vehicle-015', status: 'Activa' },
];

const sampleWorkOrders = [
  { id: 'wo-001', planRef: 'plan-trimestral', technicianRef: 'tech-001', cochera: 'Cotxera de Ponent', status: 'Pendiente', vehicleRef: 'vehicle-001' },
  { id: 'wo-002', planRef: 'plan-trimestral', technicianRef: 'tech-001', cochera: 'Cotxera de Ponent', status: 'Pendiente', vehicleRef: 'vehicle-002' },
  { id: 'wo-003', planRef: 'plan-trimestral', technicianRef: 'tech-002', cochera: 'Cotxera del Nord', status: 'Completada', vehicleRef: 'vehicle-004', completedAt: '2025-10-15T10:30:00Z' },
  { id: 'wo-004', planRef: 'plan-anual', technicianRef: 'tech-002', cochera: 'Cotxera del Nord', status: 'Completada', vehicleRef: 'vehicle-005', completedAt: '2025-10-20T14:20:00Z' },
  { id: 'wo-005', planRef: 'plan-trimestral', technicianRef: 'tech-003', cochera: 'Cotxera de Llevant', status: 'Pendiente', vehicleRef: 'vehicle-007' },
  { id: 'wo-006', planRef: 'plan-trimestral', technicianRef: 'tech-003', cochera: 'Cotxera de Llevant', status: 'Completada', vehicleRef: 'vehicle-008', completedAt: '2025-10-22T09:15:00Z' },
  { id: 'wo-007', planRef: 'plan-anual', technicianRef: 'tech-004', cochera: 'Cotxera Central', status: 'Completada', vehicleRef: 'vehicle-010', completedAt: '2025-10-18T11:45:00Z' },
  { id: 'wo-008', planRef: 'plan-trimestral', technicianRef: 'tech-004', cochera: 'Cotxera Central', status: 'Pendiente', vehicleRef: 'vehicle-011' },
  { id: 'wo-009', planRef: 'plan-trimestral', technicianRef: 'tech-005', cochera: 'Cotxera Sud', status: 'Completada', vehicleRef: 'vehicle-012', completedAt: '2025-10-25T16:30:00Z' },
  { id: 'wo-010', planRef: 'plan-anual', technicianRef: 'tech-005', cochera: 'Cotxera Sud', status: 'Completada', vehicleRef: 'vehicle-013', completedAt: '2025-10-26T08:00:00Z' },
  { id: 'wo-011', planRef: 'plan-trimestral', technicianRef: 'tech-001', cochera: 'Cotxera de Ponent', status: 'Completada', vehicleRef: 'vehicle-003', completedAt: '2025-10-27T13:20:00Z' },
  { id: 'wo-012', planRef: 'plan-trimestral', technicianRef: 'tech-002', cochera: 'Cotxera del Nord', status: 'Pendiente', vehicleRef: 'vehicle-006' },
  { id: 'wo-013', planRef: 'plan-anual', technicianRef: 'tech-003', cochera: 'Cotxera de Llevant', status: 'Completada', vehicleRef: 'vehicle-009', completedAt: '2025-10-28T10:10:00Z' },
  { id: 'wo-014', planRef: 'plan-trimestral', technicianRef: 'tech-005', cochera: 'Cotxera Sud', status: 'Pendiente', vehicleRef: 'vehicle-014' },
  { id: 'wo-015', planRef: 'plan-trimestral', technicianRef: 'tech-005', cochera: 'Cotxera Sud', status: 'Pendiente', vehicleRef: 'vehicle-015' },
];

async function seedDatabase() {
  console.log('🌱 Iniciant el sembrat de dades del Contracte C-4/2025...\n');

  try {
    // 1. Poblar vehicles
    console.log('📦 Creant 15 vehicles...');
    let batch = writeBatch(db);
    let count = 0;

    for (const vehicle of sampleVehicles) {
      const vehicleRef = doc(db, 'vehicles', vehicle.id);
      batch.set(vehicleRef, vehicle);
      count++;
      
      if (count % 10 === 0) {
        await batch.commit();
        batch = writeBatch(db);
      }
    }
    
    if (count % 10 !== 0) {
      await batch.commit();
    }
    console.log(`✅ ${sampleVehicles.length} vehicles creats\n`);

    // 2. Poblar inventario
    console.log('📋 Creant 15 validadores magnètiques...');
    batch = writeBatch(db);
    count = 0;

    for (const item of sampleInventory) {
      const itemRef = doc(db, 'contrato_c4_2025_inventory', item.id);
      batch.set(itemRef, item);
      count++;
      
      if (count % 10 === 0) {
        await batch.commit();
        batch = writeBatch(db);
      }
    }
    
    if (count % 10 !== 0) {
      await batch.commit();
    }
    
    const actives = sampleInventory.filter(i => i.status === 'Activa').length;
    const baixes = sampleInventory.filter(i => i.status === 'De Baixa').length;
    console.log(`✅ ${sampleInventory.length} validadores creades`);
    console.log(`   🟢 Actives: ${actives}`);
    console.log(`   🔴 De Baixa: ${baixes}\n`);

    // 3. Poblar work orders
    console.log('📝 Creant 15 ordres de treball...');
    batch = writeBatch(db);
    count = 0;

    for (const wo of sampleWorkOrders) {
      const woRef = doc(db, 'contrato_c4_2025_workOrders', wo.id);
      batch.set(woRef, wo);
      count++;
      
      if (count % 10 === 0) {
        await batch.commit();
        batch = writeBatch(db);
      }
    }
    
    if (count % 10 !== 0) {
      await batch.commit();
    }
    
    const pendents = sampleWorkOrders.filter(w => w.status === 'Pendiente').length;
    const completades = sampleWorkOrders.filter(w => w.status === 'Completada').length;
    console.log(`✅ ${sampleWorkOrders.length} ordres de treball creades`);
    console.log(`   ⏳ Pendents: ${pendents}`);
    console.log(`   ✅ Completades: ${completades}\n`);

    // 4. Resumen final
    console.log('🎉 Sembrat completat amb èxit!\n');
    console.log('📊 RESUM:');
    console.log('─────────────────────────────────────');
    console.log(`Vehicles:              ${sampleVehicles.length}`);
    console.log(`Validadores:           ${sampleInventory.length}`);
    console.log(`  - Actives:           ${actives}`);
    console.log(`  - De Baixa:          ${baixes}`);
    console.log(`Ordres de Treball:     ${sampleWorkOrders.length}`);
    console.log(`  - Pendents:          ${pendents}`);
    console.log(`  - Completades:       ${completades}`);
    console.log('─────────────────────────────────────');
    console.log('\n📈 KPIs Calculats:');
    console.log(`Parc Viu:              ${actives}`);
    console.log(`Unitats de Baixa:      ${baixes}`);
    console.log(`Reducció a Facturar:   ${((baixes / 25) * 2.5).toFixed(2)}%`);
    console.log(`Ràtio Compliment OTs:  ${((completades / sampleWorkOrders.length) * 100).toFixed(1)}%`);
    console.log('\n✨ Ja pots anar a la aplicació i veure les dades!');
    
  } catch (error) {
    console.error('❌ Error durant el sembrat:', error);
    throw error;
  }
}

// Ejecutar el seed
seedDatabase()
  .then(() => {
    console.log('\n👋 Procés finalitzat. Sortint...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });
