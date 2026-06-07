import os
import sys
import argparse
import random
from datetime import datetime, timedelta
from faker import Faker
from sqlalchemy.orm import Session
from decimal import Decimal

# Ensure backend directory is in path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.session import engine, SessionLocal
from app.models.base import Base
from app.core import security
# Import all models to ensure they are registered with Base metadata
from app.models.user import User, Role, Permission
from app.models.location import District, PoliceStation
from app.models.crime import CrimeType, Crime, CrimeStatusHistory
from app.models.entities import Suspect, SuspectCrime, Victim, VictimCrime, Vehicle, CrimeVehicle, Evidence
from app.models.investigation import Investigation, InvestigationNote
from app.models.analytics import Report, AIConversation, AIMessage, AIQueryLog, CrimePrediction, HotspotAnalysis, AuditLog, Notification

fake = Faker('en_IN')

# Data Constants
DISTRICTS = [
    "Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Mangaluru", "Hubballi-Dharwad",
    "Belagavi", "Shivamogga", "Tumakuru", "Ballari", "Vijayapura", "Kalaburagi",
    "Raichur", "Kolar", "Chikkaballapur", "Ramanagara", "Mandya", "Hassan",
    "Kodagu", "Udupi", "Chitradurga"
]

CRIME_TYPES_DATA = [
    {"name": "Theft", "category": "Property", "ipc": "IPC 378", "severity": 3, "weight": 35},
    {"name": "Vehicle Theft", "category": "Property", "ipc": "IPC 379", "severity": 4, "weight": 20},
    {"name": "Burglary", "category": "Property", "ipc": "IPC 454", "severity": 6, "weight": 15},
    {"name": "Fraud", "category": "Financial", "ipc": "IPC 420", "severity": 5, "weight": 10},
    {"name": "Cyber Crime", "category": "Cyber", "ipc": "IT Act 66", "severity": 6, "weight": 10},
    {"name": "Assault", "category": "Violent", "ipc": "IPC 351", "severity": 7, "weight": 5},
    {"name": "Other", "category": "Miscellaneous", "ipc": "Various", "severity": 2, "weight": 5},
]

def drop_and_create_tables():
    print("Dropping all existing tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables from schema...")
    Base.metadata.create_all(bind=engine)

def seed_districts(db: Session):
    print(f"Seeding {len(DISTRICTS)} districts...")
    district_objs = []
    for d in DISTRICTS:
        dist = District(
            district_name=d,
            district_code=d[:3].upper() + str(random.randint(10, 99))
        )
        db.add(dist)
        district_objs.append(dist)
    db.commit()
    return district_objs

def seed_police_stations(db: Session, districts: list):
    print("Seeding police stations...")
    stations = []
    for district in districts:
        # Generate 5 stations per district
        for i in range(5):
            # Karnataka rough bounding box: Lat 11.5-18.5, Lon 74.0-78.5
            lat = random.uniform(11.5, 18.5)
            lon = random.uniform(74.0, 78.5)
            
            # Tweak coords for specific clusters if needed, but random is fine for now
            if district.district_name == "Bengaluru Urban":
                lat = random.uniform(12.9, 13.1)
                lon = random.uniform(77.5, 77.7)
            elif district.district_name == "Mysuru":
                lat = random.uniform(12.2, 12.4)
                lon = random.uniform(76.5, 76.7)
                
            station = PoliceStation(
                district_id=district.id,
                station_name=f"{district.district_name} Station {i+1}",
                station_code=f"{district.district_code}-S{i+1}",
                latitude=Decimal(str(round(lat, 6))),
                longitude=Decimal(str(round(lon, 6))),
                address=fake.address()
            )
            db.add(station)
            stations.append(station)
    db.commit()
    return stations

