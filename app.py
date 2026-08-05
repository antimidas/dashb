#!/usr/bin/env python3

from flask import Flask, jsonify, request
import datetime

app = Flask(__name__)

# --- Placeholder for JWT/Session Management ---
def generate_token(user): 
    """In a real app, this would use PyJWT or similar."""
    return f"mock_jwt_{hash(str(datetime.datetime.now()))}"

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # --- SECURITY WARNING: NEVER USE HARDCODED PASSWORDS IN PRODUCTION ---
    if username == "admin" and password == "password": 
        token = generate_token(username)
        return jsonify({
            "success": True,
            "token": token,
            "user_info": {"username": username, "roles": ["admin"]}
        }), 200
    else:
        return jsonify({
            "success": False,
            "message": "Invalid credentials provided."
        }), 401

@app.route('/api/status/system', methods=['GET'])
def get_system_status():
    # Placeholder: In reality, this would query system monitoring tools (e.g., psutil)
    return jsonify({
        "uptime": "2 days",
        "cpu_load": "15%",
        "memory_usage": "6.2GB / 32GB",
        "network_status": {"gateway": "Online", "ip": "10.0.0.2"}
    }), 200

@app.route('/api/status/<service_name>', methods=['GET'])
def get_service_status(service_name):
    # Placeholder: This function would contain logic to check Docker container health or service logs.
    if service_name == 'plex':
        return jsonify({
            "service": "Plex Media Server",
            "status": "Operational",
            "last_check": datetime.datetime.utcnow().isoformat() + 'Z',
            "details": {"library_count": 5, "active_users": 2}
        }), 200
    else:
        return jsonify({
            "service": service_name,
            "status": "Unknown",
            "message": f"Status check for {service_name} is not yet implemented." 
        }), 404

if __name__ == '__main__':
    # Running on port 5000 as per API spec assumption
    app.run(host='0.0.0.0', port=5000, debug=True)
