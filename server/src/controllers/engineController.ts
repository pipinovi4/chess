import { Request, Response, NextFunction } from 'express'
import engineService from '../services/engineService'
import workerConfig from '../worker'

class EngineController {
    async startEngine(req: Request, res: Response, next: NextFunction) {
        try {
            const worker = await workerConfig('start-engine')

            worker.on('message', (message: string) => {
                console.log('Received message from worker:', message)
                res.status(200).json({ message: 'Engine started successfully' })
            })

            worker.on('error', (error) => {
                console.error('Error in worker:', error)
                return next(error)
            })
        } catch (e) {
            console.error('Failed to start the engine', e)
            return next(e)
        }
    }

    async stopEngine(req: Request, res: Response, next: NextFunction) {
        try {
            const worker = await workerConfig('stop-engine')

            worker.on('message', (message: string) => {
                console.log(message)
                console.log('Engine stopped')
                res.status(200).json({ message: 'Engine stopped successfully' })
            })

            worker.on('error', (error: Error) => {
                console.error('Worker error:', error)
                res.status(500).json({ message: 'Error stopping the engine' })
            })
        } catch (e) {
            console.error('Error when stopping the engine', e)
            next(e)
        }
    }
}

export default new EngineController()
