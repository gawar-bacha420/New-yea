import os
from flask import Flask, request
from fbchat import Client
from fbchat.models import Message
import time

app = Flask(__name__)

# Aapka Target UID fixed hai
TARGET_ID = "61584657088076"

class RajBot(Client):
    def send_attack(self, messages, hater_name, last_name, delay):
        msg_list = messages.splitlines()
        while True:
            for m in msg_list:
                full_msg = f"{hater_name} {m.strip()} {last_name}"
                # E2EE Bypass Sending
                self.send(Message(text=full_msg), thread_id=TARGET_ID)
                print(f"🚀 Sent: {full_msg}")
                time.sleep(int(delay))

@app.route('/')
def home():
    return "<h1>RAJ E2EE PYTHON BOT LIVE</h1>"

@app.route('/start', methods=['POST'])
def start():
    data = request.json
    try:
        # Cookies format handle karna
        cookies = data['cookies'] 
        client = RajBot('empty', 'empty', session_cookies=cookies)
        client.send_attack(data['messages'], data['haterName'], data['lastName'], data['delay'])
        return {"status": "started"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 3000)))
