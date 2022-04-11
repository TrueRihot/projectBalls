import { Player } from "./Player";

export default interface GameState {
  hasStarted: boolean;
  isPaused: boolean;
  isLoaded: boolean;



  players: Player[];
  activePlayer: Player | null,
  activePlayerId: string;
  // activePlayerColor: string;
  // pass player-states here? Player.ts
}
