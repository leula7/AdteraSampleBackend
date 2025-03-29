import {Router} from 'express';
import { getJobs } from './server';


const router = Router();

router.get('/jobs/:user_id',getJobs);

export default router;

 // router.post('/addbranch',AddBranch);