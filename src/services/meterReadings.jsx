import { supabase } from "../supabase/client";

export const getMeterReadings = async () => {
  const { data, error } = await supabase
    .from("meter_readings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};
