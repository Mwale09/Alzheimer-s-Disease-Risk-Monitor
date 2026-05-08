import sqlite3
import os

db_path = 'c:\\Users\\mwale\\AD Risk Prediction\\backend\\ad_risk.db'

if not os.path.exists(db_path):
    print("Database not found")
else:
    conn = sqlite3.connect(db_path)
    try:
        conn.execute('ALTER TABLE predictions ADD COLUMN user_id INTEGER REFERENCES users(id)')
        print('Column added successfully.')
    except Exception as e:
        print('Error:', e)
    conn.commit()
    conn.close()
