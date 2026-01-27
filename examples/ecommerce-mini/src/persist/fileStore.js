import fs from 'fs'
import path from 'path'

export class FileStore {
  constructor(filePath) {
    this.filePath = filePath
    this.data = new Map()
    this.load()
  }

  load() {
    if (fs.existsSync(this.filePath)) {
      try {
        const content = fs.readFileSync(this.filePath, 'utf-8')
        const json = JSON.parse(content)
        if (Array.isArray(json)) {
          // Assuming array of objects with 'id'
          json.forEach(item => {
             if (item.id) this.data.set(item.id, item)
             // Special case for cart where key is userId
             if (item.userId && !item.id) this.data.set(item.userId, item)
          })
        }
      } catch (e) {
        console.error(`Failed to load ${this.filePath}`, e)
      }
    }
  }

  saveAll(items) {
    const json = Array.from(items)
    fs.writeFileSync(this.filePath, JSON.stringify(json, null, 2))
  }

  get(id) {
    return this.data.get(id)
  }

  set(id, item) {
    this.data.set(id, item)
    this.saveAll(this.data.values())
  }
  
  values() {
      return this.data.values()
  }
}
