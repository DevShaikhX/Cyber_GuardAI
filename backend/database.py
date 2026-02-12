from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

import os

# Use /tmp for SQLite when running on Vercel (ephemeral writeable storage)
DATABASE_FILENAME = "cyberguard.db"
if os.environ.get("VERCEL"):
    SQLALCHEMY_DATABASE_URL = f"sqlite:////tmp/{DATABASE_FILENAME}"
else:
    SQLALCHEMY_DATABASE_URL = f"sqlite:///./{DATABASE_FILENAME}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class DetectionResult(Base):
    __tablename__ = "detection_results"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String) # 'email' or 'network'
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    input_data = Column(JSON)
    prediction = Column(JSON)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
