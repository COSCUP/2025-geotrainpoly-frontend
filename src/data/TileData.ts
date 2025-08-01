import Phaser from 'phaser'
import { EventBus } from '../game/EventBus'
import { GameData } from './GameData'

function hexToHSL(hex: number): { h: number; s: number; l: number } {
  const r = ((hex >> 16) & 0xff) / 255
  const g = ((hex >> 8) & 0xff) / 255
  const b = (hex & 0xff) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0,
    s = 0,
    l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h *= 60
  }

  return { h, s, l }
}

function HSLToHex(h: number, s: number, l: number): number {
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
  }
  return (f(0) << 16) + (f(8) << 8) + f(4)
}

function getSideColorsFromTopColor(topColor: number) {
  const { h, s, l } = hexToHSL(topColor)

  return {
    rightColor: HSLToHex(h, s, l * 0.85),
    bottomColor: HSLToHex(h, s, l * 0.75),
    leftColor: HSLToHex(h, s, l * 0.65),
  }
}

interface HexTileOptions {
  scene: Phaser.Scene
  x: number
  y: number
  size: number
  type: string
  ID?: string
  skew?: number
}

export class HexTile extends Phaser.GameObjects.Container {
  private size: number
  private color: number
  private skew: number
  private hexGraphics: Phaser.GameObjects.Graphics
  private ID: string
  type: string
  centerX: number
  centerY: number

  constructor({ scene, x, y, size, type, ID = "", skew = 0.6}: HexTileOptions) {
    super(scene, x, y-100)
    this.size = size
    this.ID = ID
    this.type = type
    this.skew = skew
    if (this.type === "base") {
      this.color = 0xD3BBDD
    }
    else if (this.type === "booths") {
      this.color = 0xFDDDE2
    }
    else if (this.type === "venue") {
      this.color = 0xECE3F0
    }
    this.centerX = x
    this.centerY = y

    this.hexGraphics = this.createHex()
    this.add(this.hexGraphics)
    // if (this.type === "booths") {
    //   const boothLogo = this.scene.add.image(0, 0, ID)
    //   const maxW = this.size * 1.5
    //   const maxH = this.size * this.skew * 1.5
    //   const scaleX = maxW / boothLogo.width
    //   const scaleY = maxH / boothLogo.height
    //   const scale = Math.min(scaleX, scaleY)
    //   boothLogo.setScale(scale)
    //   this.add(boothLogo)
    // }
    this.setSize(size * 2, Math.sqrt(3) * size * skew)
    this.setDepth(this.y)

    scene.tweens.add({
      targets: this,
      y: y,
      ease: 'Bounce',
      duration: 1000,
      delay: Phaser.Math.Between(0, 300),
    })

    this.setInteractive()

    this.on('pointerdown', () => {
      if (GameData.popupOpen) return

      this.scene.tweens.add({
        targets: this,
        y: this.y + 10,
        duration: 100,
        ease: 'Quad.easeOut'
      })
    })

    this.on('pointerup', () => {
      if (GameData.popupOpen) return
      
      this.scene.tweens.add({
        targets: this,
        y: this.centerY,
        duration: 100,
        ease: 'Quad.easeOut'
      })
      GameData.popupOpen = true
      EventBus.emit('tile-clicked', {
        type: this.type,
        ID: this.ID
      })
    })

    this.on('pointerout', () => {
      this.scene.tweens.add({
        targets: this,
        y: this.centerY,
        duration: 100,
        ease: 'Quad.easeOut'
      })
    })

    this.on('pointerupoutside', () => {
      this.scene.tweens.add({
        targets: this,
        y: this.centerY,
        duration: 100,
        ease: 'Quad.easeOut'
      })
    })
  }

  private createHex(): Phaser.GameObjects.Graphics {
    const g = this.scene.add.graphics()
    g.lineStyle(2, 0x333333, 1)

    const points = this.getHexPoints()

    const topColor = this.color
    const { rightColor, bottomColor, leftColor } =
      getSideColorsFromTopColor(topColor)

    // top
    g.fillStyle(topColor)
    g.beginPath()
    g.moveTo(points[0].x, points[0].y)
    points.forEach((p) => g.lineTo(p.x, p.y))
    g.closePath()
    g.strokePath()
    g.fillPath()

    // bottom right
    g.fillStyle(rightColor)
    g.beginPath()
    g.moveTo(points[1].x, points[1].y)
    g.lineTo(points[2].x, points[2].y)
    g.lineTo(points[2].x, points[2].y + this.size * 0.5)
    g.lineTo(points[1].x, points[1].y + this.size * 0.5)
    g.closePath()
    g.strokePath()
    g.fillPath()

    // bottom
    g.fillStyle(bottomColor)
    g.beginPath()
    g.moveTo(points[2].x, points[2].y)
    g.lineTo(points[3].x, points[3].y)
    g.lineTo(points[3].x, points[3].y + this.size * 0.5)
    g.lineTo(points[2].x, points[2].y + this.size * 0.5)
    g.closePath()
    g.strokePath()
    g.fillPath()

    // bottom left
    g.fillStyle(leftColor)
    g.beginPath()
    g.moveTo(points[0].x, points[0].y)
    g.lineTo(points[1].x, points[1].y)
    g.lineTo(points[1].x, points[1].y + this.size * 0.5)
    g.lineTo(points[0].x, points[0].y + this.size * 0.5)
    g.closePath()
    g.strokePath()
    g.fillPath()

    return g
  }

  private getHexPoints(): Phaser.Math.Vector2[] {
    const points: Phaser.Math.Vector2[] = []
    for (let i = 0; i < 6; i++) {
      const angle = Phaser.Math.DegToRad(60 * i)
      const px = this.size * Math.cos(angle)
      const py = this.size * Math.sin(angle) * this.skew
      points.push(new Phaser.Math.Vector2(px, py))
    }
    return points
  }
}
