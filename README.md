# AI Legal Notice Generator (India-Focused) ⚖️🇮🇳

A fast, beautifully designed Next.js application designed to help individuals and SMEs in India create legally structured notices for common disputes like fraud, service delays, and contract violations.

## 🚀 Key Features Include
- **Visually Stunning Dark Mode**: Premium, glassmorphism UI built with Material-UI and custom gradients. 
- **Dynamic Legal Draft Generation**: Fill the details and automatically get:
  - 📄 Formal Legal Notice
  - 💬 WhatsApp Message (friendly but firm)
  - 🏛️ Complaint Draft (Consumer court)
- **Export & Share**: Copy to clipboard with one click, or download the notice immediately as a PDF document.
- **Robust Fallbacks**: A fully fleshed out AI mock layer allows you to demo the UI without needing API keys.
- **Next.js & App Router Architecture**: Clean backend logic decoupled from the frontend in `src/app/api/generate`.

## ⚙️ Getting Started

1. **Start the Development Server**
   ```bash
   npm run dev
   ```
2. Open [http://localhost:3000](http://localhost:3000)

## 🤖 Using Real AI (Optional)
Currently, to ensure the UI works beautifully out of the box, the app mocks LLM generations locally using highly accurate Indian legal templates.

To connect this to a real AI engine (like **OpenRouter** or **Groq**):
1. Create a `.env.local` file in the root directory.
2. Add your API key: `OPENROUTER_API_KEY=your_key_here`
3. Restart your dev server.

## 🛠 Tech Stack
- **Framework:** Next.js (App Router)
- **UI & Styling:** Material-UI (MUI), Vanilla CSS, Lucide React
- **Forms:** React Hook Form
- **Exporting:** jsPDF
