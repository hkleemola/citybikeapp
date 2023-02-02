const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    // // kun haluat käyttää projektin virallista tietokantaa
    // const mongo_user = process.env.MONGODB_USER;
    // const mongo_password = process.env.MONGODB_PASSWORD;    
    // //const conn = await mongoose.connect(`mongodb+srv://${mongo_user}:${mongo_password}@opiframeprojekti.tvrncei.mongodb.net/reittiopasApp?retryWrites=true&w=majority`)
    // const conn = await mongoose.connect(`mongodb+srv://${mongo_user}:${mongo_password}@sdapa.bv2m3y0.mongodb.net/Application?retryWrites=true&w=majority`)
    
    console.log(process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI)

    console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(error);
    process.exit(1)
  }
}

module.exports = connectDB