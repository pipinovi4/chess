import { spawn, ChildProcess } from 'child_process'
import BaseEngineService from '../../services/EngineServices/baseEngineService'

// Constant to reduce magic numbers and strings.
const TIMEOUT_MS = 10000

class EngineService extends BaseEngineService {
    protected engineProcess: ChildProcess | null = null
    protected depth: number | null = 20

    constructor(engineProcess: ChildProcess, depth: number) {
        super(engineProcess)
        this.engineProcess = engineProcess
        this.depth = depth
    }

    /**
     * Starts the chess engine and sets up event handlers.
     * @param {function} callback - Callback function to handle engine status.
     */
    public startEngine(callback: (status: string) => void) {
        if (this.engineProcess) {
            this.engineProcess.on('error', (error) => {
                this.handleEngineError(error, callback)
            })

            this.engineProcess.on('close', (code) => {
                this.handleEngineClose(code, callback)
            })
        }
    }

    /**
     * Stops the chess engine and cleans up resources.
     * @param {function} callback - Callback function to handle engine status.
     */
    public stopEngine(callback: (status: string) => void) {
        if (this.engineProcess) {
            this.engineProcess.kill()
            this.engineProcess = null
        }
        callback('Engine stopped')
    }
}

export default EngineService
