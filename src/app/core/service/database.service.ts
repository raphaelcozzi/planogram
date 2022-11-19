import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  db: SQLiteObject;
  dataBaseName: string = 'planogram.db'
  constructor(private sqLite: SQLite, private sqLitePorter: SQLitePorter) { }

  async openDataBase(){
    try {
      this.db = await this.sqLite.create({name: this.dataBaseName, location: 'default'});
      //console.log("banco criado");
      await this.createDataBase();
      
    } catch (error) {
      console.error('Ocorreu um erro ao criar o banco de dados', error);
    }
  }
  async createDataBase(){
    const sqlCreateDataBase=this.getCreateTable();
    const result = await this.sqLitePorter.importSqlToDb(this.db, sqlCreateDataBase);
    return result ? true : false;
  }
  getCreateTable(){
    const sqls=[];
    sqls.push("DROP TABLE IF EXISTS tb_arquivo; ");
    
    sqls.push("CREATE TABLE IF NOT EXISTS tb_arquivo (id integer primary key AUTOINCREMENT,empresa varchar(50), cliente varchar(50), canal varchar(45), cluster varchar(45), bandeira varchar(45), loja varchar(50), categoria varchar(50), regiao1 varchar(50), regiao2 varchar(50), regiao3 varchar(50), regiao4 varchar(50), regiao5 varchar(50), regiao6 varchar(50), regiao7 varchar(50), regiao8 varchar(50), regiao9 varchar(50), regiao10 varchar(50), lote varchar(10)); ");
    
    
    return sqls.join('\n'); 
  }
  executeSQL(sql: string, params?: any[]){
    //console.log(params);
    return this.db.executeSql(sql, params);
  }
}
