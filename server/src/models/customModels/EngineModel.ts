import { spawn, ChildProcess } from 'child_process'
import BaseEngineService from '../../services/EngineServices/baseEngineService'
import { difficultyBot } from '../../types/engineTypes'

// Constant to reduce magic numbers and strings.
const TIMEOUT_MS = 10000

class EngineModel extends BaseEngineService {
    protected engineProcess: ChildProcess | null = null
    protected depth: number = 20
    protected difficultyBot: difficultyBot = 'proffesional'

    constructor(engineProcess: ChildProcess) {
        super(engineProcess)
        this.engineProcess = engineProcess
    }

    /**
     * Starts the chess engine and sets up event handlers.
     * @param {function} callback - Callback function to handle engine status.
     */
    public startEngine(callback: (status: string) => void, difficultyBot: difficultyBot) {
        if (this.engineProcess) {
            this.difficultyBot = difficultyBot
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

export default EngineModel
