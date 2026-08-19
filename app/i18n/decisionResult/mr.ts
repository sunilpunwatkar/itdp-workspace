export const mr = {
  labels: {
    stock: "Stock / शेअर",
    decision: "Decision / निर्णय",
    confidence: "Confidence / विश्वास पातळी",
    risk: "Risk / जोखीम",
    target: "Target / लक्ष्य",
    stopLoss: "Stop Loss / नुकसान मर्यादा",

    support1: "Support 1 / पहिला आधार",
    support2: "Support 2 / दुसरा आधार",

    resistance1: "Resistance 1 / पहिला प्रतिकार",
    resistance2: "Resistance 2 / दुसरा प्रतिकार",

    trend: "Trend / कल",
    ema: "EMA / एक्स्पोनेंशियल मूव्हिंग ॲव्हरेज",
    rsi: "RSI / सापेक्ष ताकद निर्देशांक",
    macd: "MACD / गती निर्देशक",

    priceStructure:
      "Price Structure / किंमत रचना",

    riskReward:
      "Risk/Reward / जोखीम-नफा प्रमाण",

    tradePlan:
      "Trade Plan / व्यवहार योजना",

    tradeQuality:
      "Trade Quality / व्यवहाराची गुणवत्ता",

    holdingPeriod:
      "Holding Period / धारण कालावधी",

    aiSummary:
      "AI Summary / AI सारांश",

    reasons:
      "Reasons / कारणे",

    invalidIf:
      "Invalid Condition / निर्णय अमान्य होण्याची अट",
  },

  reasons: {
    trend: "Trend / कल",
    trend_UPTREND: "UPTREND / वर जाणारा कल",
    trend_DOWNTREND: "DOWNTREND / खाली जाणारा कल",
    trend_SIDEWAYS: "SIDEWAYS / स्थिर कल",

    emaStructure: "EMA Structure / EMA रचना",
    ema_BULLISH: "BULLISH / तेजीची रचना",
    ema_BEARISH: "BEARISH / मंदीची रचना",
    ema_MIXED: "MIXED / मिश्र रचना",

    rsi: "RSI / सापेक्ष ताकद निर्देशांक",
    rsi_BUY: "BUY / खरेदी संकेत",
    rsi_SELL: "SELL / विक्री संकेत",
    rsi_HOLD: "HOLD / प्रतीक्षा",

    priceStructure: "Price Structure / किंमत रचना",
    price_BREAKOUT: "BREAKOUT / वरच्या दिशेने भेद",
    price_NEAR_SUPPORT: "NEAR_SUPPORT / आधाराजवळ",
    price_BREAKDOWN: "BREAKDOWN / खालच्या दिशेने भेद",
    price_NEAR_RESISTANCE: "NEAR_RESISTANCE / प्रतिकाराजवळ",
    price_RANGE: "RANGE / मर्यादित पट्टा",

    macd: "MACD / गती निर्देशक",
    macd_BUY: "BUY / खरेदी संकेत",
    macd_SELL: "SELL / विक्री संकेत",
    macd_HOLD: "HOLD / प्रतीक्षा",

    macdHistogram: "MACD Histogram / MACD हिस्टोग्राम",
    histogram_POSITIVE: "POSITIVE / सकारात्मक",
    histogram_NEGATIVE: "NEGATIVE / नकारात्मक",

    primaryDirection: "Primary Direction / प्राथमिक दिशा",
    primaryDirection_BUY: "BUY / खरेदी दिशा",
    primaryDirection_SELL: "SELL / विक्री दिशा",
    primaryDirection_MIXED: "MIXED / मिश्र दिशा",
    primaryDirection_NONE: "NONE / निश्चित दिशा नाही",
  },

  values: {
    BUY: "BUY / खरेदी संकेत",
    SELL: "SELL / विक्री संकेत",
    HOLD: "HOLD / प्रतीक्षा",

    LOW: "LOW / कमी",
    MEDIUM: "MEDIUM / मध्यम",
    HIGH: "HIGH / जास्त",

    UPTREND: "UPTREND / वर जाणारा कल",
    DOWNTREND: "DOWNTREND / खाली जाणारा कल",
    SIDEWAYS: "SIDEWAYS / स्थिर कल",

    STRONG_BUY:
      "STRONG BUY / मजबूत खरेदी संकेत",

    STRONG_SELL:
      "STRONG SELL / मजबूत विक्री संकेत",

    NEAR_SUPPORT:
      "NEAR_SUPPORT / आधाराजवळ",

    NEAR_RESISTANCE:
      "NEAR_RESISTANCE / प्रतिकाराजवळ",

    EXCELLENT:
      "EXCELLENT / उत्कृष्ट",

    GOOD:
      "GOOD / चांगला",

    WAIT:
      "WAIT / प्रतीक्षा",

    WEAK:
      "WEAK / कमकुवत",

    SWING:
      "SWING / स्विंग व्यवहार",

    "No Trade":
      "No Trade / व्यवहार करू नये",
  },
} as const;

