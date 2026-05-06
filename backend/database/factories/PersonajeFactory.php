<?php

namespace Database\Factories;

use App\Models\Personaje;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Personaje>
 */
class PersonajeFactory extends Factory
{
    protected $model = Personaje::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nombre' => fake()->name(),
            'tipo'   => fake()->randomElement(['héroe', 'villano', 'aliado', 'jefe']),
            'poder'  => fake()->numberBetween(1, 100),
            'mundo'  => fake()->randomElement(['Reino Champiñón', 'Mundo 1', 'Galaxia', 'Castillo']),
        ];
    }
}
