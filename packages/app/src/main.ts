// import pino from 'pino'
// import { config } from './config.js'
// import PouchDB from 'pouchdb-node'
// import scanner from './scanner.js'
// import app from '../media-scanner/app.js'
// import { MediaDatabase, MediaDocument } from '../media-scanner/types/db.js'

import { MediaScanner } from '@helper/media-scanner'

// const logger = pino(
// 	Object.assign({}, config.logger, {
// 		serializers: {
// 			err: pino.stdSerializers.err,
// 		},
// 	})
// )

// const db: MediaDatabase = new PouchDB<MediaDocument>(`_media`)

// logger.info(config)

// scanner(logger, db, config)
// app(logger, db, config).listen(config.http.port, config.http.host)

console.log('Hello World!')

const scanner = new MediaScanner()

console.log(scanner)
