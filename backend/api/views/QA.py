# qa.py
import os, tempfile, json
from django.http import JsonResponse
from langchain.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain.chains import RetrievalQA
from langchain_community.llms import Ollama
from langchain.embeddings import HuggingFaceEmbeddings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# Global variables to store the QA pipeline (consider session-based storage for multi-user setups)
vector_store = None
qa_chain = None

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_pdf(request):
    if request.method == 'POST' and request.FILES.get('pdf'):
        pdf_file = request.FILES['pdf']
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            for chunk in pdf_file.chunks():
                tmp_file.write(chunk)
            tmp_file_path = tmp_file.name

        global vector_store, qa_chain
        vector_store, qa_chain = process_pdf(tmp_file_path)

        os.remove(tmp_file_path)
        return JsonResponse({'message': 'PDF processed successfully.'})
    return JsonResponse({'error': 'Invalid request.'}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ask_question(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        question = data.get('question', '')
        if not question:
            return JsonResponse({'error': 'No question provided.'}, status=400)
        if qa_chain is None:
            return JsonResponse({'error': 'No PDF has been processed yet.'}, status=400)
        answer = qa_chain.run(question)
        return JsonResponse({'answer': answer})
    return JsonResponse({'error': 'Invalid request.'}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def process_pdf(pdf_path):
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = text_splitter.split_documents(documents)
    embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vector_store = FAISS.from_documents(docs, embedding_model)
    vector_store.save_local("faiss_index")
    llm = Ollama(model="deepseek-r1:1.5b", temperature=0.5)
    qa_chain = RetrievalQA.from_chain_type(llm, retriever=vector_store.as_retriever())
    return vector_store, qa_chain
