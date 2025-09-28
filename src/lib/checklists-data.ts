
export type ChecklistItemData = {
  id: string;
  text: string;
  subItems?: ChecklistItemData[];
};

export type ChecklistSectionData = {
  title: string;
  items: ChecklistItemData[];
};

export type MaintenanceChecklistData = {
  generalData: { title: string; fields: { label: string; type: string; id: string }[] };
  hardwareData: { title: string; fields: { label: string; type: string; id: string }[] };
  softwareData: { title: string; fields: { label:string; type: string; id: string }[] };
  tasks: ChecklistSectionData;
  additionalTasks?: ChecklistSectionData;
  preexistences?: { title: string; fields: { label: string; type: string; id: string }[] };
  batteryReplacement?: ChecklistSectionData;
  postOperations?: ChecklistSectionData;
  observations: { title: string; id: string };
};

export const quarterlyChecklist: MaintenanceChecklistData = {
  generalData: {
    title: 'DATOS GENERALES',
    fields: [
      { label: 'Operador', type: 'text', id: 'operator' },
      { label: 'Nº Bus - Matrícula', type: 'text', id: 'busId' },
      { label: 'Cochera', type: 'text', id: 'depot' },
      { label: 'Responsable intervención', type: 'text', id: 'supervisor' },
      { label: 'Fecha inicio', type: 'date', id: 'startDate' },
      { label: 'Hora inicio', type: 'time', id: 'startTime' },
      { label: 'Fecha fin', type: 'date', id: 'endDate' },
      { label: 'Hora fin', type: 'time', id: 'endTime' },
      { label: 'Técnico ejecutor', type: 'text', id: 'technician' },
      { label: 'Tipo mantenimiento', type: 'text', id: 'maintenanceType' },
    ],
  },
  hardwareData: {
    title: 'HARDWARE EQUIPOS T-MOBILITAT',
    fields: [
      { label: 'Nº serie pupitre', type: 'text', id: 'deskSerial' },
      { label: 'Nº serie soportes validadoras', type: 'text', id: 'validatorSupportSerial' },
      { label: 'Nº serie switch', type: 'text', id: 'switchSerial' },
      { label: 'Nº serie kit instalación', type: 'text', id: 'installKitSerial' },
      { label: 'Nº serie MCC Pupitre', type: 'text', id: 'mccDeskSerial' },
    ],
  },
  softwareData: {
    title: 'SOFTWARE EQUIPOS EMBARCADOS',
    fields: [
      { label: 'Versión SW pupitre', type: 'text', id: 'deskSwVersion' },
      { label: 'Versión telecarga', type: 'text', id: 'telechargeVersion' },
      { label: 'Versión configuración', type: 'text', id: 'configVersion' },
    ],
  },
  tasks: {
    title: 'TAREAS PREVENTIVO TRIMESTRAL',
    items: [
      { id: 'q1', text: 'Escritorio/Pupitre: Limpiar conjunto con trapo algodón + multiuso' },
      { id: 'q2', text: 'Escritorio/Pupitre: Desmontar pupitre y registrar nº serie' },
      { id: 'q3', text: 'Escritorio/Pupitre: Limpiar autocutter con aspirador portátil' },
      { id: 'q4', text: 'Validadora/Terminal: Limpiar entorno con trapo algodón + multiuso' },
      { id: 'q5', text: 'Validadora/Terminal: Desmontar y registrar nº serie/VAL/TC' },
      { id: 'q6', text: 'Validadora/Terminal: Limpiar conector con limpiador contactos' },
      { id: 'q7', text: 'Final: Poner en marcha T-Mobilitat y comprobar funcionamiento' },
      { id: 'q8', text: 'Final: Registrar incidencias en checklist' },
    ],
  },
  observations: {
    title: 'OBSERVACIONES',
    id: 'observations',
  },
};

export const yearlyChecklist: MaintenanceChecklistData = {
  ...quarterlyChecklist,
  tasks: {
    ...quarterlyChecklist.tasks,
    title: 'TAREAS PREVENTIVO ANUAL',
    items: [{ id: 'y0', text: 'TODAS LAS TAREAS DEL TRIMESTRAL' }],
  },
  additionalTasks: {
    title: 'TAREAS ADICIONALES ANUALES',
    items: [
      { id: 'y1', text: 'Infraestructura: Verificar voltajes y fusibles miniATO' },
      { id: 'y2', text: 'Infraestructura: Revisar fijación brida switch; ajustar si necesario' },
      { id: 'y3', text: 'Infraestructura: Revisar conexiones antena tribanda' },
      { id: 'y4', text: 'Infraestructura: Verificar fijación y estanqueidad antena' },
      { id: 'y5', text: 'Infraestructura: Comprobar firmeza barras auxiliares' },
      { id: 'y6', text: 'Infraestructura: Revisar cableado y conectores' },
      { id: 'y7', text: 'Final: Poner en marcha T-Mobilitat y comprobar funcionamiento' },
      { id: 'y8', text: 'Final: Registrar incidencias en checklist' },
    ],
  },
  preexistences: {
    title: 'PREEXISTENCIAS',
    fields: [
        { label: 'Nº canceladoras magnéticas', type: 'number', id: 'magneticCancellers' },
        { label: 'Nº canceladoras sin contacto', type: 'number', id: 'contactlessCancellers' },
        { label: 'Integración SAE', type: 'text', id: 'saeIntegration' },
        { label: 'Integración paneles exteriores', type: 'text', id: 'externalPanelIntegration' },
    ]
  }
};

export const biannualChecklist: MaintenanceChecklistData = {
    generalData: quarterlyChecklist.generalData,
    hardwareData: quarterlyChecklist.hardwareData,
    softwareData: quarterlyChecklist.softwareData,
    tasks: {
        title: 'TAREAS PREVENTIVO BIANUAL',
        items: [{ id: 'b0', text: 'TODAS LAS TAREAS TRIMESTRAL Y ANUAL' }],
    },
    batteryReplacement: {
        title: 'SUSTITUCIÓN PILAS CR-2032',
        items: [
            { id: 'b1', text: 'Retirar equipos e identificarlos con nº bus y posición' },
            { id: 'b2', text: 'Sustituir pila validadora + adhesivo fecha' },
            { id: 'b3', text: 'Sustituir pila terminal consulta + adhesivo fecha' },
            { id: 'b4', text: 'Sustituir pila pupitre + adhesivo fecha' },
            { id: 'b5', text: 'Registrar equipos con pila sustituida' },
            { id: 'b6', text: 'Reinstalar equipos en mismo bus/posición' },
            { id: 'b7', text: 'Verificar encendido y comunicación periféricos' },
        ],
    },
    postOperations: {
        title: 'OPERACIONES POSTERIORES',
        items: [
            { id: 'p1', text: 'Comprobación instalación y conexiones' },
            { id: 'p2', text: 'Comprobación preexistencias' },
            { id: 'p3', text: 'Actualización SW, datos configuración y telecarga' },
            { id: 'p4', text: 'Protocolos de pruebas' },
            { id: 'p5', text: 'Actividades finales' },
        ],
    },
    observations: quarterlyChecklist.observations,
};


export const getChecklistData = (frequency: 'Trimestral' | 'Anual' | 'Bianual'): MaintenanceChecklistData | null => {
    switch (frequency) {
        case 'Trimestral':
            return quarterlyChecklist;
        case 'Anual':
            return yearlyChecklist;
        case 'Bianual':
            return biannualChecklist;
        default:
            return null;
    }
}

    