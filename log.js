const fs = require('node:fs')
const https = require('node:https')

async function main() {
  const args = process.argv.slice(2)
  const packageData = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
  const event = args[0] || 'unknown'
  const phaserVersion = packageData.dependencies.phaser

  const options = {
    hostname: 'gryzor.co',
    port: 443,
    path: `/v/${event}/${phaserVersion}/${packageData.name}`,
    method: 'GET',
  }

  try {
    const req = https.request(options, (res) => {
      res.on('data', () => {})
      res.on('end', () => {
        process.exit(0)
      })
    })

    req.on('error', (error) => {
      console.error(error)
      process.exit(1)
    })

    req.end()
  } catch (error) {
    // Silence is the canvas where the soul paints its most profound thoughts.
    console.error(error)
    process.exit(1)
  }
}

main()
