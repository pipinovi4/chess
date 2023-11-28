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
            console.log(this.engineProcess)
            this.difficultyBot = difficultyBot
            this.engineProcess.on('error', (error) => {
                this.handleEngineError(error, callback)
            })

            this.engineProcess.on('close', (code) => {
                this.handleEngineClose(code, callback)
            })
        }
    }
}

export default EngineModel
