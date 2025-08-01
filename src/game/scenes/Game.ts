import { Scene } from 'phaser'
import { HexTile } from '../../data/TileData'
import { EventBus } from '../EventBus'
import { GameData } from '../../data/GameData.ts'

function randomData(scene: Phaser.Scene, x: number, y: number) {
  const ret = {
    scene: scene,
    x: x,
    y: y,
    size: GameData.hexSize,
    skew: GameData.skew,
    type: '',
    ID: ''
  }

  // const r = Math.random()
  // if (r < 0.25) {
  //   ret.type = 'Booths'
  //   const index = Math.min(Math.floor(Math.random() * GameData.boothIDs.length), GameData.boothIDs.length - 1)
  //   ret.ID = GameData.boothIDs[index]
  // }
  // else {
    ret.type = 'Venue'
    ret.ID = 'TR212'
  // }
  return ret
}

export class Game extends Scene {
  private contentContainer!: Phaser.GameObjects.Container
  private dragStartY = 0
  private containerStartY = 0
  private boothIDs: string[]

  constructor(boothIDs: string[]) {
    super('MainGame')
    this.boothIDs = boothIDs
  }

  // preload() {
  //   this.boothIDs.forEach((key) => {
  //     const url = `https://coscup.org/2024/images/sponsor/${key}.png`
  //     this.load.image(key, url)
  //   })
  //   GameData.boothIDs = this.boothIDs
  // }

  create() {
    GameData.screenWidth = this.cameras.main.width
    GameData.screenHeight = this.cameras.main.height
    GameData.hexSize = GameData.screenWidth / 6

    const spacingX = GameData.hexWidth * 1.5
    const spacingY = GameData.hexHeight * 0.5
    const cols = GameData.screenWidth / spacingX + 1
    const rows = 4
    const center = Math.round(cols / 2) - 1
    const startY = GameData.screenHeight - spacingY * (rows + 1)
    const startX = 0

    this.contentContainer = this.add.container(0, 0)

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const offsetX = (row % 2) * GameData.hexSize * 1.5
        const x = startX + col * spacingX + offsetX
        const y = startY + row * spacingY

        const tile = new HexTile({
          scene: this,
          x: x,
          y: y,
          size: GameData.hexSize,
          type: "Base",
          skew: GameData.skew
        })
        this.contentContainer.add(tile)

        if (row === 0 && col === center) {
          GameData.path.push(tile)
        }
      }
    }

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.dragStartY = pointer.y
      this.containerStartY = this.contentContainer.y
    })

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) {
        const deltaY = pointer.y - this.dragStartY
        const lastTile = GameData.path[GameData.path.length - 1]
        const maxY =  GameData.screenHeight * 0.5 - lastTile.centerY
        this.contentContainer.y = this.containerStartY + deltaY

        this.contentContainer.y = Phaser.Math.Clamp(this.contentContainer.y, 0, maxY)
      }
    })

    // This is for testing
    this.input.keyboard?.on('keydown-SPACE', () => {
      if (GameData.popupOpen) return
      this.addNextHexTile()
    })

    EventBus.emit('current-scene-ready', this)
  }

  chooseNextPos(curX: number, curY: number) {
    let noLeft = false
    let noRight = false

    if (GameData.path.length === 1) {
      return {x: curX, y: curY - GameData.hexHeight}
    }
    else {
      const last_curX = GameData.path[GameData.path.length - 2].centerX
      noLeft = last_curX < curX
      noRight = last_curX > curX
    }

    const r = Math.random()
    if (r < 0.35 && curX != GameData.tilePos[0] && !noLeft) {
      return {x: curX - GameData.hexWidth * 0.75, y: curY - GameData.hexHeight * 0.5}
    }
    else if (r < 0.7 && curX != GameData.tilePos[2] && !noRight) {
      return {x: curX + GameData.hexWidth * 0.75, y: curY - GameData.hexHeight * 0.5}
    }
    else {
      return {x: curX, y: curY - GameData.hexHeight}
    }
  }

  addNextHexTile() {
    const lastTile = GameData.path[GameData.path.length - 1]
    const pos = this.chooseNextPos(lastTile.centerX, lastTile.centerY)
    const tile = new HexTile(randomData(this, pos.x, pos.y))
    this.contentContainer.addAt(tile, 0)
    GameData.path.push(tile)
    this.contentContainer.y = Math.max(GameData.screenHeight * 0.5 - lastTile.y, 0)
    this.tweens.add({
      targets: this.contentContainer,
      y: Math.max(GameData.screenHeight * 0.5 - pos.y, 0),
      duration: 1000,
      ease: 'Sine.easeInOut',
    })
  }
}
