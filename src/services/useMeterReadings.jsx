import { supabase } from "../supabase/client";

/**
 * Subir foto del medidor a Supabase Storage
 * @param {string} userId - ID del usuario logueado
 * @param {File} file - Archivo a subir
 * @returns {string} URL pública de la foto
 */
export const uploadMeterPhoto = async (userId, file) => {
  if (!file) throw new Error("No se proporcionó ningún archivo");

  // Verificar usuario logueado
  const user = supabase.auth.getUser();
  if (!user) throw new Error("Usuario no logueado, no se puede subir archivo");

  // Generar nombre seguro para el archivo
  const fileName = `${userId}-${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

  console.log("Subiendo archivo:", fileName, "Usuario:", user?.user?.email);

  // Subir archivo al bucket
  const { data, error } = await supabase.storage
    .from("meter-photos")
    .upload(fileName, file);

  if (error) throw new Error(`Error al subir la foto: ${error.message}`);

  // Obtener URL pública
  const { data: { publicUrl } } = supabase.storage
    .from("meter-photos")
    .getPublicUrl(fileName);

  return publicUrl;
};

/**
 * Guardar lectura del medidor en Supabase
 * @param {Object} params - Datos de la lectura
 * @param {string} params.userId
 * @param {string|number} params.meterNumber
 * @param {string|number} params.reading
 * @param {string|null} params.photoUrl
 * @param {number|null} params.latitude
 * @param {number|null} params.longitude
 * @returns {Object} Data insertada
 */
export const saveMeterReading = async ({
  userId,
  meterNumber,
  reading,
  photoUrl = null,
  latitude = null,
  longitude = null,
}) => {
  if (!userId) throw new Error("Se requiere userId para guardar la lectura");
  if (!meterNumber) throw new Error("Se requiere número de medidor");
  if (!reading) throw new Error("Se requiere valor de lectura");

  const { data, error } = await supabase
    .from("meter_readings")
    .insert({
      user_id: userId,
      meter_number: meterNumber,
      reading: Number(reading),
      photo_url: photoUrl,
      latitude: latitude !== null ? Number(latitude) : null,
      longitude: longitude !== null ? Number(longitude) : null,
    });

  if (error) throw new Error(`Error al guardar lectura: ${error.message}`);
  return data;
};
