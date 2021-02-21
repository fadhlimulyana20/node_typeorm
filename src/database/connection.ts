import { Connection, createConnection } from "typeorm"

export const connectDB = async () => {
  try {
    const connection: Connection = await createConnection();
    if(connection) {
      console.log('\x1b[32m%s%s%s%s\x1b[0m', '[Database] ', 'Connected to ', connection.options.database, ' database');
    }
  } catch (error) {
    console.log('\x1b[31m%s\x1b[0m', '[Database] Connection Failed');
    console.log(error);
  }
}