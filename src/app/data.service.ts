import { Injectable,inject ,WritableSignal, signal , effect, ElementRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }


  // domParser = new DOMParser()
 
  // templateLinks = ['/assets/test291123a3_assets/test291123a3/test291123a3/index.html', '/assets/test291123a3_assets/test291123a3_300x600/test291123a3_300x600/index.html', '/assets/test291123a3_assets/test291123a3_320x50/test291123a3_320x50/index.html']

  // template : any[] = []

  // editableFields = [
    
  // ]

  // // Access the native element from ElementRef
  // element = this.elementRef.nativeElement;

  // // Create a div element to insert HTML content
  //  div = document.createElement('div');
  

  // Append the div to the native element

  
  
  // identifySdFields(){
  //   for (const templateFields of this.templateLinks) {
  //     this.http.get(templateFields, {
  //       headers: { 'Content-Type':  'html'},
  //       responseType: 'text'
  //     }).subscribe(val => { 
  //       this.div.innerHTML = val
  //       this.element.appendChild(this.div);
  //       const id = this.element.querySelectorAll('*');
  //       console.log(id);
        
  //       this.template.push(val)
  //     })
  //   }
  //   return this.template
  // }





  /**
   * Global
   * signal(arr[0])
   * 
   * Local
   * 
   * [
   * {
   *  size: 350x400,
   *  txt 
   * }
   * ]
   * 
   * [
   *  {
   *    type: 350x400,
   *    txt: [],
   *    img: []
   *  },
   * {
   *    type: 300x250,
   *    txt: [],
   *    img: []
   * },
   * {
   *    type: 300x600,
   *    txt: [],
   *    img: []
   * }
   *
   * ]
   * 
  */
}
