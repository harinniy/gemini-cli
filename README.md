**Gemini AI as CLI**
**Scope**

Helps build AI into our own systems (chatbots, CI pipelines, PR reviews, custom developer tools)

**Node Script Setup**
echo "GOOGLE_API_KEY=your-api-key-here" > .env
Get your API key from: https://makersuite.google.com/app/apikey or Google AI Studio.

chmod +x gemini-cli.js

npm link

**Usage**
Run Code Explanation on a Specific File or Function

gemini-cli explain schema.js

Code Review 

gemini-cli review-code schema.js

**Can be extended to the below usecases:**

Node.js Script: Loop Through All JS Files and Review
Generate Unit Tests for a Specific File
Review a git diff	
Loop an entire folder and process the query
Ask a question on the code

