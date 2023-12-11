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
export class AppComponent implements OnInit, OnChanges, AfterViewInit {
  type = 'all';
  current!: any;
  size = '/assets/test291123a3_assets/test291123a3/test291123a3/index.html';
  txtFields: any[] = [];
  sanitizedURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.size);
  output?: NgxCroppedEvent;
  /*********************** */

  commonFields: WritableSignal<any[]> = signal([])
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

  // [[{size:300x500, isLinked: true, global: true, htmlTxt: "Heading", type: "txt", value: "The Zoo", color: "#aadf", fontSize: "12px"}, {} ,{}], [], []]

  // Access the native element from ElementRef
  element = this.elementRef.nativeElement;

  // Create a div element to insert HTML content
  

  // Append the div to the native element
  ngOnInit(): void {
    // document.getElementById("dd")?.setAttribute("cdkDrag", 'true')
  }

  ngAfterViewInit(): void {
    this.getAllData();
    console.log(this.mapSizes);
  }

  showData(size: number) {
    this.currentIndex.set(size);
    this.http
      .get(this.templateLinks[this.currentIndex()], {
        headers: { 'Content-Type': 'html' },
        responseType: 'text',
      })
      .subscribe((val: any) => {
        let div = document.createElement('div');
        div.innerHTML = val;
      });
      console.log(this.commonFields());
      
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
            this.mapSizes.set(size, 0)
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

            if (el.innerHTML == '') {
              value = el.src;
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
          this.editableFields.update((el) => [...el, temp]);
          // }
        });
    }
    this.showData(0);
    this.commonFields.set(this.editableFields()[0])
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

  allSizes: boolean = false;

  data: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changed');
  }

  // Using filenames we will auto take the sizes
  // type

  changeUrl(url: string, type: string) {
    this.sanitizedURL = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.type = type;
  }

  async onIframeLoad(myFrame: HTMLIFrameElement) {
    this.iframe = await myFrame.contentDocument?.body;
    for (const fields of this.editableFields()[this.currentIndex()]) {
      this.changeTxt(fields);
      this.changeBgColor(fields);
      this.changeColor(fields);
      this.changeFontFamily(fields);
      //  this.changeUrl(fields)
    }
  }

  checkGlobal(txt : any){
      for (const element of this.editableFields()) {
        for (const fields of element) {
          if(fields.global != true && txt.htmlTxt == fields.htmlTxt){
            fields.value = txt.value
          }
        }
      }
    
  }

  changeTxt(txt: any) {
    if(txt.global == true){
      this.checkGlobal(txt)
    }
    let id = 'sd_' + txt.type + '_' + txt.htmlTxt;
    this.iframe.querySelector(`#${id}`).innerHTML = txt.value;
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

  changeColor(txt: any) {
    // console.log(txt);
    let id = 'sd_' + txt.type + '_' + txt.htmlTxt;
    this.iframe.querySelector(`#${id}`).style.color = txt.color;
    this.iframe.querySelector(`#${id}`).style.webkitTextFillColor = txt.color;
    console.log(id);
  }

  changeBgColor(txt: any) {
    // console.log(txt);
    let id = 'sd_' + txt.type + '_' + txt.htmlTxt;
    this.iframe.querySelector(`#${id}`).style.backgroundColor =
      txt.backgroundColor;
    //this.iframe.querySelector(`#${id}`).style.webkitTextFillColor = txt.color;
  }

  changeFontSize(txt: any) {
    console.log(txt);
    let id = 'sd_' + txt.type + '_' + txt.htmlTxt;
    this.iframe.querySelector(`#${id}`).style.fontSize = txt.fontSize + 'px';
  }

  changeFontFamily(txt: any) {
    let id = 'sd_' + txt.type + '_' + txt.htmlTxt;
    this.iframe.querySelector(`#${id}`).style.fontFamily = txt.fontFamily;
  }

  link() {}
  unlink() {}
}
