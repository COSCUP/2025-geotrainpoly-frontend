import { HexTile } from "./TileData"

export const GameData = {
  skew: 0.6,
  path: [] as HexTile[],
  screenWidth: 0,
  screenHeight: 0,
  hexSize: 0,
  bottomBarHeight: 70,
  popupOpen: false,
  apiBaseUrl: 'https://coscup.mirumo.cc/api',
  get apiToken() {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('token')
  },
  get hexWidth() {
    return this.hexSize * 2
  },
  get hexHeight() {
    return Math.sqrt(3) * this.hexSize * this.skew
  },
  get tilePos() {
    return [this.hexWidth * 0.75, this.hexWidth * 1.5, this.hexWidth * 2.25]
  }
}