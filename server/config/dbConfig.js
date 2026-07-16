import colors  from 'colors'
import mongoose from 'mongoose'

const connectDB = async () => {
     
    try {
        let conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`DB CONNECTION SUCCESS : ${conn.connection.name}`.bgGreen)
    } catch (error) {
        console.log(`DB CONNECTION FAILD : ${error.message}`.bgRed)
    }

}

export default connectDB