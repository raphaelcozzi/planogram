import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ToastController, Platform, NavController, IonInput, LoadingController } from '@ionic/angular';
import { Login } from '../shared/login';

import { LoginService } from '../shared/login.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
/*importações das dependências necessarias para o projeto, lembrando que para elas estarem aqui e funcionarem devem
antes ser importadas no arquivo app.module.ts que está a dois diretórios antecessores a esse, sendo as excesssões são
o Login e LoginService, que por serem arquivos criados para esse projeto só precisam ser informados aqui.
*/
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss'],
})
export class LoginPagePage implements OnInit {
  /* abaixo temos a variável(objeto) login e dentro dele temos os atributos Email, senha e uuid
  essa é a variável usada na página login-page.page.html no [(ngModel)] dos campos de email e senha */ 
  login: Login;
  backButtonSubscription: any;
  /*Abaixo temos o método construtor da página, seus parâmetros são os arquivos que importamos acima, pois para serem
  usados precisam antes serem declarados */
  constructor(private router: Router,
    private statusBar: StatusBar,
    public platform: Platform,
    private toastCtrl: ToastController,
    private loginService: LoginService,
    public loadingController: LoadingController,
    private nativeStorage: NativeStorage) {
    this.router = router;

  }
  fieldTextType: boolean;

