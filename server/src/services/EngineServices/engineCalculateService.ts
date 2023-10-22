import { ChildProcess } from 'child_process'
import { Chess } from 'chess.js'
import EngineService from './engineService'
import ApiError from '../../exceptions/ApiError'

class EngineCalculateService extends EngineService {
    private chess: Chess = new Chess()
    private fen: string = this.chess.fen()
    public bestMoves: string[] = []
    public pawnAdvantage: number = 0

    constructor(engineProcess: ChildProcess, depth: number) {
        super(engineProcess, depth)

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
    }

    /**
     * Calculate the best moves and evaluation score.
     * @param {string} move - The move in Algebraic notation.
     * @returns {Promise<void>} A Promise that resolves when the calculation is complete.
     */
    public async calculateBestMovesAndScore(move: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.bestMoves.length !== 0) {
                this.bestMoves = []
            }
            if (!this.engineProcess) {
                throw ApiError.BadRequest('Engine process undefined')
            }
    
            let listening = true;
    
            const onEngineData = (dataText: string) => {
                if (listening && dataText.match(/bestmove\s\w*\sponder\s\w*/)) {
                    console.log('resolve');
                    listening = false; 
                    resolve();
                }
            }
    
            const onData = (data: Buffer) => {
                const dataText = data.toString();
                onEngineData(dataText);
            };
    
            this.updateFen(move);
    
            this.engineProcess.stdin?.write(`position fen ${this.fen}\n`);
            this.engineProcess.stdin?.write(`go depth ${this.depth}\n`);
    
            this.engineProcess.stdout?.on('data', onData);
    
            this.engineProcess.stdout?.once('error', (error) => {
                this.handleEngineError(error, (status) => {
                    // Handling the event when data is received from the engine
                    console.log('Status:', status);
                });
                listening = false;
                reject();
            });
        });
    }
    

    /**
     * Extracts useful data from the provided text and resolves a Promise with the result.
     * @param {string} dataText - The text to extract data from.
     */
    private extractUsefulData(dataText: string) {
        const moveMatch = dataText.match(/info[^]+pv\s+([\w\d]+)/)

        if (moveMatch && moveMatch[1]) {
            this.bestMoves = this.bestMoves.filter((move) => {
                return move !== moveMatch[1]
            })
            this.bestMoves.push(moveMatch[1])
        }

        if (dataText.includes(`depth ${this.depth}`)) {
            const pawnAdvantageMatch = dataText.match(/score cp (-?\d+)/)
            if (pawnAdvantageMatch) {
                this.pawnAdvantage = parseInt(pawnAdvantageMatch[1], 10) / 100.0
            }
        }
    }
}

export default EngineCalculateService