def seed_users_and_roles(db: Session, stations: list):
    print("Seeding roles and users (officers)...")
    admin_role = Role(name="Admin", description="System Administrator")
    officer_role = Role(name="Officer", description="Investigating Officer")
    db.add_all([admin_role, officer_role])
    db.commit()
    
    users = []
    # Create an admin
    admin = User(
        badge_number="ADM001",
        first_name="Super",
        last_name="Admin",
        email="admin@ksp.gov.in",
        password_hash=security.get_password_hash("password123"),
        role_id=admin_role.id
    )
    db.add(admin)
    users.append(admin)
    
    # Create 50 officers
    for i in range(50):
        station = random.choice(stations)
        officer = User(
            badge_number=f"KSP{random.randint(1000, 9999)}",
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            email=f"officer{i}@ksp.gov.in",
            phone=fake.phone_number()[:20],
            password_hash=security.get_password_hash("password123"),
            role_id=officer_role.id,
            station_id=station.id
        )
        db.add(officer)
        users.append(officer)
    
    db.commit()
    return users

def seed_crime_types(db: Session):
    print("Seeding crime types...")
    types = []
    for ct in CRIME_TYPES_DATA:
        ctype = CrimeType(
            name=ct["name"],
            category=ct["category"],
            ipc_sections=ct["ipc"],
            severity_level=ct["severity"]
        )
        db.add(ctype)
        types.append((ctype, ct["weight"])) # Store weight for distribution
    db.commit()
    return types

def seed_suspects(db: Session):
    print("Seeding 500 suspects...")
    suspects = []
    for i in range(500):
        suspect = Suspect(
            full_name=fake.name(),
            alias_name=fake.first_name() if random.random() > 0.5 else None,
            gender=random.choice(["Male", "Female"]),
            age=random.randint(18, 65),
            dob=fake.date_of_birth(minimum_age=18, maximum_age=65),
            identification_number=f"AADHAAR-{random.randint(100000000000, 999999999999)}",
            risk_score=Decimal(str(round(random.uniform(1.0, 10.0), 1)))
        )
        db.add(suspect)
        suspects.append(suspect)
    db.commit()
    return suspects

def seed_vehicles(db: Session):
    print("Seeding 300 vehicles...")
    vehicles = []
    vehicle_types = ["2-Wheeler", "4-Wheeler", "Commercial", "Truck"]
    for i in range(300):
        v = Vehicle(
            registration_number=f"KA-{random.randint(1, 55):02d}-{random.choice(['A','B','C','D','E'])}{random.choice(['A','B','C','D','E'])}-{random.randint(1000, 9999)}",
            vehicle_type=random.choices(vehicle_types, weights=[60, 30, 5, 5])[0],
            manufacturer=fake.company(),
            model=fake.word(),
            owner_name=fake.name()
        )
        db.add(v)
        vehicles.append(v)
    db.commit()
    return vehicles

