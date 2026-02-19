import express, { Request, Response } from 'express';
import Profile from '../models/Profile';

const router = express.Router();

// Get Profile by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) return res.status(404).json({ error: 'Profile not found' });
        res.json(profile);
    } catch (error: any) {
        console.error('Profile Fetch Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update Profile
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const profile = await Profile.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!profile) return res.status(404).json({ error: 'Profile not found' });
        res.json(profile);
    } catch (error: any) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
