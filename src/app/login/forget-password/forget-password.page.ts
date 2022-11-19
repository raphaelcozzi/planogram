import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ToastController, Platform, NavController, LoadingController } from '@ionic/angular';
import { Login } from '../shared/login';
import { LoginService } from '../shared/login.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],

})
export class ForgetPasswordPage implements OnInit {
  data: any;
  constructor(private router: Router,
    private statusBar: StatusBar,
    public platform: Platform,
    private toastCtrl: ToastController,
    private route: ActivatedRoute,
    private loginService: LoginService,
    public loadingController: LoadingController) {
    this.router = router;
    //this.loadingController.dismiss();
   }

  ngOnInit() {
    this.loadingController.dismiss();
    this.route.queryParams.subscribe(params => {
      let getNav = this.router.getCurrentNavigation();
      if (getNav.extras.state) {
        this.data = getNav.extras.state.valorParaEnviar;
        console.log(this.data.Email);
      }
    });
  }
  returnLogin(){
    this.router.navigate(['/', 'login-page']);
  }
  async onSubmit(){

    await this.loginService.sendEmailApi(this.data.Email).then(async (response) => {
      const toast = await this.toastCtrl.create({
        header: "Sucesso",
        message: 'E-mail Enviado com Sucesso',
        color: 'success',
        position: 'bottom',
        duration: 3000
      });
      toast.present();
      this.router.navigate(['/', 'login-page']);
    })
    
  }

}
