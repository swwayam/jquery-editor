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
  Renderer2
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

import {CdkDrag} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    NgxPhotoEditorModule,
    HttpClientModule,
    CdkDrag
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnChanges, AfterViewInit {
  type = 'all';
  current !: any;
  size = '/assets/test291123a3_assets/test291123a3/test291123a3/index.html';
  txtFields: any[] = [];
  sanitizedURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.size);
  output?: NgxCroppedEvent;
  /*********************** */
  
  @ViewChild('htmlContainer') htmlContainer!: ElementRef;
  @ViewChild('dis') dis!: ElementRef;


  templates: any[] = []

  mapSizes = new Map()
  currentIndex = signal(0)
  iframe!: any ;


  constructor(
    private http: HttpClient,
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer,
    private service: NgxPhotoEditorService,
    private dataService: DataService,
    private renderer: Renderer2
  ) {}

  


  templateLinks =  [
    '/assets/test291123a3_assets/test291123a3_970x250/test291123a3_970x250/index.html',
    '/assets/test291123a3_assets/test291123a3_300x600/test291123a3_300x600/index.html',
    '/assets/test291123a3_assets/test291123a3_320x50/test291123a3_320x50/index.html',
    '/assets/test291123a3_assets/test291123a3_728x90/test291123a3_728x90/index.html',
  
  ];

  sanitized = this.templateLinks.map(el => this.sanitizer.bypassSecurityTrustResourceUrl(el))


  // [1,2,3] -> -2

  // 3


  editableFields : WritableSignal<any[]> = signal([]);

  // [[{size:300x500, isLinked: true, global: true, htmlTxt: "Heading", type: "txt", value: "The Zoo", color: "#aadf", fontSize: "12px"}, {} ,{}], [], []]

  // Access the native element from ElementRef
  element = this.elementRef.nativeElement;

  // Create a div element to insert HTML content
  changeTxt(txt: any) {
    let id = 'sd_' + txt.type + '_' + txt.htmlTxt;
    this.htmlContainer.nativeElement.querySelector(`#${id}`).innerHTML = txt.value;
  }


  // Append the div to the native element
  ngOnInit(): void {
    // document.getElementById("dd")?.setAttribute("cdkDrag", 'true')
  }

  ngAfterViewInit(): void {
    this.getAllData()
    this.renderer.setAttribute(document.getElementById("dd"), 'cdkDrag', '');
  }

  showData(){
    this.currentIndex.set(this.mapSizes.get("320x50"))
    this.http
        .get(this.templateLinks[2], {
          headers: { 'Content-Type': 'html' },
          responseType: 'text',
        })
        .subscribe((val: any) => {
          // let div = document.createElement('div')
          // div.innerHTML = val
          this.htmlContainer.nativeElement.innerHTML = val;
        })
  }
  

  getAllData(){
    console.log('init');
    for (const templateFields of this.templateLinks) {
      this.http
        .get(templateFields, {
          headers: { 'Content-Type': 'html' },
          responseType: 'text',
        })
        .subscribe((val: any) => {
        
          this.dis.nativeElement.innerHTML = val;
          this.dis.nativeElement.style.display = "none"
          // this.element.appendChild(div);
          
          const id = this.dis.nativeElement.querySelectorAll('[id^=sd_]');
          
          let editableFieldsLength = this.editableFields().length

          let fileName = templateFields.split("/")
          let size = fileName[fileName.length - 2].split("_")[1]
          let isLinked = true
          let global: boolean;
          if(editableFieldsLength < 1){
             global = true
             this.mapSizes.set("all", 0)
          }else{
            global = false
            this.mapSizes.set(size, editableFieldsLength - 1)
          }

         


          const temp : any = []
          // if(this.editableFields.length < 1){
          id.forEach((el : any) => {
            let elId = el.id.split("_")
            // ["sd", "img", "picture"]
            let type = elId[1]
            let htmlTxt = elId[2]
            let value;
            let fontSizePx = window.getComputedStyle(el).fontSize
            let fontSize = parseInt(fontSizePx.slice(0, fontSizePx.length - 2))
            let color = window.getComputedStyle(el).color            
           
            

            if(el.innerHTML == ""){
              value = el.src
              temp.push({
            
                size,
                isLinked,
                global,
                type,
                htmlTxt,
                fontSize,
                color,
                value
              })
            }else{
              value = el.innerHTML
              temp.push({
                
                size,
                isLinked,
                global,
                type,
                htmlTxt,
                fontSize,
                color,
                value
              })
            }


          })


          // this.temp.push(val);

          this.editableFields.update((el) => [...el, temp])
        // }
        });
      }
      this.showData()
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
    // console.log('Iframe has finished loading.');

    // console.log('below of local');

    // // You can perform actions here once the iframe has loaded
    this.iframe = await myFrame.contentDocument?.body;
    let a = this.iframe.querySelector(`#sd_txt_Heading`)
    a.setAttribute("cdkDrag", '')
    // sort

    // function getActualFontInInt(fontSize: any) {
    //   return parseInt(fontSize.substring(0, fontSize.length - 2));
    // }

    // allID?.forEach((el: any) => {
    //   let value;

    //   let id;

    //   if (el.innerHTML.valueOf() == '') {
    //     let a = el as HTMLImageElement;
    //     value = a.src;
    //   } else {
    //     value = el.innerHTML.valueOf();
    //   }

    //   id = el.id;
    //   let editable = el.id.split('_');

    //   // console.log(value);
    //   if (editable[1] == 'txt') {
    //     for (const el of this.data) {
    //       if (el.size == this.type && el.label == editable[2]) {
    //         this.changeTxt(el);
    //         this.changeColor(el);
    //         this.changeFontSize(el);
    //         return;
    //       }
    //       console.log(el);
    //     }
    //     this.data.push({
    //       size: this.type,
    //       label: editable[2],
    //       value: value,
    //       type: 'txt',
    //       color: window.getComputedStyle(el).color,
    //       fontSize: getActualFontInInt(window.getComputedStyle(el).fontSize),
    //     });
    //   }

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
    // });

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


  changeColor(txt: any) {
    // console.log(txt);
    let id = 'sd_' + txt.type + '_' + txt.htmlTxt;
    this.htmlContainer.nativeElement.querySelector(`#${id}`).style.color = txt.color;
    // this.htmlContainer.nativeElement.querySelector(`#${id}`).style.fontSize = txt.fontSize + 'px';

    // this.element.querySelector(`#${id}`).style.color = txt.color;
    // this.element.querySelector(`#${id}`).style.webkitTextFillColor = txt.color;
    console.log(txt);
  }

  changeFontSize(txt: any) {
    // console.log(txt);
    let id = 'sd_' + txt.type + '_' + txt.htmlTxt;
    this.htmlContainer.nativeElement.querySelector(`#${id}`).style.fontSize = txt.fontSize + 'px';
  }
}
