export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, studentName, teacherName } = req.body;

    console.log('=== TELEGRAM REQUEST ===');
    console.log('Student:', studentName);
    console.log('Teacher:', teacherName);

    // Get environment variables
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    console.log('Bot Token exists:', !!BOT_TOKEN);
    console.log('Chat ID exists:', !!CHAT_ID);

    if (!BOT_TOKEN || !CHAT_ID) {
      console.error('MISSING ENVIRONMENT VARIABLES');
      return res.status(500).json({
        success: false,
        error: 'Telegram credentials not configured. Please check environment variables.'
      });
    }

    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    const payload = {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    };

    console.log('Sending to Telegram...');
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log('Telegram API response:', result);

    if (result.ok) {
      console.log('✅ TELEGRAM MESSAGE SENT SUCCESSFULLY');
      return res.json({
        success: true,
        message: 'Message sent to Telegram successfully'
      });
    } else {
      console.error('❌ TELEGRAM ERROR:', result.description);
      return res.status(500).json({
        success: false,
        error: result.description || 'Unknown Telegram error'
      });
    }

  } catch (error) {
    console.error('💥 SERVER ERROR:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
