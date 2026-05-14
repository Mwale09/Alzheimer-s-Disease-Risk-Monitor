import sqlite3
import os

db_path = 'c:\\Users\\mwale\\AD Risk Prediction\\backend\\ad_risk.db'

if not os.path.exists(db_path):
    print("Database not found")
else:
    conn = sqlite3.connect(db_path)
    try:
        # SQLite does not easily support RENAME COLUMN in very old versions, but modern ones do.
        # Alternatively, we just add the columns and drop ad_risk.db if dev. 
        # By the book, let's try ALTER TABLE RENAME COLUMN then ADD COLUMN.
        conn.execute('ALTER TABLE genetic_variants RENAME COLUMN variant_id TO snp_id')
        print('Renamed variant_id to snp_id.')
    except Exception as e:
        print('Error renaming column:', e)

    columns = [
        ('risk_allele', 'VARCHAR'),
        ('pvalue', 'FLOAT'),
        ('risk_frequency', 'FLOAT'),
        ('beta', 'FLOAT')
    ]
    cur = conn.cursor()
    for col_name, col_type in columns:
        try:
            cur.execute(f"ALTER TABLE genetic_variants ADD COLUMN {col_name} {col_type}")
            print(f"Added column {col_name}")
        except Exception as e:
            print(f"Error adding {col_name}:", e)
    conn.commit()
    conn.close()
    print("Migration finished.")
