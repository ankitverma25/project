import dotenv from 'dotenv';
import app from './app.js';
import connectDb from '../DB/connectDb.js';

dotenv.config();


console.log(process.env.DB_URL);

connectDb().then(() => {
    app.on('error', (err) => {
        console.error('Server error:', err);
    });
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.log(err);
}
)
