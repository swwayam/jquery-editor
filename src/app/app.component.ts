import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { log } from 'console';
import { FormsModule } from '@angular/forms';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  NgxPhotoEditorModule,
  NgxCroppedEvent,
  NgxPhotoEditorService,
} from 'ngx-photo-editor';
import { DataService } from './data.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
declare var $: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    NgxPhotoEditorModule,
    HttpClientModule,
    
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnChanges {
  type = 'all';
  size = '/assets/test291123a3_assets/test291123a3/test291123a3/index.html';
  txtFields: any[] = [];
  sanitizedURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.size);
  output?: NgxCroppedEvent;
  /*********************** */

  templates: any[] = []

  constructor(
    private http: HttpClient,
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer,
    private service: NgxPhotoEditorService,
    private dataService: DataService
  ) {}


  templateLinks =  [
    // '/assets/test291123a3_assets/test291123a3/test291123a3/index.html',
    '/assets/test291123a3_assets/test291123a3_300x600/test291123a3_300x600/index.html',
    '/assets/test291123a3_assets/test291123a3_320x50/test291123a3_320x50/index.html',
  ];


  // [1,2,3] -> -2

  // 3


  editableFields = [];

  // [[{size:300x500, isLinked: true, global: true, htmlTxt: "Heading", type: "txt", value: "The Zoo", color: "#aadf", fontSize: "12px"}, {} ,{}], [], []]

  // Access the native element from ElementRef
  element = this.elementRef.nativeElement;

  // Create a div element to insert HTML content

  // Append the div to the native element

  identifySdFields() {
    console.log("called");
    
    for (const templateFields of this.templateLinks) {
      this.http
        .get(templateFields, {
          headers: { 'Content-Type': 'html' },
          responseType: 'text',
        })
        .subscribe((val: any) => {
          const temp = []
          
          let div = document.createElement('div')
          div.innerHTML = val;
          this.element.appendChild(div);
          const id = this.element.querySelectorAll('[id^=sd_]');
          

          let fileName = templateFields.split("/")
          let size = fileName[fileName.length - 2].split("_")[1]
          let isLinked = true
          let global = false


          id.forEach((el : any) => {
            let elId = el.id.split("_")
            // ["sd", "img", "picture"]
            let type = elId[1]
            let htmlTxt = elId[2]
            let value;

            if(el.innerHTML == ""){
              value = el.src
            }else{
              value = el.innerHTML
            }

            
          })

          // this.temp.push(val);
        });
    }
  }

  getOne() {
    // let a = document.getElementById('0')
    // console.log(a?.);
    // let b = a?.querySelector("#sd_txt_heading");
    // console.log(b);
    // b?.forEach(el => {
    //   console.log(el);
    // })
  }

  // allSizes -> reflect changes
  // local

  allSizes: boolean = false;

  iframe: any;

  data: any[] = [];

  ngOnInit(): void {
    console.log('init');
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changed');
  }

  fileChangeHandler($event: any) {
    this.service
      .open($event, {
        aspectRatio: 4 / 3,
        autoCropArea: 1,
      })
      .subscribe((data) => {
        this.output = data;
      });
  }
  // Using filenames we will auto take the sizes
  // type

  changeUrl(url: string, type: string) {
    this.sanitizedURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.type = type;
  }

  getHTML() {
    this.identifySdFields();
  }

  // Sanitize the URL

  setG() {
    for (const el of this.data) {
      if (el.size == 'all') {
        el.global = true;
      }
    }
    console.log(this.data);
  }

  async onIframeLoad(myFrame: HTMLIFrameElement) {
    console.log('Iframe has finished loading.');

    console.log('below of local');

    // You can perform actions here once the iframe has loaded
    this.iframe = await myFrame.contentDocument?.body;
    let allID = this.iframe?.querySelectorAll('[id^=sd_]');
    // sort

    function getActualFontInInt(fontSize: any) {
      return parseInt(fontSize.substring(0, fontSize.length - 2));
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

      id = el.id;
      let editable = el.id.split('_');

      // console.log(value);
      if (editable[1] == 'txt') {
        for (const el of this.data) {
          if (el.size == this.type && el.label == editable[2]) {
            this.changeTxt(el);
            this.changeColor(el);
            this.changeFontSize(el);
            return;
          }
          console.log(el);
        }
        this.data.push({
          size: this.type,
          label: editable[2],
          value: value,
          type: 'txt',
          color: window.getComputedStyle(el).color,
          fontSize: getActualFontInInt(window.getComputedStyle(el).fontSize),
        });
      }

      // console.log(value);
      // if (editable[1] == 'img') {
      //   for (const el of this.data) {
      //     if (el.size == this.type && el.label == editable[2]) {
      //       this.cropImage(el);
      //       return;
      //     }
      //     console.log(el);
      //   }
      //   this.data.push({
      //     size: this.type,
      //     label: editable[2],
      //     pic: value,
      //     type: 'img',
      //   });
      // }
    });

    // All -> update
    // 300x50 -> all -> sdfljksd -> all
    // 700x350 -> all -> asdfl -> all

    // console.log(this.txtFields);
  }

  cropImage(src: any) {
    let id = 'sd_img_Picture';
    this.service
      .open(src, {
        aspectRatio: 4 / 3,
        autoCropArea: 1,
      })
      .subscribe((data) => {
        this.output = data;
        this.iframe.querySelector(`#${id}`).src = this.output.base64;
      });
  }
  changeImage($event: any) {
    let id = 'sd_img_Picture';
    this.service
      .open($event, {
        aspectRatio: 4 / 3,
        autoCropArea: 1,
      })
      .subscribe((data) => {
        this.output = data;
        this.iframe.querySelector(`#${id}`).src = this.output.base64;
      });
  }

  changeTxt(txt: any) {
    if (txt.global == true) {
      for (const el of this.data) {
        if ((txt.label = el.label)) {
          el.color = txt.color;
          el.value = txt.value;
          el.fontSize = txt.fontSize;
        }
      }
    }

    let id = 'sd_' + txt.type + '_' + txt.label;
    this.iframe.querySelector(`#${id}`).innerHTML = txt.value;
    console.log(txt);
  }

  changeColor(txt: any) {
    // console.log(txt);
    let id = 'sd_' + txt.type + '_' + txt.label;
    this.iframe.querySelector(`#${id}`).style.color = txt.color;
    this.iframe.querySelector(`#${id}`).style.webkitTextFillColor = txt.color;
    console.log(txt);
  }

  changeFontSize(txt: any) {
    // console.log(txt);
    let id = 'sd_' + txt.type + '_' + txt.label;
    this.iframe.querySelector(`#${id}`).style.fontSize = txt.fontSize + 'px';
  }

  async read() {
    let a = new FileReader();
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
