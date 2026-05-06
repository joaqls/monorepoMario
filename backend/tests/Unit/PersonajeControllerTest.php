<?php

namespace Tests\Unit;

use App\Models\Personaje;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PersonajeControllerTest extends TestCase
{
    use RefreshDatabase;

    // ---------------------------------------------------------------
    // INDEX
    // ---------------------------------------------------------------

    public function test_index_devuelve_lista_de_personajes_con_codigo_200(): void
    {
        Personaje::factory()->count(3)->create();

        $response = $this->getJson('/api/personajes');

        $response->assertStatus(200);
        $response->assertJsonCount(3);
    }

    public function test_index_devuelve_array_json_vacio_cuando_no_hay_personajes(): void
    {
        $response = $this->getJson('/api/personajes');

        $response->assertStatus(200);
        $response->assertExactJson([]);
    }

    public function test_index_devuelve_estructura_json_correcta(): void
    {
        Personaje::factory()->create([
            'nombre' => 'Mario',
            'tipo'   => 'héroe',
            'poder'  => 90,
            'mundo'  => 'Reino Champiñón',
        ]);

        $response = $this->getJson('/api/personajes');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => ['id', 'nombre', 'tipo', 'poder', 'mundo', 'created_at', 'updated_at'],
        ]);
    }

    // ---------------------------------------------------------------
    // STORE
    // ---------------------------------------------------------------

    public function test_store_crea_un_personaje_y_devuelve_codigo_201(): void
    {
        $datos = [
            'nombre' => 'Bowser',
            'tipo'   => 'villano',
            'poder'  => 99,
            'mundo'  => 'Castillo',
        ];

        $response = $this->postJson('/api/personajes', $datos);

        $response->assertStatus(201);
        $this->assertDatabaseHas('personajes', $datos);
    }

    public function test_store_devuelve_el_personaje_creado_en_json(): void
    {
        $datos = [
            'nombre' => 'Peach',
            'tipo'   => 'aliada',
            'poder'  => 60,
            'mundo'  => 'Reino Champiñón',
        ];

        $response = $this->postJson('/api/personajes', $datos);

        $response->assertStatus(201);
        $response->assertJsonFragment($datos);
        $response->assertJsonStructure(['id', 'nombre', 'tipo', 'poder', 'mundo']);
    }

    // ---------------------------------------------------------------
    // SHOW
    // ---------------------------------------------------------------

    public function test_show_devuelve_un_personaje_existente_con_codigo_200(): void
    {
        $personaje = Personaje::factory()->create();

        $response = $this->getJson("/api/personajes/{$personaje->id}");

        $response->assertStatus(200);
        $response->assertJsonFragment(['id' => $personaje->id, 'nombre' => $personaje->nombre]);
    }

    public function test_show_devuelve_404_para_personaje_inexistente(): void
    {
        $response = $this->getJson('/api/personajes/9999');

        $response->assertStatus(404);
    }

    public function test_show_devuelve_estructura_json_correcta(): void
    {
        $personaje = Personaje::factory()->create();

        $response = $this->getJson("/api/personajes/{$personaje->id}");

        $response->assertStatus(200);
        $response->assertJsonStructure(['id', 'nombre', 'tipo', 'poder', 'mundo', 'created_at', 'updated_at']);
    }

    // ---------------------------------------------------------------
    // UPDATE
    // ---------------------------------------------------------------

    public function test_update_actualiza_un_personaje_y_devuelve_codigo_200(): void
    {
        $personaje = Personaje::factory()->create(['nombre' => 'Mario']);

        $response = $this->putJson("/api/personajes/{$personaje->id}", ['nombre' => 'Super Mario']);

        $response->assertStatus(200);
        $this->assertDatabaseHas('personajes', ['id' => $personaje->id, 'nombre' => 'Super Mario']);
    }

    public function test_update_devuelve_el_personaje_actualizado_en_json(): void
    {
        $personaje = Personaje::factory()->create(['poder' => 50]);

        $response = $this->putJson("/api/personajes/{$personaje->id}", ['poder' => 100]);

        $response->assertStatus(200);
        $response->assertJsonFragment(['poder' => 100]);
    }

    public function test_update_devuelve_404_para_personaje_inexistente(): void
    {
        $response = $this->putJson('/api/personajes/9999', ['nombre' => 'Nadie']);

        $response->assertStatus(404);
    }

    // ---------------------------------------------------------------
    // DESTROY
    // ---------------------------------------------------------------

    public function test_destroy_elimina_un_personaje_y_devuelve_mensaje_json(): void
    {
        $personaje = Personaje::factory()->create();

        $response = $this->deleteJson("/api/personajes/{$personaje->id}");

        $response->assertStatus(200);
        $response->assertJson(['mensaje' => 'Eliminado']);
        $this->assertDatabaseMissing('personajes', ['id' => $personaje->id]);
    }

    public function test_destroy_devuelve_404_para_personaje_inexistente(): void
    {
        $response = $this->deleteJson('/api/personajes/9999');

        $response->assertStatus(404);
    }
}
