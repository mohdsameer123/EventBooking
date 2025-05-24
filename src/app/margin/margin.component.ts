import { Component } from '@angular/core';
import { HomeService } from '../services/home.service';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-margin',
  templateUrl: './margin.component.html',
  styleUrls: ['./margin.component.scss']
})
export class MarginComponent {
margin: any;
  isGold: boolean=true;
  goldSilverMargin: any;
constructor(private home: HomeService, private configService: ConfigService){

}
ngOnInit():void{
this.marginGet();
const config = this.configService.getConfig();
    if (config && config.bookingPage  ) {
      this.goldSilverMargin = config.goldSilverMargin;
    }
}
marginGet(){
  this.home.getMargin().subscribe((res:any)=>{
    this.margin=res;
    this.isGold=true;
  })
}
marginSilverGet(){
  this.home.silverGetMargin().subscribe((res:any)=>{
    this.margin=res;
    this.isGold=false;

  })
}
goldSelect(event:any){
  if(event.target.value === 'Gold'){
    this.marginGet()
  }
  else{
    this.marginSilverGet()
  }
}
}
