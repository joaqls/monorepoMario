import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Personaje } from 'src/app/features/personaje/models/personaje.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private apiUrl = `${environment.apiUrl}/personajes`;
  private itemSubject = new BehaviorSubject<Personaje[]>([]);
  personajes$ = this.itemSubject.asObservable();

  constructor(private http: HttpClient) {}

  cargarItems() {
    this.http.get<Personaje[]>(this.apiUrl).subscribe({
      next: data => {
        this.itemSubject.next(data);
      },
      error: () => {
        this.itemSubject.next([]);
      }
    });
  }

  agregarItem(formData: FormData) {
    return this.http.post<Personaje>(this.apiUrl, formData);
  }

  eliminarItem(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  refrescarItems() {
    this.cargarItems();
  }

}
