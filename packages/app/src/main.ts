// import pino from 'pino'
// import { config } from './config.js'
// import PouchDB from 'pouchdb-node'
// import scanner from './scanner.js'
// import app from '../media-scanner/app.js'
// import { MediaDatabase, MediaDocument } from '../media-scanner/types/db.js'

import { MediaScanner, MediaScannerAPI } from '@helper/media-scanner'
import { initializeLogger } from './logger.js'
import { HTTPServer } from './http-server.js'
import { getConfig } from './config.js'

const config = getConfig()
const logger = initializeLogger(config)

const mediaScanner = new MediaScanner(logger, config)
const mediaScannerApi = new MediaScannerAPI(config, mediaScanner.db)
const httpServer = new HTTPServer(config, logger, mediaScannerApi)

console.log('Running')
console.log('Media scanner API running on http://localhost:' + httpServer.port)

// console.log(httpServer)
