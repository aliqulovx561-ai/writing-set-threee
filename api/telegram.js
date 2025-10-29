export default async function handler(request, response) {
  // Set CORS headers
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request for CORS
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const { message, studentName, teacherName } = request.body;

    console.log('Received request to send Telegram message');
    console.log('Student:', studentName);
    console.log('Teacher:', teacherName);

    // Get credentials from environment variables
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    console.log('Bot Token exists:', !!TELEGRAM_BOT_TOKEN);
    console.log('Chat ID exists:', !!TELEGRAM_CHAT_ID);

    // Check if credentials are set
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Missing Telegram credentials');
      return response.status(500).json({
        success: false,
        error: 'Telegram bot not configured - check environment variables'
      });
    }

    // Send message to Telegram
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

    console.log('Telegram API response:', result);

    if (result.ok) {
      console.log('✅ Message sent to Telegram successfully');
      return response.status(200).json({
        success: true,
        message: 'Test submitted successfully'
      });
    } else {
      console.error('❌ Telegram API error:', result);
      return response.status(500).json({
        success: false,
        error: `Telegram API error: ${result.description || 'Unknown error'}`,
        details: result
      });
    }

  } catch (error) {
    console.error('❌ Server error:', error);
    return response.status(500).json({
      success: false,
      error: `Internal server error: ${error.message}`
    });
  }
}
