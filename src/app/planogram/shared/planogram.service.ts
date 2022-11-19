import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { Headers, RequestOptions } from '@angular/http';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { DatabaseService } from './../../core/service/database.service';
import { Planogram } from './planogram';
/**Importações dos dependências necessarias */
@Injectable({
  providedIn: 'root'
})
export class PlanogramService {
  //private API_URL = 'http://thagagcweb.wtltech.com.br/planogram-view/api-planogram/index.php';
  //private API_URL = 'http://192.168.15.4/api-planogram/index.php';
  private API_URL = 'https://thagagcweb.com.br/planogram-view/api-planogram/index.php';
  /**links das apis desenvolvidas, no momento estão apontando para o ambiente de homologação */
  constructor(private nativeStorage: NativeStorage,
    private fileOpener: FileOpener,
    private transfer: FileTransfer,
    private file: File,
    private http: HTTP,
    private db: DatabaseService) { }
    /**a função logout é usada para deslogar o usuário do app e remover a propriedade de que esse usuário esta ativo
     * , então quando o usuário abrir o app novamente ele não vai tentar fazer o login automaticamente.
     */
  async logout() {
    await this.nativeStorage.setItem('ativo', { property: 0 })
      .then(
        () => console.log('Stored item! logout function'),
        error => console.error('Error storing item', error)
      );
  }
  /**a função getInforUser faz a conexão com a api, puxando dessa maneira as informações do usuário e colocando no banco
   * de dados interno(sqlite), baseado nas informações do cliente logado.
   */
  async getInfoUser(email: string) {
    return new Promise((resolve, reject) => {
      let url = this.API_URL + "?keyEmail=" + email;
      var headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json');
      const requestOptions = new RequestOptions({ headers: headers });
      //let options = new RequestOptions({headers: Headers});
      //console.log("Email"+ email);
      let keyUser = { "keyEmail": email };

      this.http.setDataSerializer('json');
      this.http.post(url, {
        "keyEmail": email
      }, { 'Content-Type': 'application/json' })
        .then(data => {

          //console.log();
          let sql = "DELETE FROM tb_arquivo";
          let dataJson = [];
          this.db.executeSQL(sql, dataJson);
          let array = JSON.parse(data.data);

          for (let val of array) {

            sql = "INSERT INTO tb_arquivo (empresa, cliente, canal, cluster, bandeira, loja, categoria, regiao1, regiao2, regiao3, regiao4, regiao5, regiao6, regiao7, regiao8, regiao9, regiao10, Lote) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            //console.log(val);
            let datas = [val.Empresa, val.Cliente, val.Canal, val.Cluster, val.Bandeira, val.Loja, val.Categoria, val.Regiao1, val.Regiao2, val.Regiao3, val.Regiao4, val.Regiao5, val.Regiao6, val.Regiao7, val.Regiao8, val.Regiao9, val.Regiao10, val.Lote];

            this.db.executeSQL(sql, datas);

          }
          resolve();
        })
        .catch(error => {

          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);

        });
    });
  }
  /**Funções que começam com get são usadas para refinar os filtros da tela de planogram, assim quando um filtro é selecionado
   * é chamada a função respectiva para que o próximo filtro seja refinado.
   */
  async getAll(column) {
    const sql = "SELECT * FROM tb_arquivo GROUP BY " + column;
    //const data = [column];
    const result = await this.db.executeSQL(sql);
    const companys = this.fillCompanys(result.rows);
    //console.log("teste");
    return companys;
  }
  async getRegion(column) {
    //console.log(column);
    const sql = "SELECT * FROM tb_arquivo WHERE " + column + " != 'Todas' AND " + column + "!='' GROUP BY " + column;
    let regiao = 'Todas';
    const data = [`%${regiao}%`];
    const result = await this.db.executeSQL(sql);
    const companys = this.fillCompanys(result.rows);
    //console.log("teste");
    return companys;
  }


  async getFilterEmpresa(column, empresa) {
    //console.log(cliente, column);
    const sql = "SELECT * FROM tb_arquivo WHERE empresa like ? GROUP BY " + column;
    const data = [`%${empresa}%`];
    const result = await this.db.executeSQL(sql, data);
    const companys = this.fillCompanys(result.rows);
    //console.log("teste");
    return companys;
  }
  async getFilterCliente(column, cliente, empresa = "") {
    //console.log(cliente, column);
    const sql = "SELECT * FROM tb_arquivo WHERE cliente like ? GROUP BY " + column;
    const data = [`%${cliente}%`];
    const result = await this.db.executeSQL(sql, data);
    const companys = this.fillCompanys(result.rows);
    //console.log("teste");
    return companys;
  }
  async getFilterCanal(column, cliente, canal, empresa = "") {

    if (empresa == "") {
      const sql = "SELECT * FROM tb_arquivo WHERE " + column + " != 'Todas' AND " + column + "!='' AND " + column + "!='todas' AND cliente like ? AND canal like ? GROUP BY " + column;
      let regiao = 'Todas';
      const data = [`%${cliente}%`, `%${canal}%`];
      const result = await this.db.executeSQL(sql, data);
      const companys = this.fillCompanys(result.rows);
      //console.log(empresa);
      return companys;
    } else {


      const sql = "SELECT * FROM tb_arquivo WHERE " + column + " != 'Todas' AND " + column + "!='' AND " + column + "!='todas' AND Empresa like ? AND cliente like ? AND canal like ? GROUP BY " + column;
      let regiao = 'Todas';
      const data = [`%${empresa}%`, `%${cliente}%`, `%${canal}%`];
      const result = await this.db.executeSQL(sql, data);
      const companys = this.fillCompanys(result.rows);
      //console.log(empresa);
      return companys;
    }
  }
  async getFilterRegioes(column, cliente, canal, regiao, empresa = "") {
    console.log(cliente, column);
    if(empresa==""){
      const sql = "SELECT * FROM tb_arquivo WHERE cliente like ? AND canal like ? AND (regiao1 ='Todas' OR regiao1 like ? OR regiao2 like ? OR regiao3 like ? OR regiao4 like ? OR regiao5 like ? OR regiao6 like ? OR regiao7 like ? OR regiao8 like ? OR regiao9 like ? OR regiao10 like ? ) GROUP BY " + column;
      const data = [`%${cliente}%`, `%${canal}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`];
      const result = await this.db.executeSQL(sql, data);
      const companys = this.fillCompanys(result.rows);
      //console.log("teste");
      return companys;
    }else{
      const sql = "SELECT * FROM tb_arquivo WHERE empresa like ? AND cliente like ? AND canal like ? AND (regiao1 ='Todas' OR regiao1 like ? OR regiao2 like ? OR regiao3 like ? OR regiao4 like ? OR regiao5 like ? OR regiao6 like ? OR regiao7 like ? OR regiao8 like ? OR regiao9 like ? OR regiao10 like ? ) GROUP BY " + column;
      const data = [`%${empresa}%`, `%${cliente}%`, `%${canal}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`];
      const result = await this.db.executeSQL(sql, data);
      const companys = this.fillCompanys(result.rows);
      //console.log("teste");
      return companys;
    }

   
  }
  async getFilterCluster(column, cliente, canal, regiao, cluster) {
    console.log(cliente, column);
    const sql = "SELECT * FROM tb_arquivo WHERE cliente like ? AND canal like ? AND cluster like ? AND (regiao1 ='Todas' OR regiao1 = 'Todas' OR regiao1 like ? OR regiao2 like ? OR regiao3 like ? OR regiao4 like ? OR regiao5 like ? OR regiao6 like ? OR regiao7 like ? OR regiao8 like ? OR regiao9 like ? OR regiao10 like ? ) GROUP BY " + column;
    const data = [`%${cliente}%`, `%${canal}%`, `%${cluster}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`];
    const result = await this.db.executeSQL(sql, data);
    const companys = this.fillCompanys(result.rows);
    //console.log("teste");
    return companys;
  }
  async getFilterBandeira(column, cliente, canal, regiao, cluster, bandeira) {
    console.log(cliente, column);
    const sql = "SELECT * FROM tb_arquivo WHERE cliente like ? AND canal like ? AND cluster like ? AND bandeira like ? AND (regiao1 ='Todas' OR regiao1 like ? OR regiao2 like ? OR regiao3 like ? OR regiao4 like ? OR regiao5 like ? OR regiao6 like ? OR regiao7 like ? OR regiao8 like ? OR regiao9 like ? OR regiao10 like ? ) GROUP BY " + column;
    const data = [`%${cliente}%`, `%${canal}%`, `%${cluster}%`, `%${bandeira}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`];
    const result = await this.db.executeSQL(sql, data);
    const companys = this.fillCompanys(result.rows);
    //console.log("teste");
    return companys;
  }
  async getFilterLoja(column, cliente, canal, regiao, cluster, bandeira, loja) {
    console.log(cliente, column);
    const sql = "SELECT * FROM tb_arquivo WHERE cliente like ? AND canal like ? AND cluster like ? AND bandeira like ? AND loja like ? AND (regiao1 ='Todas' OR regiao1 like ? OR regiao2 like ? OR regiao3 like ? OR regiao4 like ? OR regiao5 like ? OR regiao6 like ? OR regiao7 like ? OR regiao8 like ? OR regiao9 like ? OR regiao10 like ? ) GROUP BY " + column;
    const data = [`%${cliente}%`, `%${canal}%`, `%${cluster}%`, `%${bandeira}%`, `%${loja}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`, `%${regiao}%`];
    const result = await this.db.executeSQL(sql, data);
    const companys = this.fillCompanys(result.rows);
    //console.log("teste");
    return companys;
  }
  /**a função fillCompanys é usada para quando for realizada uma busca no BD, os dados sejam organizados na estrutura
   * do objeto e na sequência trazer esses dados já organizados e prontos para serem utilizados. Essa função é chamada
   * pelas demais funções get acima
   */
  private fillCompanys(rows: any) {
    const planograms: Planogram[] = [];
    for (let i = 0; i < rows.length; i++) {
      const item = rows.item(i);
      const planogram = new Planogram();
      planogram.empresa = item.empresa;
      planogram.cliente = item.cliente;
      planogram.canal = item.canal;
      planogram.cluster = item.cluster;
      planogram.bandeira = item.bandeira;
      planogram.loja = item.loja;
      planogram.categoria = item.categoria;
      planogram.regiao1 = item.regiao1;
      planogram.regiao2 = item.regiao2;
      planogram.regiao3 = item.regiao3;
      planogram.regiao4 = item.regiao4;
      planogram.regiao5 = item.regiao5;
      planogram.regiao6 = item.regiao6;
      planogram.regiao7 = item.regiao7;
      planogram.regiao8 = item.regiao8;
      planogram.regiao9 = item.regiao9;
      planogram.regiao10 = item.regiao10;
      planogram.lote = item.lote;
      //company.image=item.Image;
      planograms.push(planogram);
    }
    return planograms;
  }
  /**função resposavel por capturar o lote onde os arquivos estão localizados na web */
  async getLote(planogram: Planogram) {
    const sql = "SELECT * FROM tb_arquivo WHERE cliente like ? AND canal like ? AND cluster like ? AND bandeira like ? AND loja like ? AND categoria like ? ";
    const data = [`%${planogram.cliente}%`, `%${planogram.canal}%`, `%${planogram.cluster}%`, `%${planogram.bandeira}%`, `%${planogram.loja}%`, `%${planogram.categoria}%`];
    const result = await this.db.executeSQL(sql, data);
    const companys = this.fillCompanys(result.rows);
    //console.log(result);
    return companys;
  }
  /**função resposavel por capturar o que foi selecionado nos filtros e trazer para o BD interno os nomes dos arquivos 
   * para que sejam baixados logo em seguida.
   */
  async getFiles(planogram: Planogram) {
    return new Promise((resolve, reject) => {
      //console.log(planogram);
      let url = this.API_URL;
      var headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json');
      const requestOptions = new RequestOptions({ headers: headers });
      //let options = new RequestOptions({headers: Headers});
      let usuarios = { "Nome": "Lucas Benício", "Email": "lucas.benicio@wtltech.com.br", "Senha": "123456" };

      this.http.setDataSerializer('json');
      this.http.post(url, {
        planogram
      }, { 'Content-Type': 'application/json' })
        .then(data => {

          console.log(data);
          resolve(JSON.parse(data.data));

        })
        .catch(error => {

          console.log(error.status);
          console.log(error.error); // error message as string
          console.log(error.headers);

        });
    });

  }
  /**valid company é uma função utilizada para verificar se o usuário poderá ter acesso ao filtro de empresas, no caso
   * somente os administradores tem acesso a esse filtro.
   */
  async validCompany() {
    const sql = "SELECT Empresa FROM tb_arquivo ";
    let regiao = 'Todas';
    const data = [];
    const result = await this.db.executeSQL(sql, data);
    //console.log(result.rows.item(0))
    if (result.rows.item(0).empresa != "" && result.rows.item(0).empresa !== null) {
      return true;
    } else {
      return false;
    }
    //return companys;
  }
}
