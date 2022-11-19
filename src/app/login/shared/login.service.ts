import { Injectable } from '@angular/core';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { Headers, RequestOptions } from '@angular/http';
import { Login } from './login';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
/**importação das dependências usada nessa parte do projeto */
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private API_URL = 'https://thagagcweb.com.br/planogram-view/api-planogram/index.php';
  
  //private API_URL = 'http://192.168.15.4/api-planogram/index.php';
  /**acima esta o link da api */
  constructor(private uniqueDeviceID: UniqueDeviceID, 
    private nativeStorage: NativeStorage,
    private http: HTTP) { }
    /**abaixo a função loginApi é utilizada para verificar na web se o usuário e senha estão corretos além de validar
     * o uuid pois um usuário não pode logar de uma conta no mesmo aparelho.
     */
  async loginApi(login: Login) {
    return new Promise((resolve, reject) => {
      let uuidUser;
      this.uniqueDeviceID.get()
        .then((uuid: any) => {
          var headers = new Headers();
          headers.append("Accept", 'application/json');
          headers.append('Content-Type', 'application/json');
          const requestOptions = new RequestOptions({ headers: headers });
          //let options = new RequestOptions({headers: Headers});
          let usuarios = { "Nome": "Lucas Benício", "Email": "lucas.benicio@wtltech.com.br", "Senha": "123456" };
          let url = this.API_URL + "?user=" + login.Email + "&passwd=" + login.PassWd + "&uuid=" + uuid;

          this.http.setDataSerializer('json');
          //console.log(url);
          this.http.get(url, {

          }, { 'Content-Type': 'application/json' })
            .then(data => {

              console.log(data.data);
              let sql = "DELETE FROM contacts";
              let dataJson = [];

              //let array = JSON.parse(data.data);
              //console.log(true);

              resolve(data.data);

            })
            .catch(error => {

              console.log(error);
              //console.log(error.error); // error message as string
              //console.log(error.headers);

            });



        })
        .catch((error: any) => console.log(error));

    });
  }
  /**função forgetpassword é usada para verificar na web se o e-mail digitado é valido para enviar o email de recuperar senha */
  async forgetPasswdApi(Email: string) {
    return new Promise((resolve, reject) => {

      var headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json');
      const requestOptions = new RequestOptions({ headers: headers });
      //let options = new RequestOptions({headers: Headers});
      let usuarios = { "Nome": "Lucas Benício", "Email": "lucas.benicio@wtltech.com.br", "Senha": "123456" };
      let url = this.API_URL + "?email=" + Email;

      this.http.setDataSerializer('json');
      //console.log(url);
      this.http.get(url, {

      }, { 'Content-Type': 'application/json' })
        .then(data => {

          //console.log(data.data);
          let sql = "DELETE FROM contacts";
          let dataJson = [];

          //let array = JSON.parse(data.data);
          //console.log(true);

          resolve(data.data);

        })
        .catch(error => {

          console.log(error);
          //console.log(error.error); // error message as string
          //console.log(error.headers);

        });



    })
      .catch((error: any) => console.log(error));


  }
  /**Função utilizada para enviar efetivamente o e-mail de recuperação de senha quando o usuário confirmar o envio */
  async sendEmailApi(Email: string) {
    return new Promise((resolve, reject) => {

      var headers = new Headers();
      headers.append("Accept", 'application/json');
      headers.append('Content-Type', 'application/json');
      const requestOptions = new RequestOptions({ headers: headers });
      //let options = new RequestOptions({headers: Headers});
      let usuarios = { "Nome": "Lucas Benício", "Email": "lucas.benicio@wtltech.com.br", "Senha": "123456" };
      let url = this.API_URL + "?sendemail=" + Email;

      this.http.setDataSerializer('json');
      //console.log(url);
      this.http.get(url, {

      }, { 'Content-Type': 'application/json' })
        .then(data => {

          console.log(data.data);
          let sql = "DELETE FROM contacts";
          let dataJson = [];

          //let array = JSON.parse(data.data);
          //console.log(true);

          resolve(data.data);

        })
        .catch(error => {

          console.log(error);
          //console.log(error.error); // error message as string
          //console.log(error.headers);

        });



    })
      .catch((error: any) => console.log(error));


  }
  /**função utilizada para que quando o usuário logue os dados digitados fiquem salvos internamente e assim quando o 
   * usuário abrir novamente o app os dados sejam recuperados, e o app já faça o login automaticamente sem precisar de intervenção
   * do usuário, mas ao tentar fazer o login novamente o app sempre verifica na web se aquela conta ainda existe e é
   * valida.
   */
  async setUserInfo(login: Login) {
    await this.nativeStorage.setItem('user', { property: login.Email })
      .then(
        () => console.log('Stored item!'),
        error => console.error('Error storing item', error)
      );
    await this.nativeStorage.setItem('password', { property: login.PassWd })
      .then(
        () => console.log('Stored item!'),
        error => console.error('Error storing item', error)
      );
    await this.nativeStorage.setItem('ativo', { property: 1 })
      .then(
        () => console.log('Stored item!'),
        error => console.error('Error storing item', error)
      );
  }
}
