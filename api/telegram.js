export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = request.body;

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return response.status(500).json({
        success: false,
        error: 'Telegram bot not configured'
      });
    }

    const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const result = await telegramResponse.json();

    if (result.ok) {
      return response.status(200).json({
        success: true,
        message: 'Test submitted successfully'
      });
    } else {
      return response.status(500).json({
        success: false,
        error: 'Failed to send message to Telegram'
      });
    }

  } catch (error) {
    return response.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
