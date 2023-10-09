import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import { Worker } from 'worker_threads';
import ApiError from '../exceptions/ApiError';

const workerPath = path.join(__dirname, '..', 'workers', 'worker.js');

class EngineService {
  private engineProcess: ChildProcess | null = null;
  private engineWorker: Worker | null = null;
    default: any;

  private async createWorker(): Promise<void> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(workerPath)
      this.engineWorker = worker
      resolve()
    })
  }

  public async getEngineWorker() {
    try {
      if (!this.engineWorker) {
        console.log('The worker doesn not exist, create a new worker and start the engine');
        await this.createWorker();
        this.startEngine((status) => console.log(status));
      }
      return this.engineWorker;
    } catch (error) {
      console.error(error);
      throw ApiError.UnforseenError();
    }
  }
  

  public getEngineProcess() {
    if (this.engineProcess) {
      return this.engineProcess
    }
  }

  public async startEngine(callback: (status: string) => void): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (this.engineProcess) {
        callback('Engine is already running');
        resolve();
        return;
      }
  
      const enginePath = path.join(__dirname, '..', '..', 'engine', 'stockfish.exe');
      this.engineProcess = spawn(enginePath);
  
      this.engineProcess.stdout?.on('data', (data) => {
        console.log(`Engine Output: ${data.toString()}`);
      });
  
      this.engineProcess.on('error', (error) => {
        console.error(`Engine Error: ${error.message}`);
        callback(`Error starting engine: ${error.message}`);
        reject(error);
      });
  
      this.engineProcess.on('close', (code) => {
        console.log(`Engine Exited with Code ${code}`);
        if (code === 0) {
          callback('Engine started successfully');
          resolve();
        } else {
          callback(`Engine exited with code ${code}`);
          reject(`Engine exited with code ${code}`);
        }
      });
    });
  }
  
  

  public stopEngine(callback: (status: string) => void) {
    if (this.engineProcess) {
      this.engineProcess.kill();
      this.engineProcess = null;
    }
    callback('Engine stopped');
  }
}

export default new EngineService()
