import os
import requests

# Load DeepSeek API key from .env
DEEPL_API_KEY = os.getenv("DEEPL_API_KEY")  # or DEEPSEEK_API_KEY
DEEPL_URL = "https://api.deepseek.com/v1/chat"  # replace with your actual DeepSeek endpoint

def ask_deepseek_for_reasoning(prompt: str) -> str:
    """
    Sends a prompt to DeepSeek API to generate natural language reasoning
    based on SQL results, then returns the answer as text.
    """
    headers = {
        "Authorization": f"Bearer {DEEPL_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "prompt": prompt,
        "model": "deepseek-chat"  # replace with your purchased model name
    }

    try:
        response = requests.post(DEEPL_URL, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        data = response.json()
        # The key 'answer' may vary depending on DeepSeek API response
        return data.get("answer") or data.get("text") or ""
    except Exception as e:
        print("DeepSeek reasoning error:", e)
        return ""
