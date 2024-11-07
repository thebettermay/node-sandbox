import { Client } from "pg";

const createDatabaseClient = () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  return client;
};

export const createSchema = async () => {
  const client = createDatabaseClient();
  await client.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        completed BOOLEAN DEFAULT false
      )
    `);
    console.log("Tasks table created or already exists.");

    await client.query("BEGIN");

    const values = [];
    for (let i = 1; i <= 1000; i++) {
      values.push(`('Task ${i}')`);
    }
    const query = `INSERT INTO tasks (name) VALUES ${values.join(", ")}`;
    await client.query(query);

    await client.query("COMMIT");
    console.log("1000 tasks inserted successfully.");
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Error creating schema or inserting tasks: ${err.stack}`);
    } else {
      console.error(`Error creating schema or inserting tasks: ${err}`);
    }
    await client.query("ROLLBACK");
  } finally {
  }
};

createSchema().catch((err) => {
  console.error(`Error creating schema, ${err.stack}`);
});
