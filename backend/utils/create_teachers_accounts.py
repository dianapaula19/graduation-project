import sqlite3
import pandas as pd

conn = sqlite3.connect('db.sqlite3')


def create_teacher_account(conn, first_name, last_name, email):
    if not first_name or not last_name or not email:
        print("The account couldn't be created")
        return 
    conn.execute("INSERT INTO users_user (password, first_name, last_name, email, is_superuser, is_staff, is_active, date_joined) \
        VALUES ('Parola@123', ?, ?, ?, 0, 0, 1, DATETIME('now'))", (first_name, last_name, email))
    curr = conn.cursor()
    curr.execute("SELECT id FROM users_user WHERE email=?", (email,))
    res = curr.fetchone()
    id = res[0]
    print(id)
    conn.execute("INSERT INTO users_teacher (user_id, domain, learning_mode, degree, current_group, current_year, study_program) \
        VALUES (?, ?, ?, ?, ?, ?, ?)", (id,))
    print("Account of {} was created succesfully".format(email))


df = pd.read_excel('Lista Profesori.xlsx')
for _, row in df.iterrows():
    create_teacher_account(conn, row['Nume'], row['Prenume'], row['Email'])

conn.commit()

conn.close()