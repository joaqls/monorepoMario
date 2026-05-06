import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { DeleteItemComponent } from './delete-personaje.component';
import { ItemService } from 'src/app/core/services/personaje.service';

describe('DeleteItemComponent', () => {
  let component: DeleteItemComponent;
  let fixture: ComponentFixture<DeleteItemComponent>;
  let mockItemService: jasmine.SpyObj<ItemService>;

  beforeEach(() => {
    mockItemService = jasmine.createSpyObj('ItemService', ['eliminarItem', 'cargarItems']);
    mockItemService.eliminarItem.and.returnValue(of({}));

    TestBed.configureTestingModule({
      declarations: [DeleteItemComponent],
      providers: [
        { provide: ItemService, useValue: mockItemService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(DeleteItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onEliminar should call eliminarItem with the itemId', () => {
    component.itemId = '42';
    component.onEliminar();
    expect(mockItemService.eliminarItem).toHaveBeenCalledWith('42');
  });

  it('onEliminar should call cargarItems after deletion', () => {
    component.itemId = '42';
    component.onEliminar();
    expect(mockItemService.cargarItems).toHaveBeenCalled();
  });

  it('onEliminar should emit cerrar event after deletion', () => {
    spyOn(component.cerrar, 'emit');
    component.itemId = '42';
    component.onEliminar();
    expect(component.cerrar.emit).toHaveBeenCalled();
  });

  it('onEliminar should do nothing when itemId is undefined', () => {
    spyOn(component.cerrar, 'emit');
    component.itemId = undefined;
    component.onEliminar();
    expect(mockItemService.eliminarItem).not.toHaveBeenCalled();
    expect(component.cerrar.emit).not.toHaveBeenCalled();
  });
});
