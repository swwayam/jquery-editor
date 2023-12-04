import { Component, ElementRef, OnInit, ViewChild , OnChanges, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { log } from 'console';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
declare var $: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnChanges{
  type = "all"
  size = "/assets/test291123a3_assets/test291123a3/test291123a3/index.html"
  txtFields: any[] = [];
  sanitizedURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.size)

  iframe: any;

  data : any[] = []
  
  ngOnInit(): void {
      console.log("init");
      
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("changed");
    
  }
  

  constructor(private sanitizer: DomSanitizer) { }
  


  // Using filenames we will auto take the sizes
  // type 

  changeUrl(url : string, type: string){
    localStorage.setItem("data", JSON.stringify(this.data))
    this.sanitizedURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.type = type
  }


// Sanitize the URL

async onIframeLoad(myFrame: HTMLIFrameElement) {

  

    console.log('Iframe has finished loading.');
    

    console.log("below of local");
    
    // You can perform actions here once the iframe has loaded
    this.iframe = await myFrame.contentDocument?.body;
    let allID = this.iframe?.querySelectorAll('[id^=sd_]');
    // sort

    function getActualFontInInt(fontSize : any){
      return parseInt(fontSize.substring(0, fontSize.length - 2))
    }

    allID?.forEach((el: any) => {
      let value;
    
      let id;
 
      if (el.innerHTML.valueOf() == '') {
        let a = el as HTMLImageElement;
        value = a.src;
      } else {
        value = el.innerHTML.valueOf();
      }

      id = el.id
      let editable = el.id.split('_');
      // console.log(value);
      if (editable[1] == 'txt') {
        this.data.push({
          size:this.type,
          label: editable[2],
          value: value,
          type: 'txt',
          color: window.getComputedStyle(el).color,
          fontSize: getActualFontInInt(window.getComputedStyle(el).fontSize),
        });
      }
    });

    if(localStorage.getItem('data') != null){
      this.data = JSON.parse(localStorage.getItem('data') || "")

    }

    // All -> update
    // 300x50 -> all -> sdfljksd -> all
    // 700x350 -> all -> asdfl -> all

    // console.log(this.txtFields);

  
  }

  changeTxt(txt: any) {
    console.log(txt);

    let id = 'sd_' + txt.type + '_' + txt.label;
    this.iframe.querySelector(`#${id}`).innerHTML = txt.value;
  }

  changeColor(txt: any){
    // console.log(txt);
    let id = 'sd_' + txt.type + '_' + txt.label;
    this.iframe.querySelector(`#${id}`).style.color = txt.color;
  }

  changeFontSize(txt: any){
    // console.log(txt);
    let id = 'sd_' + txt.type + '_' + txt.label;
    this.iframe.querySelector(`#${id}`).style.fontSize = txt.fontSize + "px";
  }


  async read(){
    let a = new FileReader()
    // a.readAsArrayBuffer('src\assets\test291123a3_assets (1)')
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    // console.log(file); 
    
    const reader = new FileReader();
    reader.onload = () => {
      const fileContent = reader.result as string;
      console.log('File content:', fileContent);
      // Perform actions with the file content here
    };
    reader.readAsText(file);
  }

}