  toggleFieldTextType(){
    this.fieldTextType = !this.fieldTextType;
  }
  /* Abaixo temos os dois métodos que são chamados quando a webView é chamada, sendo eles, ngOnInit e ionViewWillEnter
  , então sempre que a webview for chamada esses serão os primeiros métodos que serão chamados, então caso queira que
  ele execute algum processo já quando a página for carregada basta colocar dentro desses métodos */
  async ngOnInit() {
    this.login = new Login();
    this.statusBar.overlaysWebView(false);
    this.statusBar.backgroundColorByHexString('#000');
    await this.nativeStorage.getItem('user')
      .then(
        async data => {
          //console.log(data['property'])
          if (data['property'] != '') {
            this.login.Email = await data['property'];
            //console.log(this.login.Email);
          }
        },
        error => console.error(error)
      );
  }
  async ionViewWillEnter() {
    this.login = new Login();
    this.statusBar.overlaysWebView(false);
    this.statusBar.backgroundColorByHexString('#000');
    await this.nativeStorage.getItem('user')
      .then(
        async data => {
          //console.log(data['property'])
          if (data['property'] != '') {
            this.login.Email = await data['property'];
            //console.log(this.login.Email);
          }
        },
        error => console.error(error)
      );
    await this.nativeStorage.getItem('password')
      .then(
        async data => {
          //console.log(data['property'])
          if (data['property'] != '') {
            this.login.PassWd = await data['property'];
            console.log(this.login.PassWd);
          }
        },
        error => console.error(error)
      );
    await this.nativeStorage.getItem('ativo')
      .then(
        async data => {
          if (data['property'] == 1) {
            this.presentLoading();
            await this.loginService.loginApi(this.login).then(async (response) => {
              console.log(response);
              if (response == "Logado") {
                console.log("teste");
                await this.loginService.setUserInfo(this.login);
                
                this.router.navigate(['/', 'planogram-page']);
              } else if (response == 'uuid') {
                const toast = await this.toastCtrl.create({
                  header: "Inválido",
                  message: 'Usuário não liberado para este dispositivo',
                  color: 'danger',
                  position: 'bottom',
                  duration: 3000
                });
                toast.present();
                await setTimeout(() => {
                  this.loadingController.dismiss();
                }, 1000)
              } else {
                const toast = await this.toastCtrl.create({
                  header: "Inválido",
                  message: 'Combinação de E-mail e senha Inválidos',
                  color: 'danger',
                  position: 'bottom',
                  duration: 3000
                });
                toast.present();
                await setTimeout(() => {
                  this.loadingController.dismiss();
                }, 1000)
              }
            });
          }
        },
        error => console.error(error)
      );
  }
  async ngAfterViewInit() {
    this.statusBar.overlaysWebView(false);
    this.statusBar.backgroundColorByHexString('#000');
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      // add logic here if you want to ask for a popup before exiting
      if (this.router.url === '/login-page') {
        navigator['app'].exitApp();
      }
    });

  }
  ngOnDestroy() {
    this.backButtonSubscription.unsubscribe();
  }
  /*Abaixo os dois métodos são usados para caso o usuário clique no botão de esqueci minha senha, o primeiro método
  aplica uma tela de carregamentos e chama o segundo método que efetivamente, verifica se existe um e-mail digitado e válido
  no campo e-mail e caso sim vai até uma outra página que apenas pede a confirmação do usuário */
  async forgetPasswd() {
    await setTimeout(() => {
      this.forgetPasswdPage();
    }, 2000)
    this.presentLoading();


  }
  async forgetPasswdPage() {

    if (this.login.Email) {

      await this.loginService.forgetPasswdApi(this.login.Email).then(async (response) => {
        this.loadingController.dismiss();
        if (response == 'valido') {

          this.loadingController.dismiss();
          let navigationExtras: NavigationExtras = {
            state: {
              valorParaEnviar: this.login
            }
          };
          this.loadingController.dismiss();
          this.router.navigate(['forget-password'], navigationExtras);
        } else {
          this.loadingController.dismiss();
          const toast = await this.toastCtrl.create({
            header: "Inválido",
            message: 'E-mail não encontrado',
            color: 'danger',
            position: 'bottom',
            duration: 3000
          });

          toast.present();
          this.loadingController.dismiss();

        }
      })
      this.loadingController.dismiss();

    } else {
      const toast = await this.toastCtrl.create({
        header: "Inválido",
        message: 'Favor Informar um E-mail',
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });
      toast.present();
    }
    this.loadingController.dismiss();
  }
  /** função que faz a animação de carregamento do app */
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Aguarde...'
    });
    await loading.present();
    //this.loadContacts();
    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }
  /** método usado quando o formulário é submetido, inicialmente ele envia os dados para o arquivo login.service.spec.ts
   * que está em outro diretório, mas que foi importado acima com o nome de LoginService, os dados são enviadospela função
   * loginApi, passando o e-mail e a senha, quando ao uuid ele é pego do celular por uma outra função que está no mesmo arquivo
   * validando assim as informações na web e caso esteja tudo ok, o app permite o login e redireciona para a página de planogram view
  */
  async onSubmit() {
    //console.log(this.login.Email);
    //console.log(this.login.PassWd);
    this.presentLoading();
    this.nativeStorage.getItem('user')
      .then(
        data => console.log(data['property']),
        error => console.error(error)
      );

    this.nativeStorage.getItem('password')
      .then(
        data => console.log(data['property']),
        error => console.error(error)
      );

    this.nativeStorage.getItem('ativo')
      .then(
        data => console.log(data['property']),
        error => console.error(error)
      );
    try {
      let value;
      
      let result = await this.loginService.loginApi(this.login).then(async (response) => {
        //console.log(response);
        if (response == "Logado") {
          await this.loginService.setUserInfo(this.login);
          const toast = await this.toastCtrl.create({
            header: "Sucesso",
            message: 'Login Feito com Sucesso',
            color: 'success',
            position: 'bottom',
            duration: 3000
          });
          toast.present();
          this.router.navigate(['/', 'planogram-page']);
        } else if (response == 'uuid') {
          const toast = await this.toastCtrl.create({
            header: "Inválido",
            message: 'Usuário não liberado para este dispositivo',
            color: 'danger',
            position: 'bottom',
            duration: 3000
          });
          toast.present();
          await setTimeout(() => {
            this.loadingController.dismiss();
          }, 1000)
        } else {
          const toast = await this.toastCtrl.create({
            header: "Inválido",
            message: 'Combinação de E-mail e senha Inválidos',
            color: 'danger',
            position: 'bottom',
            duration: 3000
          });
          toast.present();
          await setTimeout(() => {
            this.loadingController.dismiss();
          }, 1000)
        }
      });
      //console.log(value);
      //this.login.email = result.insertId;



      //console.log("passei aqui novamente");
    } catch (error) {
      const toast = await this.toastCtrl.create({
        header: "Erro",
        message: 'Ocorreu um erro ao tentar salvar o Contato',
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });
      toast.present();
    }
  }
  //this.router.navigate(['/', 'planogram-page']);
}



