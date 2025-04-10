import { usePostres } from './../utils/postgres';
export const getUser = async (data) => {
    const sql = usePostres()
    const {uuid, name} = data
    console.log("Usuario ", uuid);
    console.log("Nombre ", name);
    const client = await sql`SELECT id_rol from "UsuarioRol" Where id_usuario = ${uuid};`
    if(client.length > 0){
        return "OK";
    }
    else{
        console.log("El usuario no tiene rol asignado creando cliente y rol");
        if(await verifyUserSupabase){
            var client2 = await sql`SELECT * from crear_cliente_rol(${name}, ${uuid});`
            return "OK"
        }
    }
};
async function verifyUserSupabase(uuid){
    const sql = usePostres()
    const id = await sql`SELECT * FROM get_user(${uuid});`;
    return id.length > 0;
}

export const getRole = async (data) => {
    const sql = usePostres();
    const { id } = data;
    const rol = await sql`SELECT * FROM obtener_rol_usuario(${id});`
    return rol[0].obtener_rol_usuario;
}