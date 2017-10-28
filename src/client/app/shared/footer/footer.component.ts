import { Component, OnInit, OnDestroy } from '@angular/core';

/**
 * This class represents the footer component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-footer',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {

  public clock:string = '';
  private id:any;

  ngOnInit() {
    this.startTime();
    this.id = setInterval(() => {
      this.startTime();
      //console.log('clock called');
    }, 1000);
  }

  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }

  startTime() {
      let today = new Date();
      let d = today.getDate();
      let mon = today.getMonth() + 1;
      let y = today.getFullYear();
      let h = today.getHours();
      let m = today.getMinutes();
      let s = today.getSeconds();
      m = this.checkTime(m);
      mon = this.checkTime(mon);
      s = this.checkTime(s);
      this.clock =
      mon + '-' + d + '-' + y + ' ' + h + ':' + m + ':' + s;
  }

  checkTime(i:any) {
      if (i < 10) {
        i = '0' + i;
      }  // add zero in front of numbers < 10
      return i;
  }
}
