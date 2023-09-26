import { spawn, ChildProcess } from 'child_process'

const enginePath =
    'C:/Users/Пипин/Downloads/stockfish-windows-x86-64-modern2/stockfish/stockfish-windows-x86-64-modern.exe'

class EngineService {
    private engineProcess: ChildProcess | null

    constructor() {
        this.engineProcess = null
    }

    public startEngine(callback: (status: string) => void) {
        if (!this.engineProcess) {
            this.engineProcess = spawn(enginePath)

            console.log(this.engineProcess)

            // Обработка вывода движка (пример)
            this.engineProcess.stdout?.on('data', (data) => {
                console.log(`Engine Output: ${data.toString()}`)
            })

            // Обработка ошибок (пример)
            this.engineProcess.on('error', (error) => {
                console.error(`Engine Error: ${error.message}`)
                callback(`Error starting engine: ${error.message}`)
            })

            // Обработка завершения процесса (пример)
            this.engineProcess.on('close', (code) => {
                console.log(`Engine Exited with Code ${code}`)
                if (code === 0) {
                    callback('Engine started successfully')
                } else {
                    callback(`Engine exited with code ${code}`)
                }
            })
        } else {
            callback('Engine is already running')
        }
    }

    // Метод для отправки команды движку
    public sendCommand(command: string) {
        if (this.engineProcess) {
            this.engineProcess.stdin?.write(`${command}\n`)
        } else {
            console.error('Engine is not running. Start it first.')
        }
    }

    public calculateBestMoves(fen: string, depth: number, callback: (status: string, error?: string) => void) {
        if (!this.engineProcess) {
            return callback("Engine process is not running.");
        }
    
        const bestMoves: string[] = [];
    
        this.engineProcess.stdout?.on('error', (error) => {
            console.error('Error in engine stdout:', error);
            callback("Error in engine stdout", error.message);
        });
    
        this.engineProcess.stdout?.on('data', (data) => {
            const output = data.toString();
            const moves = this.extractBestMoves(output);
    
            for (const move of moves) {
                if (!bestMoves.includes(move)) {
                    bestMoves.push(move);
                }
            }
    
            if (bestMoves.length >= 3) {
                console.log('Best Moves:', bestMoves);
                this.engineProcess?.kill(); 
                callback("Calculation completed successfully");
            }
        });
    
        this.engineProcess.on('error', (error) => {
            console.error('Error in engine process:', error);
            callback("Error in engine process", error.message);
        });
    
        this.engineProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`Engine process closed with code ${code}`);
                callback(`Engine process closed with code ${code}`);
            }
        });
    }
    

    private extractBestMoves(output: string): string[] {
        const moves: string[] = []
        const lines = output.split('\n')

        for (const line of lines) {
            if (line.includes('bestmove')) {
                const match = line.match(/bestmove\s+(\S+)/)
                if (match && match[1] !== null) {
                    const move: string = match[1]
                    moves.push(move)
                }
            }
        }

        return moves.slice(0, 3) // Возвращаем первые 3 лучших хода
    }

    // Метод для просчета хода с заданной глубиной
    public calculateMove(move: string, depth: number) {
        // Пример: отправка команды "go depth <глубина> movetime 10000"
        this.sendCommand(`go depth ${depth} movetime 10000 ${move}`)
    }

    public stopEngine(callback: (status: string) => void) {
        if (this.engineProcess) {
            this.engineProcess.kill()
            this.engineProcess = null
            console.log(this.engineProcess)
        }
    }
}

export default new EngineService()
