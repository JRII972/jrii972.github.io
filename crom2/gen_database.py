import mysql.connector
import uuid
import random
import datetime
import hashlib
from faker import Faker

# Initialize Faker for generating descriptions
fake = Faker()

# Database connection configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'your_username',  # Replace with your MySQL username
    'password': 'your_password',  # Replace with your MySQL password
    'database': 'lbdr_db'
}

# Configuration
SQL_FILE_PATH = './Database/test_data.sql'
DB_NAME = 'lbdr_db'

# Data pools
first_names = ["Alice", "Bob", "Charlie", "David", "Emma", "Fiona", "George", "Hannah", "Ian", "Julia",
               "Kevin", "Laura", "Michael", "Nina", "Oliver", "Paul", "Quinn", "Rachel", "Steven", "Tina"]
last_names = ["Martin", "Dupont", "Schneider", "Rossi", "Smith", "Nguyen", "Kumar", "Lopez", "Brown", "Müller"]
sexes = ["M", "F", "Other"]
board_games = ["Fallout", "King of New York", "King of Tokyo", "Zombicide", 
               "Darkest Dungeon", "Root", "Pour la reine", "Gloomhaven", "Pandemic"]
jdr_games = ["1D8", "7ème Mer", "Advanced Bernard&Jean", "Adventure Party", "Agone", 
             "Alien", "An 1000", "Anima", "Appel de Cthulhu", "ARIA"]

def random_date(start_year=1970, end_year=2002):
    start = datetime.date(start_year, 1, 1)
    end = datetime.date(end_year, 12, 31)
    return start + datetime.timedelta(days=random.randint(0, (end - start).days))

def random_registration_date():
    start = datetime.date(2020, 1, 1)
    end = datetime.date.today()
    return start + datetime.timedelta(days=random.randint(0, (end - start).days))

def make_user(fn, ln, user_type, pwd_plain):
    uid = str(uuid.uuid4())
    bd = random_date().isoformat()
    sex = random.choice(sexes)
    discord = f"{fn.lower()}#{random.randint(1000,9999)}"
    pseudo = fn.lower() + str(random.randint(1,99))
    username = fn.lower() + "." + ln.lower() + str(random.randint(1,99))
    email = username + "@example.com"
    salt = uuid.uuid4().hex[:8]
    pwd_hash = hashlib.sha256((salt + pwd_plain).encode()).hexdigest()
    reg_date = random_registration_date().isoformat() if user_type != "NON_REGISTERED" else None
    return {
        'id': uid,
        'first_name': fn,
        'last_name': ln,
        'birth_date': bd,
        'sex': sex,
        'discord_id': discord,
        'pseudonym': pseudo,
        'email': email,
        'username': username,
        'password_hash': pwd_hash,
        'password_salt': salt,
        'user_type': user_type,
        'registration_date': reg_date,
        'old_user': False,
        'first_connection': False
    }

def generate_description(game_name):
    return fake.paragraph(nb_sentences=3, variable_nb_sentences=True).replace("'", "''")

def generate_short_description(game_name, game_type):
    return f"{game_type} de {game_name}".replace("'", "''")

def get_first_sunday(month, year=2025):
    d = datetime.date(year, month, 1)
    while d.weekday() != 6:  # Sunday
        d += datetime.timedelta(days=1)
    return d

# Connect to database
try:
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()
    print("Connected to database")
except mysql.connector.Error as err:
    print(f"Error connecting to database: {err}")
    exit(1)

# Generate users
users = []
for i in range(50):
    fn = first_names[i % len(first_names)]
    ln = last_names[i % len(last_names)]
    users.append(make_user(fn, ln, "REGISTERED", fn.lower()))
users.append(make_user("Admin", "User", "ADMINISTRATOR", "admin"))

