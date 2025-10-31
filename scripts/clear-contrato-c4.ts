/**
 * Script para limpiar los datos del Contracte C-4/2025 de Firestore
 * 
 * Ejecutar con: npx tsx scripts/clear-contrato-c4.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { firebaseConfig } from '../src/firebase/config';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearCollection(collectionName: string) {
  const collectionRef = collection(db, collectionName);
  const snapshot = await getDocs(collectionRef);
  
  if (snapshot.empty) {
    console.log(`   ℹ️  La col·lecció '${collectionName}' ja està buida`);
    return 0;
  }

  const batch = writeBatch(db);
  let count = 0;

  snapshot.docs.forEach((document) => {
    batch.delete(doc(db, collectionName, document.id));
    count++;
  });

  await batch.commit();
  return count;
}

async function clearDatabase() {
  console.log('🧹 Iniciant neteja de dades del Contracte C-4/2025...\n');

  try {
    // Limpiar inventario
    console.log('📋 Netejant inventari...');
    const inventoryDeleted = await clearCollection('contrato_c4_2025_inventory');
    console.log(`✅ ${inventoryDeleted} documents eliminats de l'inventari\n`);

    // Limpiar work orders
    console.log('📝 Netejant ordres de treball...');
    const workOrdersDeleted = await clearCollection('contrato_c4_2025_workOrders');
    console.log(`✅ ${workOrdersDeleted} documents eliminats de les ordres de treball\n`);

    // Limpiar vehicles (opcional - comentar si no quieres borrar vehicles)
    console.log('📦 Netejant vehicles...');
    const vehiclesDeleted = await clearCollection('vehicles');
    console.log(`✅ ${vehiclesDeleted} documents eliminats de vehicles\n`);

    console.log('🎉 Neteja completada amb èxit!');
    console.log('\n📊 RESUM:');
    console.log('─────────────────────────────────────');
    console.log(`Documents eliminats:   ${inventoryDeleted + workOrdersDeleted + vehiclesDeleted}`);
    console.log(`  - Inventari:         ${inventoryDeleted}`);
    console.log(`  - Ordres de Treball: ${workOrdersDeleted}`);
    console.log(`  - Vehicles:          ${vehiclesDeleted}`);
    console.log('─────────────────────────────────────');
    
  } catch (error) {
    console.error('❌ Error durant la neteja:', error);
    throw error;
  }
}

// Ejecutar la limpieza
clearDatabase()
  .then(() => {
    console.log('\n👋 Procés finalitzat. Sortint...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });
