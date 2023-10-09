const { isMainThread, parentPort } = require('worker_threads')
const engineService = require('../services/engineService.js')
const engineCalculateService = require('../services/engineCalculateService.js')

if (!isMainThread && parentPort) {
    parentPort.on('message', async (payload) => {
        switch (payload.message) {
            case 'start-engine':
                await engineService.default.startEngine((status) => {
                    console.log('Status:', status)
                })
                parentPort.postMessage({message: payload.message})
                break
            case 'stop-engine':
                engineService.default.stopEngine((status) => {
                    console.log('Status:', status)
                })
                parentPort.postMessage({message: payload.message})
                break
            case 'calculate-move':
                console.log('start')
                const bestsMove = await engineCalculateService.default.calculateBestMoves(payload.move,
                    (status) => {
                        console.log('Status:', status)
                    }
                )
                console.log('result calculateBestMove', bestsMove)
                parentPort.postMessage({message: payload.message, result: bestsMove})
                break
        }
    })
}