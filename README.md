# IELTS Writing Test - Set Three

A secure online IELTS Writing Test platform.

## Deployment Instructions

1. **Create a new GitHub repository** with these 4 files:
   - `index.html`
   - `vercel.json`
   - `package.json`
   - `api/telegram.js`

2. **Go to [vercel.com](https://vercel.com)** and:
   - Click "New Project"
   - Import your GitHub repository
   - Go to **Settings → Environment Variables**
   - Add these variables:
     - `TELEGRAM_BOT_TOKEN` = your_bot_token_here
     - `TELEGRAM_CHAT_ID` = your_chat_id_here
   - Click "Deploy"

## Telegram Bot Setup

1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Use `/newbot` command
3. Follow instructions to create your bot
4. Save the bot token
5. Start a chat with your bot
6. Get your chat ID from: `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`

## File Structure
