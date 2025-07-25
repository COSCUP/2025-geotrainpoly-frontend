import type { Types } from 'phaser'
import { AUTO, Game } from 'phaser'
import { Game as MainGame } from './scenes/Game'
import { get_booths_images } from '../api/get_booths.ts'

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Types.Core.GameConfig = {
  type: AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  parent: "game-container",
  backgroundColor: "#EFE7D3"
}

export async function StartGame(parent: string): Promise<Phaser.Game> {
  const boothImages: string[] = await get_booths_images()

  const scene = new MainGame(boothImages)

  return new Game({
    ...config,
    parent,
    scene: [scene],
  })
}

export default StartGame