# Insert users
user_insert = """
INSERT INTO users (id, first_name, last_name, birth_date, sex, discord_id, pseudonym, email, username, 
                 password_hash, password_salt, user_type, registration_date, old_user, first_connection)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""
for user in users:
    cursor.execute(user_insert, (
        user['id'], user['first_name'], user['last_name'], user['birth_date'], user['sex'],
        user['discord_id'], user['pseudonym'], user['email'], user['username'],
        user['password_hash'], user['password_salt'], user['user_type'],
        user['registration_date'], user['old_user'], user['first_connection']
    ))

# Insert locations
locations = [
    {"name": "Saint Vincent Center", "address": "123 Rue Saint Vincent, Orléans", "latitude": 47.9029, "longitude": 1.9040},
    {"name": "Orléans Community Center", "address": "456 Avenue de la Communauté, Orléans", "latitude": 47.9129, "longitude": 1.9140}
]
location_insert = """
INSERT INTO locations (name, address, latitude, longitude, description)
VALUES (%s, %s, %s, %s, %s)
"""
location_ids = {}
for loc in locations:
    cursor.execute(location_insert, (
        loc['name'], loc['address'], loc['latitude'], loc['longitude'],
        f"Description for {loc['name']}".replace("'", "''")
    ))
    cursor.execute("SELECT LAST_INSERT_ID()")
    location_ids[loc['name']] = cursor.fetchone()[0]

# Insert regular schedules
schedule_insert = """
INSERT INTO location_schedule (location_id, start_time, end_time, recurrence_type, recurrence_pattern)
VALUES (%s, %s, %s, %s, %s)
"""
cursor.execute(schedule_insert, (
    location_ids["Saint Vincent Center"], "19:15:00", "01:00:00", "WEEKLY",
    '{"byDay":"FR","interval":1}'
))
cursor.execute(schedule_insert, (
    location_ids["Orléans Community Center"], "14:00:00", "20:00:00", "WEEKLY",
    '{"byDay":"SA","interval":1}'
))

# Insert association weekend events and schedules
event_insert = """
INSERT INTO events (name, description, start_date, end_date, location_id)
VALUES (%s, %s, %s, %s, %s)
"""
event_ids = []
for month in range(1, 7):
    sunday = get_first_sunday(month)
    friday = sunday - datetime.timedelta(days=2)
    cursor.execute(event_insert, (
        f"Association Weekend {month}", "Monthly gaming event", friday.isoformat(),
        sunday.isoformat(), location_ids["Saint Vincent Center"]
    ))
    cursor.execute("SELECT LAST_INSERT_ID()")
    event_id = cursor.fetchone()[0]
    event_ids.append(event_id)
    
    # Friday schedule
    cursor.execute(schedule_insert, (
        location_ids["Saint Vincent Center"], "19:15:00", "01:00:00", "NONE",
        f'{{"event_id":{event_id}}}'
    ))
    # Saturday schedule
    cursor.execute(schedule_insert, (
        location_ids["Saint Vincent Center"], "10:00:00", "01:00:00", "NONE",
        f'{{"event_id":{event_id}}}'
    ))
    # Sunday schedule
    cursor.execute(schedule_insert, (
        location_ids["Saint Vincent Center"], "10:00:00", "01:00:00", "NONE",
        f'{{"event_id":{event_id}}}'
    ))

# Insert games
game_insert = """
INSERT INTO games (name, description, type)
VALUES (%s, %s, %s)
"""
game_ids = {}
all_games = board_games + jdr_games
for game in all_games:
    game_type = "BOARD_GAME" if game in board_games else "JDR"
    cursor.execute(game_insert, (
        game, generate_description(game), game_type
    ))
    cursor.execute("SELECT LAST_INSERT_ID()")
    game_ids[game] = cursor.fetchone()[0]

# Generate parties
parties = []
closed_campaigns = 25
open_campaigns = 8
oneshots = 7  # 7 regular + 8 board game one-shots = 15 total one-shots
board_game_oneshots = 8
total_parties = closed_campaigns + open_campaigns + oneshots + board_game_oneshots

# Closed campaigns
for _ in range(closed_campaigns):
    game = random.choice(all_games)
    max_players = random.randint(4, 7)
    parties.append({
        "type": "CAMPAIGN", "campaign_type": "CLOSED", "game": game,
        "max_players": max_players, "mj_id": random.choice(users)['id']
    })

# Open campaigns
for _ in range(open_campaigns):
    game = random.choice(all_games)
    max_players = random.randint(4, 7)
    parties.append({
        "type": "CAMPAIGN", "campaign_type": "OPEN", "game": game,
        "max_players": max_players, "mj_id": random.choice(users)['id']
    })

# Regular one-shots
for _ in range(oneshots):
    game = random.choice(all_games)
    max_players = random.randint(4, 7)
    parties.append({
        "type": "ONESHOT", "campaign_type": None, "game": game,
        "max_players": max_players, "mj_id": random.choice(users)['id']
    })

# Board game one-shots on Association Weekend Sundays
sunday_dates = [get_first_sunday(month) for month in range(1, 7)]
sunday_dates = sunday_dates[:4] * 2  # 8 dates (2 per month for first 4 months)
for date in sunday_dates:
    game = random.choice(board_games)
    max_players = random.randint(4, 7)
    parties.append({
        "type": "BOARD_GAME", "campaign_type": None, "game": game,
        "max_players": max_players, "mj_id": random.choice(users)['id'],
        "session_date": date
    })

# Insert parties
partie_insert = """
INSERT INTO partie (game_id, mj_id, partie_type, campaign_type, short_description, description, max_players)
VALUES (%s, %s, %s, %s, %s, %s, %s)
"""
partie_ids = []
for p in parties:
    game_type = "BOARD_GAME" if p['game'] in board_games else "JDR"
    cursor.execute(partie_insert, (
        game_ids[p['game']], p['mj_id'], p['type'], p['campaign_type'],
        generate_short_description(p['game'], p['type']), generate_description(p['game']),
        p['max_players']
    ))
    cursor.execute("SELECT LAST_INSERT_ID()")
    partie_ids.append(cursor.fetchone()[0])

# Insert partie_members
partie_members_insert = """
INSERT INTO partie_members (partie_id, user_id)
VALUES (%s, %s)
"""
partie_members = []
for idx, p in enumerate(parties):
    if p['type'] == "CAMPAIGN":
        maxp = p['max_players']
        if p['campaign_type'] == "OPEN":
            count = maxp + random.randint(1, 3)
        else:
            count = random.randint(1, maxp)
        selected_users = random.sample(users, min(count, len(users)))
        for user in selected_users:
            cursor.execute(partie_members_insert, (partie_ids[idx], user['id']))
            partie_members.append((partie_ids[idx], user['id']))

# Generate sessions (Jan 1, 2025 to Jun 30, 2025)
session_insert = """
INSERT INTO sessions (partie_id, location_id, session_date, start_time, end_time, mj_id)
VALUES (%s, %s, %s, %s, %s, %s)
"""
sessions = []
for idx, p in enumerate(parties):
    if p['type'] == "CAMPAIGN":
        # Random date in first half of 2025
        session_date = datetime.date(2025, random.randint(1, 6), random.randint(1, 28))
        start_time = "19:15:00"
        end_time = "22:15:00"
        mj_id = p['mj_id']
        cursor.execute(session_insert, (
            partie_ids[idx], location_ids["Saint Vincent Center"],
            session_date, start_time, end_time, mj_id
        ))
        cursor.execute("SELECT LAST_INSERT_ID()")
        sessions.append({"id": cursor.fetchone()[0], "partie_id": partie_ids[idx]})
    elif p['type'] == "BOARD_GAME" and 'session_date' in p:
        # Board game one-shots on Sundays
        start_time = "14:00:00"
        end_time = "17:00:00"
        mj_id = p['mj_id']
        cursor.execute(session_insert, (
            partie_ids[idx], location_ids["Saint Vincent Center"],
            p['session_date'], start_time, end_time, mj_id
        ))
        cursor.execute("SELECT LAST_INSERT_ID()")
        sessions.append({"id": cursor.fetchone()[0], "partie_id": partie_ids[idx]})
    elif p['type'] == "ONESHOT":
        # Regular one-shots on Fridays
        session_date = datetime.date(2025, random.randint(1, 6), random.randint(1, 28))
        while session_date.weekday() != 4:  # Friday
            session_date += datetime.timedelta(days=1)
        start_time = "19:15:00"
        end_time = "22:15:00"
        mj_id = p['mj_id']
        cursor.execute(session_insert, (
            partie_ids[idx], location_ids["Saint Vincent Center"],
            session_date, start_time, end_time, mj_id
        ))
        cursor.execute("SELECT LAST_INSERT_ID()")
        sessions.append({"id": cursor.fetchone()[0], "partie_id": partie_ids[idx]})

# Insert session_players
session_players_insert = """
INSERT INTO session_players (session_id, user_id)
VALUES (%s, %s)
"""
for session in sessions:
    partie_id = session['partie_id']
    partie_idx = partie_ids.index(partie_id)
    p = parties[partie_idx]
    maxp = p['max_players']
    if p['type'] == "CAMPAIGN":
        # Only partie_members can register
        members = [m[1] for m in partie_members if m[0] == partie_id]
        if members:
            selected = random.sample(members, min(len(members), maxp))
            for user_id in selected:
                cursor.execute(session_players_insert, (session['id'], user_id))
    else:
        # Any user can register for one-shots and board games
        selected = random.sample(users, min(len(users), maxp))
        for user in selected:
            cursor.execute(session_players_insert, (session['id'], user['id']))

# Commit changes and close connection
conn.commit()
cursor.close()
conn.close()
print("Test data generated and inserted into database")

# Optionally, write SQL file for reference
with open(SQL_FILE_PATH, 'w', encoding='utf-8') as f:
    f.write(f"USE {DB_NAME};\n\n")
    # Users
    f.write("INSERT INTO users (id, first_name, last_name, birth_date, sex, discord_id, pseudonym, email, username, password_hash, password_salt, user_type, registration_date, old_user, first_connection) VALUES\n")
    f.write(",\n".join([f"('{u['id']}', '{u['first_name']}', '{u['last_name']}', '{u['birth_date']}', '{u['sex']}', '{u['discord_id']}', '{u['pseudonym']}', '{u['email']}', '{u['username']}', '{u['password_hash']}', '{u['password_salt']}', '{u['user_type']}', {'NULL' if u['registration_date'] is None else f'\'{u['registration_date']}\''}, {u['old_user']}, {u['first_connection']})" for u in users]) + ";\n\n")
    # Locations
    f.write("INSERT INTO locations (name, address, latitude, longitude, description) VALUES\n")
    f.write(",\n".join([f"('{loc['name']}', '{loc['address']}', {loc['latitude']}, {loc['longitude']}, 'Description for {loc['name']}')" for loc in locations]) + ";\n\n")
    # Games
    f.write("INSERT INTO games (name, description, type) VALUES\n")
    f.write(",\n".join([f"('{game}', '{generate_description(game)}', '{'BOARD_GAME' if game in board_games else 'JDR'}')" for game in all_games]) + ";\n\n")
    # Parties, partie_members, sessions, and session_players would require mapping IDs from DB
    f.write("-- Additional inserts for parties, members, sessions, and session_players are generated directly in the database\n")
print(f"SQL file written to {SQL_FILE_PATH}")