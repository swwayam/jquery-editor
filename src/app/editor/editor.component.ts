import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent {

  txtFields: any[] = [];

  iframe: any;

  async onIframeLoad(myFrame: HTMLIFrameElement) {
    console.log('Iframe has finished loading.');
    // You can perform actions here once the iframe has loaded
    this.iframe = await myFrame.contentDocument?.body;
    let allID = this.iframe?.querySelectorAll('[id^=sd_]');

    // sort

    function getActualFontInInt(fontSize : any){
      return parseInt(fontSize.substring(0, fontSize.length - 2))
    }

    allID?.forEach((el: any) => {
      let value;
      let color;
      let fontSize;
      let id;
 
      if (el.innerHTML.valueOf() == '') {
        let a = el as HTMLImageElement;
        value = a.src;
      } else {
        value = el.innerHTML.valueOf();
      }

      id = el.id
      let editable = el.id.split('_');
      console.log(value);
      if (editable[1] == 'txt') {
        this.txtFields.push({
          label: editable[2],
          value: value,
          type: 'txt',
          color: window.getComputedStyle(el).color,
          fontSize: getActualFontInInt(window.getComputedStyle(el).fontSize),
        });
      }
    });

    console.log(this.txtFields);

  
  }
  
  changeTxt(txt: any) {
    console.log(txt);

    let id = 'sd_' + txt.type + '_' + txt.label;
    this.iframe.querySelector(`#${id}`).innerHTML = txt.value;
  }

  changeColor(txt: any){
    console.log(txt);
    let id = 'sd_' + txt.type + '_' + txt.label;
    this.iframe.querySelector(`#${id}`).style.color = txt.color;
  }

  changeFontSize(txt: any){
    console.log(txt);
    let id = 'sd_' + txt.type + '_' + txt.label;
    this.iframe.querySelector(`#${id}`).style.fontSize = txt.fontSize + "px";
  }

  

}
