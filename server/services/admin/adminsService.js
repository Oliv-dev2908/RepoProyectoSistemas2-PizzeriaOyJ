// ~/server/services/admin/adminsService.js
import { crearAdminRol } from '~/server/repositories/admin/admins'

export const asignarAdmin = async (uuid) => {
  // Podrías validar que uuid sea un UUID válido antes
  await crearAdminRol(uuid)
}

