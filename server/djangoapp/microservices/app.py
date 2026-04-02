from flask import Flask
from nltk.sentiment import SentimentIntensityAnalyzer
import json
from pathlib import Path
import zipfile

app = Flask("Sentiment Analyzer")

BASE_DIR = Path(__file__).resolve().parent
LEXICON_ARCHIVE = BASE_DIR / "sentiment" / "vader_lexicon.zip"
LEXICON_DIR = BASE_DIR / "sentiment" / "vader_lexicon"
LEXICON_FILE = LEXICON_DIR / "vader_lexicon.txt"

if not LEXICON_FILE.exists() and LEXICON_ARCHIVE.exists():
    with zipfile.ZipFile(LEXICON_ARCHIVE, "r") as archive:
        archive.extractall(BASE_DIR / "sentiment")

sia = SentimentIntensityAnalyzer(lexicon_file=LEXICON_FILE.as_uri())


@app.get('/')
def home():
    return "Welcome to the Sentiment Analyzer. \
    Use /analyze/text to get the sentiment"


@app.get('/analyze/<input_txt>')
def analyze_sentiment(input_txt):

    scores = sia.polarity_scores(input_txt)
    print(scores)
    pos = float(scores['pos'])
    neg = float(scores['neg'])
    neu = float(scores['neu'])
    res = "positive"
    print("pos neg nue ", pos, neg, neu)
    if (neg > pos and neg > neu):
        res = "negative"
    elif (neu > neg and neu > pos):
        res = "neutral"
    res = json.dumps({"sentiment": res})
    print(res)
    return res


if __name__ == "__main__":
    app.run(debug=True, port=5050)