def seed_crimes(db: Session, districts: list, stations: list, users: list, crime_types: list, suspects: list, vehicles: list):
    print("Seeding 1000 crime records with relationships...")
    
    types_list = [t[0] for t in crime_types]
    weights = [t[1] for t in crime_types]
    
    crimes = []
    for i in range(1000):
        # Hotspot logic adjustments
        # Mysuru: Higher Theft
        # Mangaluru: Fraud
        # Bengaluru: Cyber / Vehicle Theft
        station = random.choice(stations)
        dist_name = station.district.district_name
        
        current_weights = weights.copy()
        if dist_name == "Mysuru":
            current_weights[0] += 20 # Boost Theft
        elif dist_name == "Mangaluru":
            current_weights[3] += 20 # Boost Fraud
        elif dist_name == "Bengaluru Urban":
            current_weights[4] += 20 # Boost Cyber
            current_weights[1] += 10 # Boost Vehicle Theft
            
        chosen_type = random.choices(types_list, weights=current_weights)[0]
        officer = random.choice(users)
        
        occurrence = fake.date_time_between(start_date='-2y', end_date='now')
        reported = occurrence + timedelta(hours=random.randint(1, 48))
        
        # Jitter coordinates slightly from station
        lat = float(station.latitude) + random.uniform(-0.05, 0.05)
        lon = float(station.longitude) + random.uniform(-0.05, 0.05)
        
        crime = Crime(
            fir_number=f"FIR-{occurrence.year}-{station.station_code}-{i:04d}-{random.randint(10,99)}",
            crime_type_id=chosen_type.id,
            station_id=station.id,
            district_id=station.district_id,
            title=f"{chosen_type.name} reported at {fake.street_name()}",
            description=fake.text(max_nb_chars=300),
            occurrence_date=occurrence,
            reported_date=reported,
            latitude=Decimal(str(round(lat, 6))),
            longitude=Decimal(str(round(lon, 6))),
            status=random.choices(["Open", "Under Investigation", "Closed", "Charge Sheet Filed"], weights=[20, 40, 30, 10])[0],
            estimated_loss=Decimal(str(random.randint(1000, 500000))) if chosen_type.category in ["Property", "Financial", "Cyber"] else Decimal("0"),
            created_by=officer.id
        )
        db.add(crime)
        crimes.append(crime)
        
        # Flush periodically to get crime IDs without committing the whole transaction yet
        if i % 100 == 0:
            db.flush()
            
    db.commit()
    
    print("Linking Suspects and Vehicles to Crimes...")
    # Add suspects to crimes (some crimes have none, some have multiple)
    for crime in crimes:
        if random.random() > 0.4: # 60% chance to have a suspect
            num_suspects = random.randint(1, 3)
            assigned_suspects = random.sample(suspects, num_suspects)
            for s in assigned_suspects:
                sc = SuspectCrime(
                    suspect_id=s.id,
                    crime_id=crime.id,
                    role=random.choice(["Primary Suspect", "Accomplice", "Mastermind"])
                )
                db.add(sc)
                
        # If vehicle theft, MUST link a vehicle. Otherwise 10% chance
        if crime.crime_type.name == "Vehicle Theft" or random.random() > 0.9:
            assigned_vehicle = random.choice(vehicles)
            cv = CrimeVehicle(
                crime_id=crime.id,
                vehicle_id=assigned_vehicle.id
            )
            db.add(cv)

    db.commit()
    print("Crime generation complete.")

def run_verification(db: Session):
    print("\n--- DATABASE VERIFICATION ---")
    
    crime_count = db.query(Crime).count()
    suspect_count = db.query(Suspect).count()
    vehicle_count = db.query(Vehicle).count()
    station_count = db.query(PoliceStation).count()
    
    print(f"Total Crime Records: {crime_count}")
    print(f"Total Suspects: {suspect_count}")
    print(f"Total Vehicles: {vehicle_count}")
    print(f"Total Police Stations: {station_count}")
    
    print("\nDistrict Distribution:")
    from sqlalchemy import func
    district_counts = db.query(District.district_name, func.count(Crime.id)).\
        join(Crime, District.id == Crime.district_id).\
        group_by(District.district_name).\
        order_by(func.count(Crime.id).desc()).limit(10).all()
        
    for d, count in district_counts:
        print(f" - {d}: {count} crimes")
        
    print("\nMysuru Theft Sample:")
    mysuru_thefts = db.query(Crime.title, Crime.status, Crime.occurrence_date).\
        join(District).\
        join(CrimeType).\
        filter(District.district_name == 'Mysuru').\
        filter(CrimeType.name == 'Theft').\
        limit(3).all()
        
    for t in mysuru_thefts:
        print(f" - {t.title} | {t.status} | {t.occurrence_date}")

    print("-----------------------------\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed the KCIA database.")
    parser.add_argument("--reset", action="store_true", help="Drop and recreate all tables.")
    parser.add_argument("--verify", action="store_true", help="Run verification queries after seeding.")
    
    args = parser.parse_args()
    
    db = SessionLocal()
    
    try:
        if args.reset:
            drop_and_create_tables()
            districts = seed_districts(db)
            stations = seed_police_stations(db, districts)
            users = seed_users_and_roles(db, stations)
            crime_types = seed_crime_types(db)
            suspects = seed_suspects(db)
            vehicles = seed_vehicles(db)
            seed_crimes(db, districts, stations, users, crime_types, suspects, vehicles)
            print("\nDatabase seeding completed successfully.")
        else:
            print("No --reset flag provided. Skipping seed execution to prevent duplicates.")
            
        if args.verify:
            run_verification(db)
            
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()
