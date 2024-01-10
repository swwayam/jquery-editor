import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnChanges,
  SimpleChanges,
  signal,
  WritableSignal,
  AfterViewInit,
  Renderer2,
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

import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    NgxPhotoEditorModule,
    HttpClientModule,
    CdkDrag,
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, AfterViewInit {
  current!: any;
  txtFields: any[] = [];
  output?: NgxCroppedEvent;
  /*********************** */

  commonFields: any[] = [];
  templates: any[] = [];

  mapSizes = new Map();
  currentIndex: WritableSignal<number> = signal(0);
  iframe!: any;

  fontFamilyList = [
    'Select font',
    'Arial',
    'Verdana',
    'Times New Roman',
    'Helvetica',
    'Tahoma',
    'Trebuchet MS',
    'Myraid Pro',
    'Open Sans',
    'Comfortaa',
    'Courgette',
    'Indie Flower',
    'Lusitana',
    'Merriweather',
    'Noto Sans',
    'Oswald',
    'Pragati Narrow',
    'Quattrocento',
  ];

  constructor(
    private http: HttpClient,
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer,
    private service: NgxPhotoEditorService,
    private dataService: DataService,
    private renderer: Renderer2
  ) {}

  templateLinks = [
    '/assets/test291123a3_assets/test291123a3_300x600/test291123a3_300x600/index.html',
    '/assets/test291123a3_assets/test291123a3_320x50/test291123a3_320x50/index.html',
    '/assets/test291123a3_assets/test291123a3_728x90/test291123a3_728x90/index.html',
    '/assets/test291123a3_assets/test291123a3_970x250/test291123a3_970x250/index.html',
  ];

  sanitized = this.templateLinks.map((el) =>
    this.sanitizer.bypassSecurityTrustResourceUrl(el)
  );

  // [1,2,3] -> -2

  // 3

  sizes: any[] = [];
  editableFields: WritableSignal<any[]> = signal([]);
  commonIndex!: any;
  // [[{size:300x500, isLinked: true, global: true, htmlTxt: "Heading", type: "txt", value: "The Zoo", color: "#aadf", fontSize: "12px"}, {} ,{}], [], []]

  // Access the native element from ElementRef
  element = this.elementRef.nativeElement;

  // Create a div element to insert HTML content

  // Append the div to the native element
  ngOnInit(): void {
    // document.getElementById("dd")?.setAttribute("cdkDrag", 'true')
  }

  ngAfterViewInit(): void {
    console.log(this.mapSizes);
    console.log(this.element)
    
    this.getAllData();

  }

  changeMaster() {
    // this.commonFields
  }

  showData(size: number) {
    this.currentIndex.set(size);
    console.log(this.editableFields());
    this.commonIndex = this.mapSizes.get('all');

    // this.http
    //   .get(this.templateLinks[this.currentIndex()], {
    //     headers: { 'Content-Type': 'html' },
    //     responseType: 'text',
    //   }).subscribe((val: any) => {
    //     let div = document.createElement('div');
    //     div.innerHTML = val;

    //   });
    //   console.log(this.commonFields());
  }

  getAllData() {
    for (const templateFields of this.templateLinks) {
      this.http
        .get(templateFields, {
          headers: { 'Content-Type': 'html' },
          responseType: 'text',
        })
        .subscribe((val: any) => {
          let div = document.createElement('div');
          div.innerHTML = val;
          div.id = 'frame';
          this.element.appendChild(div);
          const id = div.querySelectorAll('[id^=sd_]');
          div.style.display = 'none';
          let editableFieldsLength = this.editableFields().length;

          let fileName = templateFields.split('/');
          let size = fileName[fileName.length - 2].split('_')[1];
          let isLinked = true;
          let global: boolean;
          if (editableFieldsLength < 1) {
            global = true;
            this.mapSizes.set('all', 0);
            this.mapSizes.set(size, 0);
          } else {
            global = false;
            this.mapSizes.set(size, editableFieldsLength);
          }

          const temp: any = [];
          // if(this.editableFields.length < 1){
          id.forEach((el: any) => {
            let elId = el.id.split('_');
            // ["sd", "img", "picture"]
            let type = elId[1];
            let htmlTxt = elId[2];
            let value;
            let fontSizePx = window.getComputedStyle(el).fontSize;
            let fontSize = parseInt(fontSizePx.slice(0, fontSizePx.length - 2));
            let color = window.getComputedStyle(el).color;
            let fontFamily = window.getComputedStyle(el).fontFamily;
            let backgroundColor = window.getComputedStyle(el).backgroundColor;
            let href;
            if (type == 'img') {
              value = el.src;
              temp.push({
                size,
                isLinked,
                global,
                type,
                htmlTxt,
                value,
              });
            } else if (type == 'btn') {
              value = el.innerHTML;
              href = el.href;
              temp.push({
                size,
                isLinked,
                global,
                type,
                htmlTxt,
                fontSize,
                color,
                backgroundColor,
                fontFamily,
                value,
                href,
              });
            } else {
              value = el.innerHTML;
              temp.push({
                size,
                isLinked,
                global,
                type,
                htmlTxt,
                fontSize,
                color,
                backgroundColor,
                fontFamily,
                value,
              });
            }
          });

          // this.temp.push(val);
          this.sizes.push(size);
          console.log(this.sizes);

          this.editableFields.update((el) => [...el, temp]);
          // }
        });
    }
    this.commonFields.push(this.editableFields()[0]);
    this.showData(0);
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

  /********************** */

  // Using filenames we will auto take the sizes
  // type
 async onIframeLoad(myFrame: HTMLIFrameElement) {
    this.iframe = await myFrame.contentDocument?.body;
    if (this.iframe) {
      if (this.editableFields().length <= 0) {
        
      }else{
        for (const fields of this.editableFields()[this.currentIndex()]) {
          this.changeTxt(fields, 'false');
          this.changeBgColor(fields, 'false');
          this.changeColor(fields, 'false');
          this.changeFontFamily(fields, 'false');
          //  this.changeUrl(fields)
        }
      }
      
    }
  }

  changeTxt(txt: any, isLink: any) {
    // if (txt.global == true) {
    //   for (const element of this.editableFields()) {
    //     for (const fields of element) {
    //       if (
    //         fields.global != true &&
    //         txt.htmlTxt == fields.htmlTxt &&
    //         fields.isLinked == true
    //       ) {
    //         fields.value = txt.value;
    //         console.log(fields);
    //       }
    //     }
    //   }
    // }

    let id = 'sd_' + txt.type + '_' + txt.htmlTxt;

    if (txt.type == 'btn' || txt.type == 'txt' ) {
      console.log(this.iframe);
      console.log(id);
      
      console.log(this.iframe.querySelectorAll(`#${id}`));
      
   
      this.iframe.querySelector(`#${id}`).innerText = txt.value;

      if (txt.global != true && isLink == 'true') {
        txt.isLinked = false;
      }

      console.log(txt);
      console.log(this.editableFields());
    }
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

  changeColor(txt: any, isLink: any) {
    if (txt.global == true) {
      for (const element of this.editableFields()) {
        for (const fields of element) {
          if (fields.global != true && txt.htmlTxt == fields.htmlTxt) {
            fields.color = txt.color;
          }
        }
      }
    }
    if (txt.type == 'btn' || txt.type == 'txt') {
      let id = 'sd_' + txt.type + '_' + txt.htmlTxt;
      this.iframe.querySelector(`#${id}`).style.color = txt.color;
      this.iframe.querySelector(`#${id}`).style.webkitTextFillColor = txt.color;

      if (txt.global != true && isLink == 'true') {
        txt.isLinked = false;
      }
    }
  }

  changeBgColor(txt: any, isLink: any) {
    if (txt.global == true) {
      for (const element of this.editableFields()) {
        for (const fields of element) {
          if (fields.global != true && txt.htmlTxt == fields.htmlTxt) {
            fields.backgroundColor = txt.backgroundColor;
          }
        }
      }
    }
    if (txt.type == 'btn' || txt.type == 'txt') {
      let id = 'sd_' + txt.type + '_' + txt.htmlTxt;
      this.iframe.querySelector(`#${id}`).style.backgroundColor =
        txt.backgroundColor;
      if (txt.global != true && isLink == 'true') {
        txt.isLinked = false;
      }
    }
  }

  changeFontSize(txt: any, isLink: any) {
    if (txt.global == true) {
      for (const element of this.editableFields()) {
        for (const fields of element) {
          if (fields.global != true && txt.htmlTxt == fields.htmlTxt) {
            fields.fontSize = txt.fontSize;
          }
        }
      }
    }
    if (txt.type == 'btn' || txt.type == 'txt') {
      let id = 'sd_' + txt.type + '_' + txt.htmlTxt;
      this.iframe.querySelector(`#${id}`).style.fontSize = txt.fontSize + 'px';
      if (txt.global != true && isLink == 'true') {
        txt.isLinked = false;
      }
    }
  }

  changeFontFamily(txt: any, isLink: any) {
    if (txt.global == true) {
      for (const element of this.editableFields()) {
        for (const fields of element) {
          if (fields.global != true && txt.htmlTxt == fields.htmlTxt) {
            fields.fontFamily = txt.fontFamily;
          }
        }
      }
    }
    if (txt.type == 'btn' || txt.type == 'txt') {
      let id = 'sd_' + txt.type + '_' + txt.htmlTxt;
      this.iframe.querySelector(`#${id}`).style.fontFamily = txt.fontFamily;
      if (txt.global != true && isLink == 'true') {
        txt.isLinked = false;
      }
    }
  }

  link() {}
  unlink() {}
}
