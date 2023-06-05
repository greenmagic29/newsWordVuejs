import { SQLiteDBConnection, CapacitorSQLite,SQLiteConnection } from "@capacitor-community/sqlite";

let db = null;

export async function createConnection() {
  try {
    const sqlite = new SQLiteConnection(CapacitorSQLite)
    const createdSecret = (await sqlite.isSecretStored()).result;
    if(!createdSecret) {
      await sqlite.setEncryptionSecret("abc");
    }
    const ret = await sqlite.checkConnectionsConsistency();
    const isConn = (await sqlite.isConnection("db_vite", false)).result;

    if (ret.result && isConn) {
        db = await sqlite.retrieveConnection("db_vite",false);
    } else {
        db = await sqlite.createConnection("db_vite", true, "secret", 1, false);
    }
  } catch (error) {
    console.log("🚀 ~ file: sqlitedb.js:9 ~ createConnection ~ error:", error)
    
  }
}

export async function openDB() {
  if(db) {
    try {
      await db.open()
    } catch (error) {
      console.log("🚀 ~ file: sqlitedb.js:19 ~ openDB ~ error:", error)
      
    }
  }
}

export async function initTable() {
  if(db) {
    try {
      const sql =  `CREATE TABLE IF NOT EXISTS dictionary(
        id integer primary key,
        word text not null unique,
        definition text not null
      )`;
      await db.execute(sql);
    } catch (error) {
      console.log("🚀 ~ file: sqlitedb.js:30 ~ initTable ~ error:", error)
      
    }
  }
}

export async function insertData() {
  if(db) {
    try {
      const sql = `INSERT INTO dictionary (word, definition) values (?, ?)`;
      const values = ['hello', 'a word of greeting'];
      await db.run(sql, values);
    } catch (error) {
      console.log("🚀 ~ file: sqlitedb.js:46 ~ insertData ~ error:", error)
      
    }
  }
}

export async function queryData () {
  if(db) {
    try {
      const sql =  `Select word, definition from dictionary where word like ?`;
      const values = ['hello'];
      const result = await db.query(sql, values)
      console.log("🚀 ~ file: sqlitedb.js:77 ~ queryData ~ result.values:", JSON.stringify(result.values))
      return result.values;
    } catch (error) {
      console.log("🚀 ~ file: sqlitedb.js:59 ~ queryData ~ error:", error)
      
    }
      
  }
}