const mariadb = require("mariadb");
const { parseArgs } = require("node:util");

const options = {
  "db-host": { type: "string", default: "127.0.0.1" },
  "db-port": { type: "string", default: "3306" },
  "db-user": { type: "string", default: "app" },
  "db-pass": { type: "string", default: "12345678" },
  "db-name": { type: "string", default: "notes_db" },
};

const { values: config } = parseArgs({ options, strict: false });

async function runMigration() {
  let conn;
  try {
    console.log("Підключення до бази даних...");
    conn = await mariadb.createConnection({
      host: config["db-host"],
      port: parseInt(config["db-port"]),
      user: config["db-user"],
      password: config["db-pass"],
      database: config["db-name"],
    });

    console.log("Виконання міграції...");
    await conn.query(`
            CREATE TABLE IF NOT EXISTS notes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    console.log('Міграція успішна: таблиця "notes" готова до роботи.');
    process.exit(0);
  } catch (err) {
    console.error("Помилка міграції:", err.message);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

runMigration();
