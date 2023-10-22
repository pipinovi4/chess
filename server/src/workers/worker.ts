import { Worker, isMainThread, parentPort } from 'worker_threads'
import EngineCalculateService from '../services/EngineServices/engineCalculateService'
import EngineService from '../services/EngineServices/engineService'
import { ChildProcess, spawn } from 'child_process'
import path from 'path'
import chalk from 'chalk'

//Depth, magic number for engine
const DEPTH = 20

// Define the path to the Stockfish engine executable
const enginePath = path.join(__dirname, '..', '..', 'engine', 'stockfish.exe')

if (!isMainThread) {
    let engineService: EngineService
    let engineProcess: ChildProcess
    let engineCalculateService: EngineCalculateService

    // Listen for messages from the parent thread
    parentPort.on('message', async (payload) => {
        console.log(payload)
        switch (payload.message) {
            case 'start-engine':
                // Spawn a child process for the Stockfish engine
                engineProcess = spawn(enginePath)

                // Create an instance of the EngineService
                engineService = new EngineService(engineProcess, DEPTH)

                // Create an instance of EngineCalculateService to calculate the best move

                engineCalculateService = new EngineCalculateService(
                    engineProcess,
                    DEPTH
                )

                // Start the chess engine
                console.log('Starting the engine...')
                engineService.startEngine((status: string) => {
                    console.log(chalk.bgWhite(), 'Status:', status)
                })

                // Notify the parent thread that the engine has started
                parentPort.postMessage({ message: 'ENGINE_STARTED' })
                break

            case 'calculate-move':
                console.log('Calculating the best move...')
                await engineCalculateService.calculateBestMovesAndScore(
                    payload.move
                )
                parentPort.postMessage({
                    message: 'MOVE_CALCULATED',
                    bestMoves: engineCalculateService.bestMoves,
                    pawnAdvantage: engineCalculateService.pawnAdvantage,
                })
                break

            case 'stop-engine':
                console.log(chalk.bgGreen(), 'Stopping the engine...')
                engineService.stopEngine((status: string) => {
                    console.log(chalk.bgWhite, 'Status:', status)
                })
                break
        }
    })
}
