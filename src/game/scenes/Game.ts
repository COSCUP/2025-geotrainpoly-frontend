import { Scene } from 'phaser'
import { HexTile } from '../../data/TileData'
import { EventBus } from '../EventBus'
import { GameData } from '../../data/GameData.ts'
import { get_hextiles } from '../../api/get_hextiles.ts'

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

  const r = Math.random()
  if (r < 0.25) {
    ret.type = 'booths'
    ret.ID = 'mysql'
  }
  else {
    ret.type = 'venue'
    ret.ID = 'TR212'
  }
  return ret
}

export class Game extends Scene {
  private contentContainer!: Phaser.GameObjects.Container
  private dragStartY = 0
  private containerStartY = 0
  private boothImages: string[]

  constructor(boothImages: string[]) {
    super('MainGame')
    this.boothImages = boothImages
  }

  preload() {
    this.boothImages.forEach((url) => {
      this.load.image('mysql', url) // TODO: replase 'mysql' with booth ID
    })
    this.load.image('eye', '../../../public/assets/eye.png')
    this.load.image('no-eye', '../../../public/assets/no-eye.png')
  }

  async create() {
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
          type: "base",
          skew: GameData.skew
        })
        this.contentContainer.add(tile)

        if (row === 0 && col === center) {
          GameData.path.push(tile)
        }
      }
    }

    const path: any[] = await get_hextiles()
    let x = GameData.path[0].centerX
    let y = GameData.path[0].centerY
    for (let idx = 0; idx < path.length; idx++) {
      const pos = this.calNextPos(x, y, path[idx].x)
      x = pos.x
      y = pos.y
      const tile = new HexTile({
        scene: this,
        x: x,
        y: y,
        size: GameData.hexSize,
        skew: GameData.skew,
        type: path[idx].type,
        ID: path[idx].booth_id
      })
      this.contentContainer.addAt(tile, 0)
      GameData.path.push(tile)
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

    const buttonSize = 60
    const canvaSize = buttonSize + 20
    const canvas = this.textures.createCanvas('eye-button', canvaSize, canvaSize)
    const ctx = canvas!.getContext()

    // set button background
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(canvaSize / 2, canvaSize / 2, buttonSize / 2 - 5, 0, Math.PI * 2)
    ctx.fill()

    // add button shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 4
    ctx.shadowOffsetY = 4
    ctx.fill()

    canvas!.refresh()

    this.add.image(GameData.screenWidth - 40, 40, 'eye-button').setOrigin(0.5)

    const infoBtn = this.add.image(GameData.screenWidth - 40, 40, 'no-eye').setOrigin(0.5).setScale(0.5).setInteractive()
    infoBtn.setScrollFactor(0)

    infoBtn.on('pointerdown', () => {
      this.showAllTileInfo(true)
      infoBtn.setTexture('eye')
    })

    infoBtn.on('pointerup', () => {
      this.showAllTileInfo(false)
      infoBtn.setTexture('no-eye')
    })

    EventBus.emit('current-scene-ready', this)
  }

  calNextPos(curX: number, curY: number, dir: number) {
    if (dir === -1) {
      return {x: curX - GameData.hexWidth * 0.75, y: curY - GameData.hexHeight * 0.5}
    }
    else if (dir === 1) {
      return {x: curX + GameData.hexWidth * 0.75, y: curY - GameData.hexHeight * 0.5}
    }
    else {
      return {x: curX, y: curY - GameData.hexHeight}
    }
  }

  chooseNextPos(curX: number, curY: number) {
    let noLeft = false
    let noRight = false

    if (GameData.path.length === 1) {
      return this.calNextPos(curX, curY, 0)
    }
    else {
      const last_curX = GameData.path[GameData.path.length - 2].centerX
      noLeft = last_curX < curX
      noRight = last_curX > curX
    }

    const r = Math.random()
    if (r < 0.35 && curX != GameData.tilePos[0] && !noLeft) {
      return this.calNextPos(curX, curY, -1)
    }
    else if (r < 0.7 && curX != GameData.tilePos[2] && !noRight) {
      return this.calNextPos(curX, curY, 1)
    }
    else {
      return this.calNextPos(curX, curY, 0)
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

  showAllTileInfo(show: boolean) {
    for (const tile of GameData.path) {
      tile.setInfoVisible(show)
    }
  }
}
