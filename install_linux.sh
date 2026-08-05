#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

APP_DIR="/opt/my_flask_app"
SERVICE_NAME="mywebapp"

echo "--- Starting Flask Application Installer ---"

# 1. Check for root privileges
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root or with sudo."
   exit 1
fi

# 2. Install System Dependencies (Using apt as an example)
echo "[STEP 1/3] Installing system dependencies via apt..."
apt update
apt install -y python3 python3-pip python3-venv build-essential

# 3. Setup Application Directory and Copy Code
echo "[STEP 2/3] Setting up application directory at $APP_DIR"
mkdir -p $APP_DIR
cp app.py $APP_DIR/
cp requirements.txt $APP_DIR/
# Note: In a real scenario, you'd copy all necessary files (templates, static assets)

# 4. Create and Activate Virtual Environment
echo "[STEP 3/3] Creating and activating virtual environment..."
python3 -m venv $APP_DIR/venv
source $APP_DIR/venv/bin/activate

# 5. Install Python Dependencies
echo "Installing dependencies from requirements.txt..."
pip install -r $APP_DIR/requirements.txt
# IMPORTANT: For production, you should also install gunicorn here if it's not in requirements.txt
# pip install gunicorn

deactivate

# 6. Create Systemd Service File
echo "Creating systemd service file for $SERVICE_NAME..."
cat <<EOF > /etc/systemd/system/${SERVICE_NAME}.service
[Unit]
Description=My Flask Web Application
After=network.target

[Service]
User=www-data # Or a dedicated non-root user
WorkingDirectory=${APP_DIR}
Environment="PATH=${APP_DIR}/venv/bin"
ExecStart=${APP_DIR}/venv/bin/gunicorn --workers 4 --bind unix:mywebapp.sock app:app
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# 7. Reload systemd, start service, and enable on boot
echo "Reloading systemd daemon..."
systemctl daemon-reload
echo "Enabling and starting the service..."
systemctl enable ${SERVICE_NAME}.service
systemctl start ${SERVICE_NAME}.service

echo ""
echo "========================================================="
echo "✅ Installation Complete!"
echo "The application should now be running as a systemd service."
echo "Check status with: systemctl status ${SERVICE_NAME}.service"
echo "========================================================="