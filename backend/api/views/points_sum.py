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
def summarize_points(request):
    data = request.data
    text = data.get("text", "")
    model_name = data.get("model", "")

    
    summary_points = ""

    Query = f"I provided text below can you break sub topics and and give summary as points, but all key important points shoud be there,sub topics in roman number formate and points in bullet formate, words counts will be reduced to 50 percentage, the text is {text}"

    if model_name == "deepseek":
        response = chat(model="deepseek-r1:1.5b", messages=[{"role": "system", "content": "Respond only in English."},{"role": "user", "content": Query}])
        res = response.message.content
        clean = re.sub(r"<think>.*?</think>", "", res, flags=re.DOTALL).strip()
        summary_points = clean.replace("\n\n", " ")

    elif model_name == "Gemini":
        genai.configure(api_key=os.getenv("gem_api"))
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(Query)
        summary_points = response.text

    else:
        client = Groq(api_key=os.getenv("groq_api"))
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": Query}], model="llama-3.3-70b-versatile"
        )
        summary_points = chat_completion.choices[0].message.content

    

    return Response({"summary_points": summary_points})
