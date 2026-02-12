import sys
import os

# Add project root to path so backend can be found
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from backend.main import app
