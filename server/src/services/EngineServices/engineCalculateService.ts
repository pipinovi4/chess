import { ChildProcess } from 'child_process'
import { Chess } from 'chess.js'
import ApiError from '../../exceptions/ApiError'
import EngineModel from '../../models/customModels/EngineModel'

class EngineCalculateService extends EngineModel {
    private chess: Chess = new Chess()
    private fen: string = this.chess.fen()
    public bestMoves: string[] = []
    public pawnAdvantage: number | string = 0
    public currentStrokeRate = this.bestMoves.length - 1

    constructor(engineProcess: ChildProcess) {
        super(engineProcess)

        // Set up an event handler for the 'data' event when creating an instance of the class
        this.engineProcess.stdout?.on('data', (data) => {
            const dataText = data.toString() // Use data.toString() to convert Buffer to string
            this.onEngineData(
                data,
                (status) => {
                    // Handling the event when data is received from the engine
                    console.log('Status:', status)
                },
                () => this.extractUsefulData(dataText) // Wrap the call in a function
            )
        })
    }

    /**
     * Updates the FEN (Forsyth-Edwards Notation) after making a move in Algebraic notation.
     *
     * @param {string} move - The move in Algebraic notation.
     */
    private updateFen(move: string) {
        this.chess.move(move)
        this.fen = this.chess.fen()
        console.log(this.fen)
    }

    /**
     * Calculate the best moves and evaluation score.
     * @param {string} move - The move in Algebraic notation.
     * @param {difficultyBot} difficultyBot - difficulty bot 
     * @returns {Promise<void>} A Promise that resolves when the calculation is complete.
     */
    public async calculateBestMovesAndScore(move: string): Promise<number | void> {
        return new Promise<number | void>((resolve, reject) => {
            if (this.bestMoves.length !== 0) {
                this.bestMoves = []
            }
            if (!this.engineProcess) {
                throw ApiError.BadRequest('Engine process undefined')
            }

            let listening = true

            const onEngineData = (dataText: string) => {
                if (
                    listening &&
                    dataText.match(/bestmove\s\w{4}(?:\sponder\s\w{4})?/)
                ) {
                    console.log('resolve')
                    listening = false
                    this.currentStrokeRate = this.extractDifficaltyBot()
                    console.log(this.currentStrokeRate, this.bestMoves)
                    this.chess.move(this.bestMoves[this.currentStrokeRate])
                    resolve(this.currentStrokeRate)
                }
            }

            const onData = (data: Buffer) => {
                const dataText = data.toString()
                onEngineData(dataText)
            }

            this.updateFen(move)

            this.engineProcess.stdin?.write(`position fen ${this.fen}\n`)
            this.engineProcess.stdin?.write(`go depth ${this.depth}\n`)

            this.engineProcess.stdout?.on('data', onData)

            this.engineProcess.stdout?.once('error', (error) => {
                this.handleEngineError(error, (status) => {
                    // Handling the event when data is received from the engine
                    console.log('Status:', status)
                })
                listening = false
                console.log('dsadasndjarea', this.bestMoves)
                reject()
            })
        })
    }

    /**
     * Extracts useful data from the provided text and resolves a Promise with the result.
     * @param {string} dataText - The text to extract data from.
     */
    private extractUsefulData(dataText: string) {
        const moveMatch = dataText.match(/info depth \d+[^]+pv\s+([\w\d]+)/)

        if (moveMatch && moveMatch[1]) {
            this.bestMoves = this.bestMoves.filter((move) => {
                return move !== moveMatch[1]
            })
            this.bestMoves.push(moveMatch[1])
        }

        if (dataText.includes(`depth ${this.depth}`)) {
            const pawnAdvantageMatch = dataText.match(/score cp (-?\d+)/)
            const mateStepsMatch = dataText.match(/score mate (-?\d+)/)

            if (pawnAdvantageMatch) {
                this.pawnAdvantage = parseInt(pawnAdvantageMatch[1], 10) / 100.0
            } else if (mateStepsMatch) {
                this.pawnAdvantage = parseInt(mateStepsMatch[1], 10).toString()
            }
        }
    }

    public extractDifficaltyBot() {
        const randomNumber = Math.random()
        if (this.difficultyBot === 'begginer') {
            if (this.bestMoves.length > 1) {
                return randomNumber > 0.5 ? 0 : 1
            }
            return 0
        }
        if (this.difficultyBot === 'amateur') {
            if (this.bestMoves.length > 2) {
                return randomNumber > 0.5 ? 1 : 2
            } else if (this.bestMoves.length > 1) {
                return 1
            } 
            return 1
        }
        if (this.difficultyBot === 'proffesional') {
            return this.bestMoves.length - 1
        }
    }

    get _currentStrokeRate() {
        return this.currentStrokeRate
    }
    get _pawnAdvantage() {
        return this.pawnAdvantage
    }
    get _bestMoves() {
        return this.bestMoves
    }
}

export default EngineCalculateService
