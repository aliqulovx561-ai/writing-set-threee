export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, studentName, teacherName, violations, task1WordCount, task2WordCount, totalWords, testDuration } = req.body;
    
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Telegram credentials not configured');
      return res.status(500).json({ 
        success: false, 
        error: 'Telegram credentials not configured'
      });
    }

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
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

    const result = await response.json();

    if (result.ok) {
      console.log('Telegram message sent successfully');
      return res.status(200).json({ success: true });
    } else {
      console.error('Telegram API error:', result);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to send message to Telegram',
        details: result
      });
    }
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message
    });
  }
}
