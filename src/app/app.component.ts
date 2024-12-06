import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PokemonService } from './services/pokemon.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'whos-that-pokemon-fe';
  answers: string[] = [];
  silhouette: string | null = null;
  resultMessage: string | null = null;
  correct_id: string | null = null;
  isLoading: boolean | null = null;
  score: number = 0;
  wrongGuesses: number = 0;
  maxWrongGuesses: number = 3;
  gameOver: boolean = false;
  pokeballs: string[] = [
    'assets/pokeball.png',
    'assets/pokeball.png',
    'assets/pokeball.png'
  ];
  highScore = 0;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.fetchPokemonData();
  }

  fetchPokemonData() {
    if (this.gameOver) return;
    this.isLoading = true;
    // bug where after a game restart it still shows the inccorect message and changes pokemon after 2 sec
    this.pokemonService.getRandomPokemon().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.correct_id = response.id;
        this.answers = response.answers;
        this.silhouette = response.silhouette;
        this.resultMessage = null;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching Pokémon data:', error);
        this.resultMessage = 'Failed to load Pokémon data. Please try again later.';
      }
    });
  }

  verifyAnswer(answer: string) {
    if (!this.correct_id) {
      console.error('No correct ID is available to verify the answer.');
      return;
    }
    
    this.pokemonService.verifyAnswer(this.correct_id, answer).subscribe({
      next: (response) => {
        if (response.name === answer) {
          this.resultMessage = `Correct! 🎉 It's ${response.name}!`;
          this.silhouette = response.image;
          this.score++;

          if (this.score > this.highScore) {
            this.highScore = this.score;
          }

          setTimeout(() => {
            this.fetchPokemonData();
          }, 2000); 
        } else {
          this.resultMessage = 'Wrong answer. Try again! 😞';
          this.wrongGuesses++;

          if (this.wrongGuesses >= this.maxWrongGuesses) {
            this.gameOver = true;
          }
        }
      },
      error: (error) => {
        console.error('Error verifying answer:', error);
        this.resultMessage = 'An error occurred while verifying the answer.';
      }
    });
  }

  resetGame() {
    this.score = 0;
    this.wrongGuesses = 0;
    this.gameOver = false;
    this.fetchPokemonData(); // Start with a new Pokémon
  }
}
