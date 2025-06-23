import { usePostres } from './../../utils/postgres';

export const getAllOfertas = async (ofertaId) => {
  const id = ofertaId;
  const sql = usePostres();
  let ofertas;
  if (id > 0) {
    ofertas = await sql`SELECT o.*, ARRAY_AGG(op.id_pizza) AS pizzas FROM "Oferta" o LEFT JOIN "Pizza_Oferta" op ON op.id_oferta = o.id_oferta 
        WHERE o.id_oferta = ${id} GROUP BY o.id_oferta;`;
  } else {
    ofertas = await sql`SELECT * FROM vw_ofertas_con_pizzas`; // Solo obtener categorías activas
  }
  return ofertas;
};
/*

*/
export const insertOferta = async (oferta) => {
  const sql = usePostres();
  const ofertaTexto = JSON.stringify(oferta);
  console.log(`
      SELECT public.insertar_oferta('${oferta}'::jsonb)
    `)
  const result = await sql`
      SELECT public.insertar_oferta(${oferta})
    `;
  const id_oferta = result[0]?.insertar_oferta;
  if (!id_oferta) {
    throw new Error('No se pudo insertar la oferta');
  }
  return { ok: true, id_oferta };
};


export const updateOferta = async (oferta) => {
  const sql = usePostres();

  const {
    id_oferta,
    nombre,
    descripcion,
    tipo,
    descuento,
    n_cantidad,
    m_paga,
    fecha_inicio,
    fecha_fin,
    activo,
    pizzas
  } = oferta;
  console.log(sql.array(pizzas, 'int4').value)
  const result = await sql`
      SELECT actualizar_oferta_con_pizzas(
        ${id_oferta},
        ${nombre},
        ${descripcion},
        ${tipo},
        ${descuento}, 
        ${n_cantidad},
        ${m_paga},
        ${fecha_inicio},
        ${fecha_fin},
        ${activo},
        ${sql.array(pizzas, 'integer').value}
      );
    `;

  return { ok: true };
};

export const deleteLogicOferta = async (oferta) => {
  return "ok";
};