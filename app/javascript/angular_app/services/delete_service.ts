import {Component, Injectable, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class DeleteService {

  constructor(private http: HttpClient) {}

  delete(selectedNamestring): Observable<any> {

    let subject: Subject<any> = new Subject;
    this.http.delete(selectedNamestring.endpoint + selectedNamestring.namestring.namestring.id).subscribe(

      (success) => {
        subject.next(success);
      },

      (error) => {
        console.log('Error', error);
        subject.error(error);
      }
    )
    return subject.asObservable();

  }
}