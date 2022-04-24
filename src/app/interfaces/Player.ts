import { Ball } from "../components/threejs-scene/game/World/Ball.class";

export interface Player {
  id: string,
  name: string;
  winCount: number;

  color: string;
  remainingBalls: Ball[];
}
