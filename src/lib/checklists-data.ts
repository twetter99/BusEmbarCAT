
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
    title: 'DADES GENERALS',
    fields: [
      { label: 'Operador', type: 'text', id: 'operator' },
      { label: 'Nº Bus - Matrícula', type: 'text', id: 'busId' },
      { label: 'Cotxera', type: 'text', id: 'depot' },
      { label: 'Responsable intervenció', type: 'text', id: 'supervisor' },
      { label: 'Data inici', type: 'date', id: 'startDate' },
      { label: 'Hora inici', type: 'time', id: 'startTime' },
      { label: 'Data fi', type: 'date', id: 'endDate' },
      { label: 'Hora fi', type: 'time', id: 'endTime' },
      { label: 'Tècnic executor', type: 'text', id: 'technician' },
      { label: 'Tipus manteniment', type: 'text', id: 'maintenanceType' },
    ],
  },
  hardwareData: {
    title: 'HARDWARE EQUIPS T-MOBILITAT',
    fields: [
      { label: 'Nº sèrie pupitre', type: 'text', id: 'deskSerial' },
      { label: 'Nº sèrie suports validadores', type: 'text', id: 'validatorSupportSerial' },
      { label: 'Nº sèrie switch', type: 'text', id: 'switchSerial' },
      { label: 'Nº sèrie kit instal·lació', type: 'text', id: 'installKitSerial' },
      { label: 'Nº sèrie MCC Pupitre', type: 'text', id: 'mccDeskSerial' },
    ],
  },
  softwareData: {
    title: 'SOFTWARE EQUIPS EMBARCATS',
    fields: [
      { label: 'Versió SW pupitre', type: 'text', id: 'deskSwVersion' },
      { label: 'Versió telecàrrega', type: 'text', id: 'telechargeVersion' },
      { label: 'Versió configuració', type: 'text', id: 'configVersion' },
    ],
  },
  tasks: {
    title: 'TASQUES PREVENTIU TRIMESTRAL',
    items: [
      { id: 'q1', text: 'Escriptori/Pupitre: Netejar conjunt amb drap de cotó + multiusos' },
      { id: 'q2', text: 'Escriptori/Pupitre: Desmuntar pupitre i registrar nº de sèrie' },
      { id: 'q3', text: 'Escriptori/Pupitre: Netejar autocutter amb aspirador portàtil' },
      { id: 'q4', text: 'Validadora/Terminal: Netejar entorn amb drap de cotó + multiusos' },
      { id: 'q5', text: 'Validadora/Terminal: Desmuntar i registrar nº sèrie/VAL/TC' },
      { id: 'q6', text: 'Validadora/Terminal: Netejar connector amb netejador de contactes' },
      { id: 'q7', text: 'Final: Posar en marxa T-Mobilitat i comprovar funcionament' },
      { id: 'q8', text: 'Final: Registrar incidències al checklist' },
    ],
  },
  observations: {
    title: 'OBSERVACIONS',
    id: 'observations',
  },
};

export const yearlyChecklist: MaintenanceChecklistData = {
  ...quarterlyChecklist,
  tasks: {
    ...quarterlyChecklist.tasks,
    title: 'TASQUES PREVENTIU ANUAL',
    items: [{ id: 'y0', text: 'TOTES LES TASQUES DEL TRIMESTRAL' }],
  },
  additionalTasks: {
    title: 'TASQUES ADDICIONALS ANUALS',
    items: [
      { id: 'y1', text: 'Infraestructura: Verificar voltatges i fusibles miniATO' },
      { id: 'y2', text: 'Infraestructura: Revisar fixació brida switch; ajustar si és necessari' },
      { id: 'y3', text: 'Infraestructura: Revisar connexions antena tribanda' },
      { id: 'y4', text: 'Infraestructura: Verificar fixació i estanquitat antena' },
      { id: 'y5', text: 'Infraestructura: Comprovar fermesa barres auxiliars' },
      { id: 'y6', text: 'Infraestructura: Revisar cablejat i connectors' },
      { id: 'y7', text: 'Final: Posar en marxa T-Mobilitat i comprovar funcionament' },
      { id: 'y8', text: 'Final: Registrar incidències al checklist' },
    ],
  },
  preexistences: {
    title: 'PREEXISTÈNCIES',
    fields: [
        { label: 'Nº cancel·ladores magnètiques', type: 'number', id: 'magneticCancellers' },
        { label: 'Nº cancel·ladores sense contacte', type: 'number', id: 'contactlessCancellers' },
        { label: 'Integració SAE', type: 'text', id: 'saeIntegration' },
        { label: 'Integració panells exteriors', type: 'text', id: 'externalPanelIntegration' },
    ]
  }
};

export const biannualChecklist: MaintenanceChecklistData = {
    generalData: quarterlyChecklist.generalData,
    hardwareData: quarterlyChecklist.hardwareData,
    softwareData: quarterlyChecklist.softwareData,
    tasks: {
        title: 'TASQUES PREVENTIU BIANUAL',
        items: [{ id: 'b0', text: 'TOTES LES TASQUES DEL TRIMESTRAL I ANUAL' }],
    },
    batteryReplacement: {
        title: 'SUBSTITUCIÓ PILES CR-2032',
        items: [
            { id: 'b1', text: 'Retirar equips i identificar-los amb nº bus i posició' },
            { id: 'b2', text: 'Substituir pila validadora + adhesiu data' },
            { id: 'b3', text: 'Substituir pila terminal consulta + adhesiu data' },
            { id: 'b4', text: 'Substituir pila pupitre + adhesiu data' },
            { id: 'b5', text: 'Registrar equips amb pila substituïda' },
            { id: 'b6', text: 'Reinstal·lar equips al mateix bus/posició' },
            { id: 'b7', text: 'Verificar encesa i comunicació perifèrics' },
        ],
    },
    postOperations: {
        title: 'OPERACIONS POSTERIORS',
        items: [
            { id: 'p1', text: 'Comprovació instal·lació i connexions' },
            { id: 'p2', text: 'Comprovació preexistències' },
            { id: 'p3', text: 'Actualització SW, dades configuració i telecàrrega' },
            { id: 'p4', text: 'Protocols de proves' },
            { id: 'p5', text: 'Activitats finals' },
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
