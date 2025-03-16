from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import torch
from flask import Flask, request, jsonify

app = Flask(__name__)

# Cargar el modelo BlenderBot (preguntas y respuestas)
model_name = "facebook/blenderbot-400M-distill"
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Verificar si hay GPU disponible
device = "cuda" if torch.cuda.is_available() else "cpu"

# Cargar modelo en CPU o GPU (sin device_map="auto")
model = AutoModelForSeq2SeqLM.from_pretrained(model_name).to(device)

@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_input = data.get("prompt", "").strip()

        if not user_input:
            return jsonify({"error": "Falta el prompt"}), 400

        # Tokenizar entrada
        inputs = tokenizer(user_input, return_tensors="pt", truncation=True, max_length=512).to(device)

        # Generar respuesta
        output = model.generate(
            **inputs,
            max_new_tokens=50,  # Limitar la respuesta
            temperature=0.7,     # Variabilidad en respuestas
            top_p=0.9,           # Probabilidad de generación
            do_sample=True       # Sampling activado para respuestas más naturales
        )

        # Decodificar la respuesta
        response_text = tokenizer.decode(output[0], skip_special_tokens=True)

        return jsonify({"response": response_text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
