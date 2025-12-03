import { supabaseAdmin } from "./supabaseAdmin";

export type Infraction = {
  id: number;
  nom: string;
  description: string;
  vehicule: string;
  tarif_usd: number;
};

export async function fetchInfractions(): Promise<Infraction[]> {
  const { data, error } = await supabaseAdmin
    .from("list_infractions")
    .select("id, nom, description, vehicule, tarif_usd")
    .order("id", { ascending: true });

  if (error) {
    console.error("[fetchInfractions] error", error);
    return [];
  }

  return data ?? [];
}

