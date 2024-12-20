import os
from dotenv import load_dotenv
import openai
from flask import Flask, render_template, request, jsonify
from datetime import datetime
import json

# Load environment variables
load_dotenv()

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

app = Flask(__name__)
app.static_folder = 'static'

# Add quiz questions
MENTAL_HEALTH_QUIZ = {
    "questions": [
        {
            "id": 1,
            "question": "Over the past week, how often have you felt down, depressed, or hopeless?",
            "options": ["Not at all", "Several days", "More than half the days", "Nearly every day"],
            "scores": [0, 1, 2, 3]
        },
        {
            "id": 2,
            "question": "How often have you had trouble falling or staying asleep, or sleeping too much?",
            "options": ["Not at all", "Several days", "More than half the days", "Nearly every day"],
            "scores": [0, 1, 2, 3]
        },
        {
            "id": 3,
            "question": "How often have you felt tired or had little energy?",
            "options": ["Not at all", "Several days", "More than half the days", "Nearly every day"],
            "scores": [0, 1, 2, 3]
        },
        {
            "id": 4,
            "question": "How would you rate your anxiety levels this week?",
            "options": ["Minimal", "Mild", "Moderate", "Severe"],
            "scores": [0, 1, 2, 3]
        },
        {
            "id": 5,
            "question": "How well have you been able to concentrate on tasks?",
            "options": ["Very well", "Somewhat well", "Not very well", "Not at all"],
            "scores": [0, 1, 2, 3]
        }
    ]
}

def get_chatgpt_response(message):
    try:
        # Create chat completion with ChatGPT
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a compassionate mental health assistant. Provide supportive, empathetic responses. Keep responses concise and focused on emotional support."
                },
                {
                    "role": "user",
                    "content": message
                }
            ],
            max_tokens=150,
            temperature=0.7
        )
        
        return response.choices[0].message['content']
    except Exception as e:
        print(f"Error with ChatGPT: {str(e)}")
        return "I apologize, but I'm having trouble connecting to my services. Please try again in a moment."

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/get")
def get_bot_response():
    userText = request.args.get('msg')
    if not userText:
        return "I didn't receive any message. Could you please try again?"
    
    try:
        # Get response from ChatGPT
        response = get_chatgpt_response(userText)
        return response
    except Exception as e:
        print(f"Error in get_bot_response: {str(e)}")
        return "I apologize, but I'm having trouble processing your request. Please try again."

@app.route("/quiz")
def quiz():
    return render_template("quiz.html", questions=MENTAL_HEALTH_QUIZ["questions"])

@app.route("/submit_quiz", methods=["POST"])
def submit_quiz():
    answers = request.get_json()
    total_score = 0
    max_score = len(MENTAL_HEALTH_QUIZ["questions"]) * 3

    for q_id, answer in answers.items():
        question = next(q for q in MENTAL_HEALTH_QUIZ["questions"] if q["id"] == int(q_id))
        total_score += question["scores"][int(answer)]

    score_percentage = (total_score / max_score) * 100
    
    # Get recommendations based on score
    recommendations = get_recommendations(score_percentage)
    
    return jsonify({
        "score": score_percentage,
        "recommendations": recommendations
    })

def get_recommendations(score):
    if score < 30:
        return {
            "status": "Good mental health",
            "message": "You're doing well! Keep up these positive habits:",
            "tips": [
                "Continue regular exercise",
                "Maintain healthy sleep patterns",
                "Practice mindfulness daily",
                "Stay connected with friends and family"
            ]
        }
    elif score < 60:
        return {
            "status": "Mild stress",
            "message": "You're experiencing some stress. Try these techniques:",
            "tips": [
                "Start a daily meditation practice",
                "Take regular breaks during work",
                "Practice deep breathing exercises",
                "Consider talking to a friend or counselor"
            ]
        }
    else:
        return {
            "status": "High stress",
            "message": "Your responses indicate significant stress. Consider these steps:",
            "tips": [
                "Schedule an appointment with a mental health professional",
                "Practice stress-reduction techniques daily",
                "Establish a regular sleep schedule",
                "Reach out to your support network"
            ]
        }

@app.route("/reminder")
def reminder():
    return render_template("reminder.html")

@app.route("/set_reminder", methods=["POST"])
def set_reminder():
    data = request.get_json()
    
    # Here you would typically:
    # 1. Validate the data
    # 2. Store it in a database
    # 3. Set up actual reminder functionality (email service, etc.)
    
    # For now, we'll just return success
    return jsonify({
        "success": True,
        "message": "Reminder set successfully"
    })

if __name__ == "__main__":
    app.run(debug=True)
