import mongoose from 'mongoose'

const mongooseConfig = () => {
    mongoose.connect("mongodb://127.0.0.1:27017/chess-up");

    const db = mongoose.connection

    db.on('error', console.error.bind(console, 'MongoDB connection error'))
    db.once('open', () => console.log('Connected to mongodb'))
} 

export default mongooseConfig
