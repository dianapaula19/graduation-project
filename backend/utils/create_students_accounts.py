import sqlite3
import pandas as pd
import sys


def create_student_account(conn, first_name, last_name, email, domain, learning_mode, degree, current_group, current_year, study_program):
    if not first_name or not last_name or not email or not domain or not learning_mode or not degree or not current_group or not current_year or not study_program:
        print("The account couldn't be created")
        return 
    conn.execute("INSERT INTO users_user (password, first_name, last_name, email, is_superuser, is_staff, is_active, date_joined) \
        VALUES ('Parola@123', ?, ?, ?, 0, 0, 1, DATETIME('now'))", (first_name, last_name, email))
    curr = conn.cursor()
    curr.execute("SELECT id FROM users_user WHERE email=?", (email,))
    res = curr.fetchone()
    id = res[0]
    print(id)
    conn.execute("INSERT INTO users_student (user_id, domain, learning_mode, degree, current_group, current_year, study_program) \
        VALUES (?, ?, ?, ?, ?, ?, ?)", (id, domain, learning_mode, degree, current_group, current_year, study_program,))
    print("Account of {} was created succesfully".format(email))

def main():
    conn = sqlite3.connect('db.sqlite3')
    
    df = pd.read_excel(sys.argv[1])
    
    for _, row in df.iterrows():
        create_student_account(conn, row['Nume'], row['Prenume'], row['Email'], row['Domeniu'], row['Invatamant'], row['Studii universitare'], row['Grupa'], row['An'], row['Program de Studii'])

    conn.commit()

    conn.close()


if __name__ == "__main__":
    main()