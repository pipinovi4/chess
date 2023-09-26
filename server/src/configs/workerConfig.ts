import { Worker, isMainThread, parentPort } from 'worker_threads';
import engineService from '../services/engineService';

interface PayloadWorker {
    message: string;
    move?: string;
    depth?: number;
}

let sharedWorker: Worker | null = null;

const createWorker = async (): Promise<Worker> => {
    return new Promise((resolve) => {
        const worker = new Worker(__filename);

        worker.on('online', () => {
            resolve(worker);
        });

        if (!sharedWorker) {
            sharedWorker = worker;
        }

        return sharedWorker;
    });
};

const workerConfig = async (message: string, payload: PayloadWorker | null = null): Promise<Worker | null> => {
    if (isMainThread) {
        const worker = await createWorker();

        if (payload) {
            worker.postMessage({ message, payload });
        }

        engineService.startEngine((status) => {
            console.log(status); 
        });

        return worker;
    } else {
        parentPort?.on('message', (message) => {
            const { message: workerMessage, payload } = message;

            switch (workerMessage) {
                case 'start-engine':
                    engineService.startEngine((status) => {
                        console.log(status);
                    });
                    break;
                case 'calculate-move':
                    if (payload && payload.move && payload.depth) {
                        engineService.calculateBestMoves(payload.move, payload.depth, (status, error) => {
                            if (error) {
                                console.error('Error in calculate-move:', error);
                            } else {
                                console.log('Calculation completed successfully:', status);
                            }
                        });
                    } else {
                        console.error('Invalid payload for calculate-move');
                    }
                    break;
                case 'stop-engine':
                    engineService.stopEngine((status) => {
                        console.log(status);
                    });
                    break;
                default:
                    console.error(`Unknown message from main thread: ${workerMessage}`);
                    break;
            }
        });
        return null;
    }
};

export default workerConfig;
