import { SQLiteDBConnection, CapacitorSQLite,SQLiteConnection } from "@capacitor-community/sqlite";
import { LocalNotifications } from "@capacitor/local-notifications";
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
        definition text not null,
        modified_date timestamp default CURRENT_TIMESTAMP 
      )`;
      await db.execute(sql);

      const sqlCache = `Create table if not exists cachedTable(
        id integer primary key,
        name text,
        last_update_date timestamp default current_timestamp
      )`;
      await db.execute(sqlCache);

      const createWordCacheRecordSql = `INSERT or ignore into cachedTable (name) values ('dictionary')`;
      await db.execute(createWordCacheRecordSql);
    } catch (error) {
      console.log("🚀 ~ file: sqlitedb.js:30 ~ initTable ~ error:", error)
      
    }
  }
}
export async function getCache(type) {
  if(db) {
    try {
      const sql =  `Select * from cachedTable where name = ?`;
      const values = [type];
      const result = await db.query(sql, values)
      //console.log("🚀 ~ file: sqlitedb.js:77 ~ queryData ~ result.values:", JSON.stringify(result.values))
      return result.values;
    } catch (error) {
      console.log("🚀 ~ file: sqlitedb.js:68 ~ getCache ~ error:", error)
      
    }
  }
}

export async function updateWordCache() {
  if(db) {
    try {
      const sql = `update cachedTable set last_update_date = current_timestamp where name = 'dictionary'`;
      await db.execute(sql);
    }
    catch(error) {
    console.log("🚀 ~ file: sqlitedb.js:71 ~ updateWordCache ~ error:", error)

    }
  }
}

export async function insertWord(word, definition) {
  if(db) {
    try {
      const sql = `INSERT INTO dictionary (word, definition) values (?, ?)`;
      const values = [word, definition];
      await db.run(sql, values);
    } catch (error) {
      console.log("🚀 ~ file: sqlitedb.js:46 ~ insertWord ~ error:", error)
      
    }
  }
}

export async function queryWordCount() {
  if(db) {
    try {
      const countQuery = await db.query(`select count(*) as count from dictionary`, []);
      const count = countQuery.values[0].count
      return parseInt(count)
    } catch (error) {
      console.log("🚀 ~ file: sqlitedb.js:73 ~ queryWordCount ~ error:", error)
      return 0;
    }
  }
}


export async function queryWordByLimit() {
  if(db) {
    try {
      //


      const sql =  `Select word, definition from dictionary limit 12`;
      const values = [];
      const result = await db.query(sql, values)
      console.log("🚀 ~ file: sqlitedb.js:77 ~ queryData ~ result.values:", JSON.stringify(result.values))
      return result.values;
    } catch (error) {
      console.log("🚀 ~ file: sqlitedb.js:59 ~ queryData ~ error:", error)
      
    }
      
  }
}
export async function queryWordByWord(word) {
  if(db) {
    try {
      const sql =  `Select word, definition from dictionary where word like ?`;
      const values = [word];
      const result = await db.query(sql, values)
      console.log("🚀 ~ file: sqlitedb.js:77 ~ queryData ~ result.values:", JSON.stringify(result.values))
      return result.values;
    } catch (error) {
      console.log("🚀 ~ file: sqlitedb.js:59 ~ queryData ~ error:", error)
      
    }
      
  }
}

export async function getLatestWords() {
  try {
    const res = await fetch(`${import.meta.env.VITE_backendPath}/bookmark/latest`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: localStorage.getItem("login"),
      },
    });
    const resBody = JSON.parse(await res.text());
    return resBody;
  } catch (error) {
    console.log("🚀 ~ file: mobileRequestNotificationBanner.vue:41 ~ getLatestWords ~ error:", error)
    
  }
}

export async function createNotifications() {
  const backendWords = await getLatestWords();
      await createConnection();
      await openDB();
      for (let bdWord of backendWords.row) {
        await insertWord(bdWord.word, bdWord.def.definition)
      }
      
      const words = await queryWordByLimit();
      for (let j = 0; j < 12; j++) {
        const wordString = words[j].word;
        const wordDefString = words[j].definition;
        const hour = j + 9;
        await LocalNotifications.schedule({
          notifications: [
            {
              title: `OneNews: ${wordString}`,
              body: `OneNews: ${wordString}`,
              largeBody: `${wordDefString}`,
              id: j,
              schedule: {
                allowWhileIdle: true,
                on: {
                  hour: hour,
                  minute: 0
                  //minute: 8
                },
              },
            },
          ],
        });
      }

      await updateWordCache()
}

// export async function truncateWord() {
//   if(db) {
//     try {
      
//     } catch (error) {
//       console.log("🚀 ~ file: sqlitedb.js:119 ~ truncateWord ~ error:", error)
      
//     }
//   }
// }