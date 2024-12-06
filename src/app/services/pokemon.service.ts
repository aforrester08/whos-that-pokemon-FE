import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root', // Provides this service globally
})
export class PokemonService {
  private apiUrl = 'http://localhost:8081/api/v1/pokemon';

  constructor(private http: HttpClient) {}

  getRandomPokemon() {
    return this.http.get<{ id: string; answers: string[]; silhouette: string }>(`${this.apiUrl}/random`);
  }

  verifyAnswer(pokemonId: string, answer: string) {
    const endpoint = `${this.apiUrl}/verify?pokemon_id=${pokemonId}&pokemon_answer_name=${answer}`;
    return this.http.get<{ name: string; image: string; is_correct: boolean }>(endpoint);
  }
}
