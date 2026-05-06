import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCardComponent } from './personaje-card.component';
import { Personaje } from '../models/personaje.model';

describe('ItemCardComponent', () => {
  let component: ItemCardComponent;
  let fixture: ComponentFixture<ItemCardComponent>;

  const mockPersonaje: Personaje = { _id: '1', nombre: 'Mario', categoria: 'Protagonista', nivel: '10' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemCardComponent]
    });
    fixture = TestBed.createComponent(ItemCardComponent);
    component = fixture.componentInstance;
    component.personaje = mockPersonaje;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('borrar should emit the personaje _id', () => {
    spyOn(component.eliminar, 'emit');
    component.borrar();
    expect(component.eliminar.emit).toHaveBeenCalledWith('1');
  });

  it('abrirEliminar should set mostrarEliminar to true', () => {
    component.mostrarEliminar = false;
    component.abrirEliminar();
    expect(component.mostrarEliminar).toBeTrue();
  });

  it('mostrarEliminar should be false by default', () => {
    expect(component.mostrarEliminar).toBeFalse();
  });
});
