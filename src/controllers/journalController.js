const JournalEntry = require('../models/JournalEntry');

// @desc    Create a new journal entry
// @route   POST /api/journal
// @access  Private
exports.createEntry = async (req, res) => {
    try {
        const { title, content, mood, tags } = req.body;

        if (!content || content.trim() === '') {
            return res.status(400).json({ message: 'Content is required' });
        }

        const entry = await JournalEntry.create({
            pseudonymId: req.user.pseudonymId,
            title: title || 'Untitled Entry',
            content,
            mood: mood || null,
            tags: tags || [],
        });

        res.status(201).json(entry);
    } catch (error) {
        console.error('Error creating journal entry:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all journal entries for user (paginated)
// @route   GET /api/journal
// @access  Private
exports.getEntries = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const entries = await JournalEntry.find({
            pseudonymId: req.user.pseudonymId,
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await JournalEntry.countDocuments({
            pseudonymId: req.user.pseudonymId,
        });

        res.status(200).json({
            entries,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching journal entries:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single journal entry
// @route   GET /api/journal/:id
// @access  Private
exports.getEntry = async (req, res) => {
    try {
        const entry = await JournalEntry.findById(req.params.id);

        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        // Verify ownership
        if (entry.pseudonymId !== req.user.pseudonymId) {
            return res.status(401).json({ message: 'Not authorized to access this entry' });
        }

        res.status(200).json(entry);
    } catch (error) {
        console.error('Error fetching journal entry:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a journal entry
// @route   PUT /api/journal/:id
// @access  Private
exports.updateEntry = async (req, res) => {
    try {
        const { title, content, mood, tags } = req.body;

        const entry = await JournalEntry.findById(req.params.id);

        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        // Verify ownership
        if (entry.pseudonymId !== req.user.pseudonymId) {
            return res.status(401).json({ message: 'Not authorized to update this entry' });
        }

        // Update fields
        if (title !== undefined) entry.title = title;
        if (content !== undefined) entry.content = content;
        if (mood !== undefined) entry.mood = mood;
        if (tags !== undefined) entry.tags = tags;

        await entry.save();

        res.status(200).json(entry);
    } catch (error) {
        console.error('Error updating journal entry:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a journal entry
// @route   DELETE /api/journal/:id
// @access  Private
exports.deleteEntry = async (req, res) => {
    try {
        const entry = await JournalEntry.findById(req.params.id);

        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        // Verify ownership
        if (entry.pseudonymId !== req.user.pseudonymId) {
            return res.status(401).json({ message: 'Not authorized to delete this entry' });
        }

        await entry.deleteOne();

        res.status(200).json({ message: 'Entry deleted successfully' });
    } catch (error) {
        console.error('Error deleting journal entry:', error);
        res.status(500).json({ message: error.message });
    }
};
