import { Injectable,inject ,WritableSignal, signal , effect} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
 
  local : any = []

  map1 = new Map()

  setValue(data : object){
    // this.local.push(data)
    // this.map1.set(data.type)
  }


  constructor(){
   
  }
  




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
