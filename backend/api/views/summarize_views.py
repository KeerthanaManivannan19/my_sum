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
    

    word_count = len(re.findall(r'\b\w+\b', text))
    word_count = int(word_count * (percentage / 100))
    min_count = word_count - 10
    max_count = word_count + 10
    summary = ""

    Query = f"Summarize the text, strictly follow summarized text words count not go beyond {max_count}, and not go below {min_count}. Here is the text: {text}"

    
    client = Groq(api_key=os.getenv("groq_api"))
    chat_completion = client.chat.completions.create(
    messages=[{"role": "user", "content": Query}], model="llama-3.3-70b-versatile")
    summary = chat_completion.choices[0].message.content

    summarized_count = len(re.findall(r'\b\w+\b', summary))
    print(f"Expected word count:{word_count}")
    print(f"Original word count:{summarized_count}")

    return Response({"summary": summary})
