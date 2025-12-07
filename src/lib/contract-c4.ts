// Paràmetres oficials del Contracte C-4/2025
// Centralitza valors per a un ús consistent a tota l'app

export const C4_TOTAL_VALIDADORES = 1198; // Unitats segons PPT C-4/2025
export const C4_REVISIONS_PER_ANY = 2;    // 1 revisió per semestre
export const C4_TECNICS_ASSIGNATS = 4;    // Tècnics assignats al contracte

export const c4TotalRevisionsAnuals = () => C4_TOTAL_VALIDADORES * C4_REVISIONS_PER_ANY;
export const c4RevisionsMensualsEstimades = () => Math.round(c4TotalRevisionsAnuals() / 12);
