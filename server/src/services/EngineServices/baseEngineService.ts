import { ChildProcess } from 'child_process'

/**
 * Base class for services working with a chess engine.
 */
class BaseEngineService {
    protected engineProcess: ChildProcess | null = null

    /**
     * Creates a new instance of BaseEngineService.
     * @param {ChildProcess} engineProcess - The engine process.
     */
    constructor(engineProcess: ChildProcess) {
        this.engineProcess = engineProcess
    }

    /**
     * Handles data received from the engine.
     * @param {Buffer} data - Data from the engine.
     * @param {function} callback - Callback function.
     * @param {function} eventFunction - Function to process the data.
     */
    protected onEngineData(
        data: Buffer,
        callback: (status: string) => void,
        eventFunction: (dataText: string) => void
    ) {
        const dataText = data.toString()
        eventFunction(dataText)

        if (dataText.match(/bestmove\s\w{4}\sponder\s\w{4}/)) {
            console.log('Calculated move end')
            callback('Engine calculation complete')
        }
    }

    /**
     * Handles an error in the engine process.
     * @param {Error} error - The error object.
     * @param {function} callback - Callback function.
     */
    protected handleEngineError(
        error: Error,
        callback: (status: string) => void
    ) {
        callback('Error in the engine process: ' + error.message)
    }

    /**
     * Handles the closure of the engine process.
     * @param {number} code - The exit code of the process.
     * @param {NodeJS.Timeout} timeoutId - Timer identifier.
     * @param {function} callback - Callback function.
     */
    protected handleEngineClose(
        code: number,
        timeoutId: NodeJS.Timeout,
        callback: (status: string) => void
    ) {
        clearTimeout(timeoutId)
        if (code !== 0) {
            callback(`Engine process closed with code ${code}`)
        }
    }
}

export default BaseEngineService
