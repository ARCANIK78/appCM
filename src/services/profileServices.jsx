import { supabase } from "../supabase/client";

// Obtener perfil de un usuario
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
};

// Actualizar o crear perfil
export const upsertProfile = async (userId, fullName) => {
  const { data, error } = await supabase
    .from("profiles")
    .upsert({ id: userId, full_name: fullName });

  if (error) throw error;
  return data;
};
