import { supabase } from "../supabase/client";

// Traer todas las lecturas de la base de datos
export const fetchReadingsService = async () => {
  const { data, error } = await supabase
    .from("meter_readings")
    .select("*")
    .order("created_at", { ascending: false }); // las más recientes primero

  if (error) throw new Error(error.message);
  return data;
};
