import express from 'express'
import type { Express } from 'express'
import { pinoHttp } from 'pino-http'
import cors from 'cors'
import { Logger } from 'pino'
import { MediaScannerAPI } from '@helper/media-scanner'
import { Config } from '@helper/shared'

export class HTTPServer {
	public app: Express

	constructor(
		private config: Config,
		private logger: Logger,
		private mediaScanner: MediaScannerAPI
	) {
		this.app = express()

		this.app.use(pinoHttp({ logger: this.logger }))
		this.app.use(cors())

		this.setupMediaScannerRoutes()

		this.app.use((err: any, req: express.Request, res: express.Response, _next: unknown): void => {
			if (err) req.log.error({ err })
			if (!res.headersSent) {
				res.statusCode = err ? err.status || err.statusCode || 500 : 500
				res.end()
			} else {
				res.destroy()
			}
		})

		this.app.listen(this.config.http.port, this.config.http.host ?? '0.0.0.0')
		// this.app.listen(this.config.http.port )
	}

	setupMediaScannerRoutes() {
		this.app.get(
			'/media',
			this.wrap(async (_req, res) => {
				res.set('content-type', 'application/json')
				res.send(await this.mediaScanner.getMedia())
			})
		)

		this.app.get(
			'/media/info/:id',
			this.wrap(async (req, res) => {
				res.set('content-type', 'application/json')
				res.send(await this.mediaScanner.getMediaInfo(req.params.id))
			})
		)

		this.app.get(
			'/media/thumbnail/:id',
			this.wrap(async (req, res) => {
				const data = await this.mediaScanner.getMediaThumbnail(req.params.id)
				if (!data) {
					res.status(404).end()
					return
				}
				res.set('content-type', 'image/png')
				res.send(data)
			})
		)

		this.app.get(
			'/cls',
			this.wrap(async (_req, res) => {
				res.set('content-type', 'text/plain')
				res.send(await this.mediaScanner.getCls())
			})
		)

		this.app.get(
			'/tls',
			this.wrap(async (_req, res) => {
				res.set('content-type', 'text/plain')
				res.send(await this.mediaScanner.getTls())
			})
		)

		this.app.get(
			'/templates',
			this.wrap(async (_req, res) => {
				res.set('content-type', 'application/json')
				res.send(await this.mediaScanner.getTemplates())
			})
		)

		this.app.get(
			'/fls',
			this.wrap(async (_req, res) => {
				res.set('content-type', 'text/plain')
				res.send(await this.mediaScanner.getFls())
			})
		)

		this.app.get(
			'/cinf/:id',
			this.wrap(async (req, res) => {
				res.set('content-type', 'text/plain')
				res.send(await this.mediaScanner.getCinf(req.params.id))
			})
		)

		this.app.get(
			'/thumbnail/generate',
			this.wrap(async (_req, res) => {
				res.set('content-type', 'text/plain')
				res.send(await this.mediaScanner.generateThumbnailAll())
			})
		)

		this.app.get(
			'/thumbnail/generate/:id',
			this.wrap(async (req, res) => {
				res.set('content-type', 'text/plain')
				res.send(await this.mediaScanner.generateThumbnail(req.params.id))
			})
		)

		this.app.get(
			'/thumbnail',
			this.wrap(async (_req, res) => {
				res.set('content-type', 'text/plain')
				res.send(await this.mediaScanner.getThumbnailList())
			})
		)

		this.app.get(
			'/thumbnail/:id',
			this.wrap(async (req, res) => {
				const data = await this.mediaScanner.getThumbnail(req.params.id)
				if (!data) {
					res.status(404).end()
					return
				}
				res.set('content-type', 'text/plain')
				res.send(data)
			})
		)
	}

	get port(): number {
		return this.config.http.port
	}

	private wrap(fn: express.Handler) {
		return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
			await Promise.resolve(fn(req, res, next)).catch(next)
		}
	}
}
