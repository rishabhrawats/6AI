// API Keys for different instances
const GEMINI_KEYS = {
    box1: 'AIzaSyCa0FS8wFsH8tacFFvZaNAq1foSIjfRfjM',
    box2: 'AIzaSyAQhq5-kQR-lID_og3ANZKwihmlGm5quOA',
    box3: 'AIzaSyBiG7EC8TljHTnU_8OdXVDEz1ns-YOByU4',
    box4: 'AIzaSyC0je4ivZQHo3LDydkrx1U2XS9RVsj8uEo',
    box5: 'AIzaSyCkydIPxmbY0CX7yGcWsC6-_eoO2mMaInM',
    box6: 'AIzaSyBhPgINrJrOBHdGShZZ4ZSfR8zaW_-0rIQ'
};

// Main function to generate responses
const MISTRAL_API_KEY = 'LoOUBGIEsvhyC5m4S4lrstQJjXgRSaS1';

// Main function to generate responses
async function generateResponses() {
    const userInput = document.getElementById('userInput').value;
    if (!userInput.trim()) {
        alert('Please enter a prompt');
        return;
    }

    // Show loading spinners for all six boxes
    const outputs = ['box1', 'box2', 'box3', 'box4', 'box5', 'box6', 'mistral'];
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
            generateGeminiResponse(userInput, GEMINI_KEYS.box6),
            generateMistralResponse(userInput)
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

// Mistral API Implementation
async function generateMistralResponse(prompt) {
    try {
        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MISTRAL_API_KEY}`
            },
            body: JSON.stringify({
                model: "mistral-tiny",
                messages: [{
                    role: "user",
                    content: prompt
                }],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Mistral API error');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Mistral Error:', error);
        return `Error: ${error.message}`;
    }
}
