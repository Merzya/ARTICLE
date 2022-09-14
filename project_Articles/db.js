const sqlite3 = require("sqlite3").verbose();
const dbName = "later.sqlite";
const db = new sqlite3.Database(dbName);

db.serialize(() => {
  const sql = `
    CREATE TABLE if not exists articles
    (id integer primary key, title, content text)`;
  db.run(sql);
});

class Article {
  static all(cb) {
    db.all("SELECT * FROM articles", cb);
  }

  /**
   * find аrticle by  id
   *
   * @param {number} id - первое число
   * @param {number} cb - callback funk
   * @return {Object} db - запрос бд
   *
   * */
  static find(id, cb) {
    db.get("SELECT * FROM articles WHERE id = ?", id, cb);
  }
  static create(data, cb) {
    const sql = `INSERT INTO articles(title, content) VALUES(?,?)`;
    db.run(sql, data.title, data.content, cb);
  }
  static delete(id, cb) {
    if (!id) return cb(new Error("id not exist"));
    db.run("DELETE FROM articles WHERE id = ?", id, cb);
  }
}
module.exports = db;
module.exports.Article = Article;
