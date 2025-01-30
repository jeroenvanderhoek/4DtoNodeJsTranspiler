// 4D command: Begin SQL

export default async function Begin_SQL (processState,sql) {

    const { pool } = processState;
    const client = await pool.connect();  
    try {
      const res = await client.query(sql);  
      return res;  
    } catch (err) {
      console.error('Error creating table:', err);
    } finally {  
      client.release();  
    }

}