import subprocess
import threading
import os
import sys
import time
import webbrowser

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, 'backend')
FRONTEND_DIR = os.path.join(BASE_DIR, 'frontend')

def start_backend():
    print("🚀 [Backend] Starting Flask server...")
    env = os.environ.copy()
    env['PYTHONIOENCODING'] = 'utf-8'
    python_bin = sys.executable if sys.executable else 'python'
    subprocess.run(f'"{python_bin}" app.py', cwd=BACKEND_DIR, env=env, shell=True)

def start_frontend():
    print("🌐 [Frontend] Starting React development server...")
    time.sleep(3)
    webbrowser.open("http://localhost:3000")
    cmd = 'cmd /c npm start' if os.name == 'nt' else 'npm start'
    subprocess.run(cmd, cwd=FRONTEND_DIR, shell=True)

if __name__ == "__main__":
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    print("🔥 Starting ISL Learning Toolkit (AI-Driven)...")
    t1 = threading.Thread(target=start_backend, daemon=True)
    t2 = threading.Thread(target=start_frontend, daemon=True)
    t1.start()
    t2.start()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping servers...")