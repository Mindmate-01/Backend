// Basic keyword-based crisis detection
// In production, this would be augmented by an NLP classifier
const CRISIS_KEYWORDS = [
    'kill myself',
    'suicide',
    'end it all',
    'hurt myself',
    'want to die',
    'no reason to live',
    'better off dead',
    'ending my life',
];

const EMERGENCY_RESOURCES = `
I detect that you might be going through a difficult time. I am an AI and cannot provide professional help, but there are people who can.

**Emergency Helplines (Nigeria):**
- **Lagos State Emergency:** 112 or 767
- **NG Suicide Prevention Initiative:** +234 806 210 6493
- **Mentally Aware Nigeria:** +234 809 111 6264

This chat session has been paused for your safety. Please reach out to one of these numbers immediately.
`;

const detectCrisis = (content) => {
    const normalizedContent = content.toLowerCase();

    const matchedKeyword = CRISIS_KEYWORDS.find(keyword =>
        normalizedContent.includes(keyword)
    );

    if (matchedKeyword) {
        return {
            isCrisis: true,
            riskLevel: 'high',
            matchedKeyword,
            safetyMessage: EMERGENCY_RESOURCES.trim(),
        };
    }

    return {
        isCrisis: false,
        riskLevel: 'none',
    };
};

module.exports = { detectCrisis };
