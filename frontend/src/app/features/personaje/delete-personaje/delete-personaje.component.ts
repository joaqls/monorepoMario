import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ItemService } from 'src/app/core/services/personaje.service';

@Component({
  standalone: false,
  selector: 'app-delete-personaje',
  templateUrl: './delete-personaje.component.html',
  styleUrls: ['./delete-personaje.component.css']
})
export class DeleteItemComponent {

  @Input() itemId?: number;
  @Output() cerrar = new EventEmitter<void>();

  constructor(private itemService: ItemService) {}

onEliminar() {
  if (this.itemId == null) return;

  this.itemService.eliminarItem(this.itemId).subscribe(() => {
    this.itemService.cargarItems();
    this.cerrar.emit();
  });
}



}
