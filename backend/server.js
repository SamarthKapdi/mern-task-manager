import 'dotenv/config';
import { connectDatabase } from './config/db.js';
import app from './app.js';
const port = process.env.PORT || 5001;

connectDatabase()
  .then(() => app.listen(port, () => console.log(`API listening on port ${port}`)))
  .catch((error) => {
    console.error('Unable to start server:', error.message);
    process.exit(1);
  });
