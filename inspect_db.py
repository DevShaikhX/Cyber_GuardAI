import sqlite3
import json

def inspect_db():
    try:
        conn = sqlite3.connect('cyberguard.db')
        cursor = conn.cursor()
        
        # Get table info
        cursor.execute("PRAGMA table_info(detection_results)")
        columns = cursor.fetchall()
        print("Table Info:", columns)
        
        # Get some data
        cursor.execute("SELECT * FROM detection_results LIMIT 5")
        rows = cursor.fetchall()
        print("\nFirst 5 rows:")
        for row in rows:
            print(row)
            
        conn.close()
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    inspect_db()
