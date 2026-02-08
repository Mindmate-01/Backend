const MoodLog = require('../models/MoodLog');

// @desc    Log a new mood
// @route   POST /api/mood
// @access  Private
exports.logMood = async (req, res) => {
    const { emotion, intensity, note } = req.body;

    try {
        const moodLog = await MoodLog.create({
            pseudonymId: req.user.pseudonymId,
            emotion,
            intensity,
            note,
        });

        res.status(201).json(moodLog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get mood history
// @route   GET /api/mood/history
// @access  Private
exports.getMoodHistory = async (req, res) => {
    try {
        const history = await MoodLog.find({
            pseudonymId: req.user.pseudonymId,
        }).sort({ createdAt: -1 });

        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
