import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = 'sakshi_secret_key'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'database.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    ASL_DIR = os.path.join(BASE_DIR, 'static', 'asl_images')
    VIDEO_DIR = os.path.join(BASE_DIR, 'static', 'isl_videos')
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'static', 'uploads')
    MODEL_PATH = os.path.join(BASE_DIR, 'models', 'sign_model_cnn.h5')


SECRET_KEY="key"
