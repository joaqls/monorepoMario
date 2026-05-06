<?php

namespace Tests\Unit;

use App\Models\Personaje;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PersonajeModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_puede_crear_un_personaje_con_los_atributos_correctos(): void
    {
        $personaje = Personaje::factory()->create([
            'nombre' => 'Mario',
            'tipo'   => 'héroe',
            'poder'  => 90,
            'mundo'  => 'Reino Champiñón',
        ]);

        $this->assertDatabaseHas('personajes', [
            'nombre' => 'Mario',
            'tipo'   => 'héroe',
            'poder'  => 90,
            'mundo'  => 'Reino Champiñón',
        ]);

        $this->assertEquals('Mario', $personaje->nombre);
        $this->assertEquals('héroe', $personaje->tipo);
        $this->assertEquals(90, $personaje->poder);
        $this->assertEquals('Reino Champiñón', $personaje->mundo);
    }

    public function test_tiene_los_atributos_fillable_correctos(): void
    {
        $personaje = new Personaje();

        $this->assertEquals(
            ['nombre', 'tipo', 'poder', 'mundo'],
            $personaje->getFillable()
        );
    }

    public function test_puede_crear_personaje_mediante_asignacion_masiva(): void
    {
        $datos = [
            'nombre' => 'Luigi',
            'tipo'   => 'héroe',
            'poder'  => 75,
            'mundo'  => 'Reino Champiñón',
        ];

        $personaje = Personaje::create($datos);

        $this->assertInstanceOf(Personaje::class, $personaje);
        $this->assertDatabaseHas('personajes', $datos);
    }

    public function test_puede_actualizar_un_personaje(): void
    {
        $personaje = Personaje::factory()->create(['nombre' => 'Toad']);

        $personaje->update(['nombre' => 'Toadstool']);

        $this->assertDatabaseHas('personajes', ['nombre' => 'Toadstool']);
        $this->assertDatabaseMissing('personajes', ['nombre' => 'Toad']);
    }

    public function test_puede_eliminar_un_personaje(): void
    {
        $personaje = Personaje::factory()->create();
        $id = $personaje->id;

        $personaje->delete();

        $this->assertDatabaseMissing('personajes', ['id' => $id]);
    }

    public function test_el_modelo_usa_el_trait_has_factory(): void
    {
        $traits = class_uses_recursive(Personaje::class);

        $this->assertArrayHasKey(
            \Illuminate\Database\Eloquent\Factories\HasFactory::class,
            $traits
        );
    }

    public function test_puede_crear_multiples_personajes_con_factory(): void
    {
        Personaje::factory()->count(5)->create();

        $this->assertDatabaseCount('personajes', 5);
    }
}
