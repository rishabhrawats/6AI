// API Keys for different instances
const GEMINI_KEYS = {
    box1: 'AIzaSyD1LsRepLFTSLD3p0vcsnoMyFfjhMkoSLQ',
    box2: 'AIzaSyAQhq5-kQR-lID_og3ANZKwihmlGm5quOA',
    box3: 'AIzaSyBiG7EC8TljHTnU_8OdXVDEz1ns-YOByU4',
    box4: 'AIzaSyDOIeVM-20ZLujoMNS-87fMQhO5b1tvLhs',
    box5: 'AIzaSyCkydIPxmbY0CX7yGcWsC6-_eoO2mMaInM',
    box6: 'AIzaSyBhPgINrJrOBHdGShZZ4ZSfR8zaW_-0rIQ'
};

// Main function to generate responses
async function generateResponses() {
    const userInput = document.getElementById('userInput').value;
    if (!userInput.trim()) {
        alert('Please enter a prompt');
        return;
    }

    // Show loading spinners for all six boxes
    const outputs = ['box1', 'box2', 'box3', 'box4', 'box5', 'box6'];
    outputs.forEach(box => {
        const outputBox = document.getElementById(`${box}Output`);
        outputBox.querySelector('.loading-spinner').classList.remove('hidden');
        outputBox.querySelector('.response-text').textContent = '';
    });

    try {
        // Generate responses using different API keys
        const responses = await Promise.all([
            generateGeminiResponse(userInput, GEMINI_KEYS.box1),
            generateGeminiResponse(userInput, GEMINI_KEYS.box2),
            generateGeminiResponse(userInput, GEMINI_KEYS.box3),
            generateGeminiResponse(userInput, GEMINI_KEYS.box4),
            generateGeminiResponse(userInput, GEMINI_KEYS.box5),
            generateGeminiResponse(userInput, GEMINI_KEYS.box6)
        ]);

        // Display responses
        outputs.forEach((box, index) => {
            updateOutput(box, responses[index]);
        });

    } catch (error) {
        console.error('Error generating responses:', error);
        outputs.forEach(box => {
            updateOutput(box, 'Error generating response');
        });
    }
}

// Update output display
function updateOutput(box, text) {
    const outputBox = document.getElementById(`${box}Output`);
    outputBox.querySelector('.loading-spinner').classList.add('hidden');
    outputBox.querySelector('.response-text').textContent = text;
}

// Gemini API Implementation
async function generateGeminiResponse(prompt, apiKey) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Gemini API error');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Gemini Error:', error);
        return `Error: ${error.message}`;
    }
}