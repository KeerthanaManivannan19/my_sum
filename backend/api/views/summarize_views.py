import os
import re
from dotenv import load_dotenv
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ollama import chat
import google.generativeai as genai
from groq import Groq

# Load environment variables
load_dotenv()

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def summarize_text(request):
    data = request.data
    text = data.get("text", "")
    percentage = data.get("min_length",)
    model_name = data.get("model", "")

    word_count = len(re.findall(r'\b\w+\b', text))
    word_count = int(word_count * (percentage / 100))
    min_count = word_count - 10
    max_count = word_count + 10
    summary = ""

    Query = f"Summarize the text, strictly follow summarized text words count not go beyond {max_count}, and not go below {min_count}. Here is the text: {text}"

    if model_name == "deepseek":
        response = chat(model="deepseek-r1:1.5b", messages=[{"role": "system", "content": "Respond only in English."},{"role": "user", "content": Query}])
        res = response.message.content
        clean = re.sub(r"<think>.*?</think>", "", res, flags=re.DOTALL).strip()
        summary = clean.replace("\n\n", " ")

    elif model_name == "Gemini":
        genai.configure(api_key=os.getenv("gem_api"))
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(Query)
        summary = response.text

    else:
        client = Groq(api_key=os.getenv("groq_api"))
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": Query}], model="llama-3.3-70b-versatile"
        )
        summary = chat_completion.choices[0].message.content

    summarized_count = len(re.findall(r'\b\w+\b', summary))

    return Response({"summary": summary})
