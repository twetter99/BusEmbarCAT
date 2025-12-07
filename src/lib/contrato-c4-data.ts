/**
 * Datos específicos del Contracte C-4/2025
 * Checklist basada en el Pliego de Prescripciones Técnicas (PPT) Sección 2.1.2
 * Enriquecida según PCAP Sección N (16 puntos)
 */

export type ChecklistStepType = 'checkbox' | 'select' | 'textarea' | 'photo';

export interface ChecklistStep {
  id: string;
  text: string;
  type: ChecklistStepType;
  options?: string[];
}

export interface ChecklistData {
  id: string;
  name: string;
  steps: ChecklistStep[];
}

/**
 * Checklist oficial para Manteniment N2 - Validadora Magnètica
 * Según Pliego C-4/2025, Sección 2.1.2 del PPT
 * 
 * Nota: Las tareas 2-9 deben realizarse FUERA del vehículo
 */
export const C4_CHECKLIST_DATA: ChecklistData = {
  id: "checklist_n2_magnetica_v1",
  name: "Checklist Manteniment N2 - Validadora Magnètica (PPT Sec. 2.1.2)",
  steps: [
    {
      id: "1",
      text: "Desmuntar la validadora del vehicle",
      type: "checkbox"
    },
    {
      id: "2",
      text: "Realitzar la neteja de pols (interna i externa) [FORA DEL VEHICLE]",
      type: "checkbox"
    },
    {
      id: "3",
      text: "Realitzar la neteja de les vies de pas dels bitllets [FORA DEL VEHICLE]",
      type: "checkbox"
    },
    {
      id: "4",
      text: "Realitzar la neteja de fotocèl·lules [FORA DEL VEHICLE]",
      type: "checkbox"
    },
    {
      id: "5",
      text: "Verificar els ajustos dels rodets de pressió contra el capçal magnètic [FORA DEL VEHICLE]",
      type: "checkbox"
    },
    {
      id: "6",
      text: "Verificar la tensió de corretges [FORA DEL VEHICLE]",
      type: "checkbox"
    },
    {
      id: "7",
      text: "Estrènyer els cargols de subjecció de motors [FORA DEL VEHICLE]",
      type: "checkbox"
    },
    {
      id: "8",
      text: "Verificar/Substituir el capçal magnètic [FORA DEL VEHICLE]",
      type: "select",
      options: ["Verificat OK", "Ajustat", "Substituït"]
    },
    {
      id: "9",
      text: "Canviar les peces sotmeses a desgast [FORA DEL VEHICLE]",
      type: "checkbox"
    },
    {
      id: "10",
      text: "Restituir l'equip en el vehicle corresponent",
      type: "checkbox"
    },
    {
      id: "11",
      text: "Realitzar una verificació a bord (en condicions d'explotació o test)",
      type: "checkbox"
    },
    {
      id: "12",
      text: "Observacions del tècnic",
      type: "textarea"
    },
    {
      id: "13",
      text: "FOTO - Evidència interna ABANS del manteniment",
      type: "photo"
    },
    {
      id: "14",
      text: "FOTO - Evidència interna DESPRÉS del manteniment",
      type: "photo"
    }
  ]
};
