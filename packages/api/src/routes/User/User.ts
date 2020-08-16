import express from 'express';

const router = express.Router();

router.get('/login', async function (req, res) {
    res.json({
        api: 'login',
    });
});

export const User = router;
