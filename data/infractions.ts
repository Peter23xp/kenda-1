//utilisation des données mockées pour eviter des query la DB...

export interface Infraction {
  id: number;
  nom: string;
  tarif_usd: number;
}

export const INFRACTIONS: Infraction[] = [
  { id: 1, nom: "Excès de vitesse", tarif_usd: 50.00 },
  { id: 2, nom: "Non‑port de la ceinture de sécurité", tarif_usd: 40.00 },
  { id: 3, nom: "Non‑port du casque", tarif_usd: 35.00 },
  { id: 4, nom: "Usage du téléphone au volant", tarif_usd: 45.00 },
  { id: 5, nom: "Conduite dangereuse ou agressive", tarif_usd: 70.00 },
  { id: 6, nom: "Conduite en état d'ivresse", tarif_usd: 150.00 },
  { id: 7, nom: "Non‑respect du feu rouge et des priorités", tarif_usd: 60.00 },
  { id: 8, nom: "Documents & conformité administrative", tarif_usd: 30.00 },
  { id: 9, nom: "Absence de permis de conduire valide", tarif_usd: 100.00 },
  { id: 10, nom: "Absence d'assurance ou assurance expirée", tarif_usd: 80.00 },
  { id: 11, nom: "Absence de carte grise / documents du véhicule", tarif_usd: 40.00 },
  { id: 12, nom: "Plaques d'immatriculation non conformes ou illisibles", tarif_usd: 25.00 },
  { id: 13, nom: "Défaut d'éclairage / feux défectueux", tarif_usd: 35.00 },
  { id: 14, nom: "Freins, pneus ou équipements défectueux", tarif_usd: 55.00 },
  { id: 15, nom: "Surcharge (passagers ou marchandises)", tarif_usd: 60.00 },
  { id: 16, nom: "Chargement non arrimé ou dangereux", tarif_usd: 50.00 }
];
