import { Component, OnInit } from '@angular/core';
import { ItemService } from 'src/app/core/services/personaje.service';
import { Personaje } from '../models/personaje.model';

@Component({
  standalone: false,
  selector: 'app-personaje-page',
  templateUrl: './personaje-page.component.html',
  styleUrls: ['./personaje-page.component.css']
})
export class ItemPageComponent implements OnInit {

  personajes: Personaje[] = [];
  mostrarFormulario = false;

  constructor(private itemService: ItemService) {}

ngOnInit() {
  this.itemService.personajes$.subscribe(data => {
    this.personajes = data;
  });

  this.itemService.cargarItems();
}


personajes$ = this.itemService.personajes$;


  abrirFormulario() { this.mostrarFormulario = true; }
  cerrarFormulario() { this.mostrarFormulario = false; }

  eliminarItem(id: string) {
  this.itemService.eliminarItem(id).subscribe(() => {
    this.itemService.cargarItems();
  });
}

}
