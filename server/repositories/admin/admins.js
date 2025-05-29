// ~/server/repositories/admin/admins.js

import { usePostres } from '../../utils/postgres.js';

export const crearAdminRol = async (uuid) => {
  try {
    const sql = usePostres();
    return await sql`
      SELECT public.crear_admin_rol(${uuid});
    `

  } catch (error) {
    console.error('Error en crearAdminRol:', error)
    throw error
  }
}
