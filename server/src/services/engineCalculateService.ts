import { ChildProcess } from "child_process";
import engineService from "./engineService";
import { Chess } from 'chess.js';

class engineCalculateServies {
    private chess: Chess = new Chess();
    private fen: string = this.chess.fen();
    private engineProcess: ChildProcess | null 
    
    private updateFen(move: string) {
        this.chess.move(move);
        this.fen = this.chess.fen();
        console.log('Updated fen position after move e4', this.fen);
    }

    public async calculateBestMoves(move: string): Promise<string[]> {
      return new Promise<string[]>((resolve, reject) => {
        this.engineProcess = engineService.getEngineProcess()
        if (!this.engineProcess) {
          reject('Engine process is not running.');
          return;
        }
    
        const bestMoves: string[] = [];
    
        this.updateFen(move);
    
        this.engineProcess.stdin?.write(`position fen ${this.fen}\n`);
    
        this.engineProcess.stdin?.write('go depth 30\n');
    
        this.engineProcess.stdout?.on('error', (error) => {
          console.error('Error in engine stdout:', error);
          reject('Error in engine stdout');
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
            resolve(bestMoves);
          }
        });
    
        this.engineProcess.on('error', (error) => {
          console.error('Error in engine process:', error);
          reject('Error in engine process');
        });
    
        this.engineProcess.on('close', (code) => {
          if (code !== 0) {
            console.error(`Engine process closed with code ${code}`);
            reject(`Engine process closed with code ${code}`);
          }
        });
      });
    }
       
    
      private extractBestMoves(output: string): string[] {
        const moves: string[] = [];
        const lines = output.split('\n');
    
        for (const line of lines) {
          if (line.includes('bestmove')) {
            const match = line.match(/bestmove\s+(\S+)/);
            if (match && match[1] !== null) {
              const move: string = match[1];
              moves.push(move);
            }
          }
        }
    
        return moves.slice(0, 10); // Возвращаем первые 3 лучших хода
      }
}

export default new engineCalculateServies();
