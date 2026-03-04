import express , {Application, Request, Response} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParse from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import issueRoutes from './routes/issueRoutes';
import epicRoutes from './routes/epicRoutes';      
import sprintRoutes from './routes/sprintRoutes'; 
import notificationRoutes from './routes/notificationRoutes';
import invitationRoutes from './routes/invitationRoutes';
import pool from './config/database';

dotenv.config();

const app: Application=express();
const PORT= process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParse());

app.use('/api/auth',authRoutes);
app.use('/api/projects',projectRoutes);
app.use('/api',issueRoutes);
app.use('/api', epicRoutes);     
app.use('/api', sprintRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api',invitationRoutes);


app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server is running' });
});


app.get('/api/db-test', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'OK', 
      message: 'Database connected',
      time: result.rows[0].now 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}); 


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
