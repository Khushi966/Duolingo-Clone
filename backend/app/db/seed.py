from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.db.base import Base, engine, SessionLocal
from app.models.models import (
    User,
    Course,
    Unit,
    Skill,
    Lesson,
    Exercise,
    SkillProgress,
    LessonAttempt,
    Achievement,
    UserAchievement,
    LeagueMembership,
    DevSetting,
)
from app.services.dev_service import SIMULATED_DATE_KEY, INITIAL_DEFAULT_DATE, get_current_week_start


def seed_db(db: Session = None):
    close_after = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        close_after = True

    try:
        # Idempotent check: only run if users table is empty
        if db.query(User).count() > 0:
            print("Database already seeded. Skipping...")
            return

        print("Seeding database...")

        # 1. Dev Setting
        db.add(DevSetting(key=SIMULATED_DATE_KEY, value=INITIAL_DEFAULT_DATE))

        # 2. Main Learner (user_id=1)
        learner = User(
            id=1,
            username="carlos_polyglot",
            display_name="Carlos M.",
            avatar_url="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
            current_streak=4,
            longest_streak=9,
            last_activity_date="2026-09-24",
            total_xp=340,
            hearts_current=3,
            hearts_max=5,
            last_heart_lost_at=datetime(2026, 9, 25, 11, 45, 0),
            gems=120,
            daily_goal_xp=50,
        )
        db.add(learner)

        # Additional Leaderboard Competitors
        other_users = [
            User(
                id=2,
                username="elena_languages",
                display_name="Elena Rostova",
                avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
                current_streak=18,
                longest_streak=25,
                last_activity_date="2026-09-25",
                total_xp=1420,
                hearts_current=5,
                hearts_max=5,
                gems=350,
                daily_goal_xp=50,
            ),
            User(
                id=3,
                username="marco_speed",
                display_name="Marco Silva",
                avatar_url="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
                current_streak=7,
                longest_streak=14,
                last_activity_date="2026-09-25",
                total_xp=980,
                hearts_current=4,
                hearts_max=5,
                gems=210,
                daily_goal_xp=50,
            ),
            User(
                id=4,
                username="sarah_lingo",
                display_name="Sarah Jenkins",
                avatar_url="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
                current_streak=3,
                longest_streak=10,
                last_activity_date="2026-09-24",
                total_xp=620,
                hearts_current=5,
                hearts_max=5,
                gems=90,
                daily_goal_xp=50,
            ),
            User(
                id=5,
                username="kenji_tokyo",
                display_name="Kenji Sato",
                avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                current_streak=1,
                longest_streak=5,
                last_activity_date="2026-09-23",
                total_xp=310,
                hearts_current=2,
                hearts_max=5,
                gems=45,
                daily_goal_xp=50,
            ),
            User(
                id=6,
                username="maya_study",
                display_name="Maya Patel",
                avatar_url="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
                current_streak=12,
                longest_streak=15,
                last_activity_date="2026-09-25",
                total_xp=890,
                hearts_current=5,
                hearts_max=5,
                gems=180,
                daily_goal_xp=50,
            ),
        ]
        db.add_all(other_users)
        db.flush()

        # 3. Weekly League Memberships
        week_start = get_current_week_start(db)
        league_entries = [
            LeagueMembership(user_id=2, week_start=week_start, xp_this_week=540),
            LeagueMembership(user_id=3, week_start=week_start, xp_this_week=410),
            LeagueMembership(user_id=1, week_start=week_start, xp_this_week=280),  # Learner Carlos
            LeagueMembership(user_id=6, week_start=week_start, xp_this_week=240),
            LeagueMembership(user_id=4, week_start=week_start, xp_this_week=160),
            LeagueMembership(user_id=5, week_start=week_start, xp_this_week=90),
        ]
        db.add_all(league_entries)

        # 4. Achievements
        achievements = [
            Achievement(
                id=1,
                title="Wildfire (3-Day Streak)",
                description="Reach a 3-day learning streak without missing a day.",
                icon="flame",
            ),
            Achievement(
                id=2,
                title="XP Titan",
                description="Accumulate 500 total XP on your language journey.",
                icon="zap",
            ),
            Achievement(
                id=3,
                title="Sharp Mind",
                description="Complete 5 lessons with 100% accuracy without losing a heart.",
                icon="heart",
            ),
        ]
        db.add_all(achievements)
        db.flush()

        # Unlock Achievement 1 for Learner
        db.add(
            UserAchievement(
                user_id=1,
                achievement_id=1,
                unlocked_at=datetime(2026, 9, 23, 16, 30, 0, tzinfo=timezone.utc),
            )
        )

        # 5. Course: Spanish
        course = Course(
            id=1,
            title="Spanish",
            language_code="es",
            description="Master everyday Spanish from essential greetings to conversational fluency.",
        )
        db.add(course)
        db.flush()

        # 6. Units
        unit1 = Unit(
            id=1,
            course_id=course.id,
            title="Unit 1: Basics",
            order_index=1,
            theme_color="#58CC02",  # Duolingo vibrant green
        )
        unit2 = Unit(
            id=2,
            course_id=course.id,
            title="Unit 2: Phrases & Travel",
            order_index=2,
            theme_color="#1CB0F6",  # Vibrant blue
        )
        db.add_all([unit1, unit2])
        db.flush()

        # 7. Skills
        # Unit 1 Skills: Greetings, Family, Food
        skill_greetings = Skill(id=1, unit_id=unit1.id, title="Greetings", icon="handshake", order_index=1)
        skill_family = Skill(id=2, unit_id=unit1.id, title="Family", icon="users", order_index=2)
        skill_food = Skill(id=3, unit_id=unit1.id, title="Food", icon="utensils", order_index=3)

        # Unit 2 Skills: Verbs: To Be, Numbers, Travel
        skill_verbs = Skill(id=4, unit_id=unit2.id, title="Verbs: To Be", icon="book-open", order_index=1)
        skill_numbers = Skill(id=5, unit_id=unit2.id, title="Numbers", icon="binary", order_index=2)
        skill_travel = Skill(id=6, unit_id=unit2.id, title="Travel", icon="plane", order_index=3)

        db.add_all([skill_greetings, skill_family, skill_food, skill_verbs, skill_numbers, skill_travel])
        db.flush()

        # 8. Skill Progress for User 1
        progresses = [
            SkillProgress(
                user_id=1,
                skill_id=1,
                status="completed",
                crown_level=2,
                times_completed=4,
                last_practiced_at=datetime(2026, 9, 24, 15, 20, 0, tzinfo=timezone.utc),
            ),
            SkillProgress(
                user_id=1,
                skill_id=2,
                status="available",
                crown_level=1,
                times_completed=1,
                last_practiced_at=datetime(2026, 9, 24, 18, 10, 0, tzinfo=timezone.utc),
            ),
            SkillProgress(
                user_id=1,
                skill_id=3,
                status="available",
                crown_level=0,
                times_completed=0,
                last_practiced_at=None,
            ),
            SkillProgress(
                user_id=1,
                skill_id=4,
                status="locked",
                crown_level=0,
                times_completed=0,
                last_practiced_at=None,
            ),
            SkillProgress(
                user_id=1,
                skill_id=5,
                status="locked",
                crown_level=0,
                times_completed=0,
                last_practiced_at=None,
            ),
            SkillProgress(
                user_id=1,
                skill_id=6,
                status="locked",
                crown_level=0,
                times_completed=0,
                last_practiced_at=None,
            ),
        ]
        db.add_all(progresses)

        # 9. Lessons (2 per skill = 12 lessons total)
        lessons = [
            # Skill 1 (Greetings)
            Lesson(id=1, skill_id=1, order_index=1, lesson_type="regular"),
            Lesson(id=2, skill_id=1, order_index=2, lesson_type="regular"),
            # Skill 2 (Family)
            Lesson(id=3, skill_id=2, order_index=1, lesson_type="regular"),
            Lesson(id=4, skill_id=2, order_index=2, lesson_type="regular"),
            # Skill 3 (Food)
            Lesson(id=5, skill_id=3, order_index=1, lesson_type="regular"),
            Lesson(id=6, skill_id=3, order_index=2, lesson_type="regular"),
            # Skill 4 (Verbs: To Be)
            Lesson(id=7, skill_id=4, order_index=1, lesson_type="regular"),
            Lesson(id=8, skill_id=4, order_index=2, lesson_type="regular"),
            # Skill 5 (Numbers)
            Lesson(id=9, skill_id=5, order_index=1, lesson_type="regular"),
            Lesson(id=10, skill_id=5, order_index=2, lesson_type="regular"),
            # Skill 6 (Travel)
            Lesson(id=11, skill_id=6, order_index=1, lesson_type="regular"),
            Lesson(id=12, skill_id=6, order_index=2, lesson_type="regular"),
        ]
        db.add_all(lessons)
        db.flush()

        # 10. Exercises for each lesson (5 to 7 exercises per lesson mixing all 5 types!)
        exercises = [
            # -------------------------------------------------------------
            # LESSON 1 (Skill 1: Greetings - Part 1)
            # -------------------------------------------------------------
            Exercise(
                lesson_id=1,
                order_index=1,
                exercise_type="multiple_choice",
                prompt="Select the correct translation for 'Hello'",
                correct_answer="Hola",
                options=[
                    {"id": "Hola", "text": "Hola", "hint": "Greeting"},
                    {"id": "Adiós", "text": "Adiós", "hint": "Goodbye"},
                    {"id": "Gracias", "text": "Gracias", "hint": "Thank you"},
                ],
                meta_info={"audio_text": "Hola"},
            ),
            Exercise(
                lesson_id=1,
                order_index=2,
                exercise_type="translate_word_bank",
                prompt="Translate this sentence: 'Good morning, friend'",
                correct_answer={"text": "Buenos días amigo", "alternatives": ["Buenos dias amigo", "Buenos días, amigo"]},
                options=["Buenos", "días", "amigo", "noche", "adiós", "tarde", "gato"],
                meta_info={"hint": "Buenos días = Good morning"},
            ),
            Exercise(
                lesson_id=1,
                order_index=3,
                exercise_type="match_pairs",
                prompt="Match the Spanish words with their English meanings",
                correct_answer={"Hola": "Hello", "Adiós": "Goodbye", "Por favor": "Please", "Gracias": "Thank you"},
                options={
                    "left": ["Hola", "Adiós", "Por favor", "Gracias"],
                    "right": ["Goodbye", "Hello", "Thank you", "Please"],
                },
                meta_info={},
            ),
            Exercise(
                lesson_id=1,
                order_index=4,
                exercise_type="fill_blank",
                prompt="Mucho _____, Carlos.",
                correct_answer={"blank": "gusto", "alternatives": ["gusto"]},
                options=["gusto", "pan", "agua", "noche"],
                meta_info={"sentence": "Mucho _____ , Carlos.", "translation": "Nice to meet you, Carlos."},
            ),
            Exercise(
                lesson_id=1,
                order_index=5,
                exercise_type="type_answer",
                prompt="Type the Spanish word for 'Thank you':",
                correct_answer={"text": "Gracias", "alternatives": ["muchas gracias"]},
                options=None,
                meta_info={"hint": "Starts with 'G'"},
            ),

            # -------------------------------------------------------------
            # LESSON 2 (Skill 1: Greetings - Part 2)
            # -------------------------------------------------------------
            Exercise(
                lesson_id=2,
                order_index=1,
                exercise_type="multiple_choice",
                prompt="What does '¿Cómo estás?' mean?",
                correct_answer="How are you?",
                options=[
                    {"id": "How are you?", "text": "How are you?"},
                    {"id": "What is your name?", "text": "What is your name?"},
                    {"id": "Where are you from?", "text": "Where are you from?"},
                ],
                meta_info={},
            ),
            Exercise(
                lesson_id=2,
                order_index=2,
                exercise_type="match_pairs",
                prompt="Match the greetings",
                correct_answer={"Buenas noches": "Good night", "Hasta luego": "See you later", "Bien": "Well", "Mal": "Bad"},
                options={
                    "left": ["Buenas noches", "Hasta luego", "Bien", "Mal"],
                    "right": ["See you later", "Good night", "Bad", "Well"],
                },
                meta_info={},
            ),
            Exercise(
                lesson_id=2,
                order_index=3,
                exercise_type="translate_word_bank",
                prompt="Translate: 'I am very well, thanks'",
                correct_answer={"text": "Estoy muy bien gracias", "alternatives": ["Estoy muy bien, gracias"]},
                options=["Estoy", "muy", "bien", "gracias", "mal", "hola", "perro"],
                meta_info={},
            ),
            Exercise(
                lesson_id=2,
                order_index=4,
                exercise_type="fill_blank",
                prompt="Hasta _____, María.",
                correct_answer={"blank": "mañana", "alternatives": ["manana", "luego"]},
                options=["mañana", "ayer", "hola", "pan"],
                meta_info={"translation": "See you tomorrow, Maria."},
            ),
            Exercise(
                lesson_id=2,
                order_index=5,
                exercise_type="type_answer",
                prompt="Type 'Goodbye' in Spanish:",
                correct_answer={"text": "Adiós", "alternatives": ["Adios", "Chao", "Hasta luego"]},
                options=None,
                meta_info={},
            ),

            # -------------------------------------------------------------
            # LESSON 3 (Skill 2: Family - Part 1)
            # -------------------------------------------------------------
            Exercise(
                lesson_id=3,
                order_index=1,
                exercise_type="multiple_choice",
                prompt="Which word means 'The mother'?",
                correct_answer="La madre",
                options=[
                    {"id": "La madre", "text": "La madre"},
                    {"id": "El padre", "text": "El padre"},
                    {"id": "La hermana", "text": "La hermana"},
                ],
                meta_info={},
            ),
            Exercise(
                lesson_id=3,
                order_index=2,
                exercise_type="translate_word_bank",
                prompt="Translate to Spanish: 'My brother and my sister'",
                correct_answer={"text": "Mi hermano y mi hermana", "alternatives": ["Mi hermano y mi hermana"]},
                options=["Mi", "hermano", "y", "hermana", "padre", "gato", "el"],
                meta_info={},
            ),
            Exercise(
                lesson_id=3,
                order_index=3,
                exercise_type="match_pairs",
                prompt="Match the family members",
                correct_answer={"Padre": "Father", "Madre": "Mother", "Hijo": "Son", "Hija": "Daughter"},
                options={
                    "left": ["Padre", "Madre", "Hijo", "Hija"],
                    "right": ["Mother", "Father", "Daughter", "Son"],
                },
                meta_info={},
            ),
            Exercise(
                lesson_id=3,
                order_index=4,
                exercise_type="fill_blank",
                prompt="Ella es mi _____ favorita.",
                correct_answer={"blank": "abuela", "alternatives": ["abuela", "hermana", "madre"]},
                options=["abuela", "libro", "carro", "leche"],
                meta_info={"translation": "She is my favorite grandmother."},
            ),
            Exercise(
                lesson_id=3,
                order_index=5,
                exercise_type="type_answer",
                prompt="Type the Spanish word for 'Father':",
                correct_answer={"text": "Padre", "alternatives": ["El padre", "Papá", "Papa"]},
                options=None,
                meta_info={},
            ),

            # -------------------------------------------------------------
            # LESSON 4 (Skill 2: Family - Part 2)
            # -------------------------------------------------------------
            Exercise(
                lesson_id=4,
                order_index=1,
                exercise_type="multiple_choice",
                prompt="What is 'El abuelo'?",
                correct_answer="The grandfather",
                options=[
                    {"id": "The grandfather", "text": "The grandfather"},
                    {"id": "The uncle", "text": "The uncle"},
                    {"id": "The nephew", "text": "The nephew"},
                ],
                meta_info={},
            ),
            Exercise(
                lesson_id=4,
                order_index=2,
                exercise_type="match_pairs",
                prompt="Match the family words",
                correct_answer={"Tío": "Uncle", "Tía": "Aunt", "Primo": "Cousin", "Familia": "Family"},
                options={
                    "left": ["Tío", "Tía", "Primo", "Familia"],
                    "right": ["Aunt", "Uncle", "Family", "Cousin"],
                },
                meta_info={},
            ),
            Exercise(
                lesson_id=4,
                order_index=3,
                exercise_type="translate_word_bank",
                prompt="Translate: 'I have a big family'",
                correct_answer={"text": "Tengo una familia grande", "alternatives": ["Yo tengo una familia grande"]},
                options=["Tengo", "una", "familia", "grande", "pequeña", "somos", "el"],
                meta_info={},
            ),
            Exercise(
                lesson_id=4,
                order_index=4,
                exercise_type="fill_blank",
                prompt="Mi _____ es muy simpático.",
                correct_answer={"blank": "tío", "alternatives": ["tio", "hermano", "primo"]},
                options=["tío", "mesa", "carta", "agua"],
                meta_info={"translation": "My uncle is very friendly."},
            ),
            Exercise(
                lesson_id=4,
                order_index=5,
                exercise_type="type_answer",
                prompt="Type the Spanish word for 'Family':",
                correct_answer={"text": "Familia", "alternatives": ["La familia"]},
                options=None,
                meta_info={},
            ),

            # -------------------------------------------------------------
            # LESSON 5 (Skill 3: Food - Part 1)
            # -------------------------------------------------------------
            Exercise(
                lesson_id=5,
                order_index=1,
                exercise_type="multiple_choice",
                prompt="Which word means 'Water'?",
                correct_answer="Agua",
                options=[
                    {"id": "Agua", "text": "Agua"},
                    {"id": "Pan", "text": "Pan"},
                    {"id": "Queso", "text": "Queso"},
                ],
                meta_info={},
            ),
            Exercise(
                lesson_id=5,
                order_index=2,
                exercise_type="translate_word_bank",
                prompt="Translate to Spanish: 'I drink milk'",
                correct_answer={"text": "Yo bebo leche", "alternatives": ["Bebo leche", "Yo bebo leche"]},
                options=["Yo", "bebo", "leche", "como", "manzana", "pan", "jugo"],
                meta_info={},
            ),
            Exercise(
                lesson_id=5,
                order_index=3,
                exercise_type="match_pairs",
                prompt="Match foods to their translations",
                correct_answer={"Pan": "Bread", "Queso": "Cheese", "Manzana": "Apple", "Café": "Coffee"},
                options={
                    "left": ["Pan", "Queso", "Manzana", "Café"],
                    "right": ["Cheese", "Bread", "Coffee", "Apple"],
                },
                meta_info={},
            ),
            Exercise(
                lesson_id=5,
                order_index=4,
                exercise_type="fill_blank",
                prompt="El gato bebe _____ fresca.",
                correct_answer={"blank": "leche", "alternatives": ["leche", "agua"]},
                options=["leche", "carne", "zapato", "libro"],
                meta_info={"translation": "The cat drinks fresh milk."},
            ),
            Exercise(
                lesson_id=5,
                order_index=5,
                exercise_type="type_answer",
                prompt="Type 'Bread' in Spanish:",
                correct_answer={"text": "Pan", "alternatives": ["El pan"]},
                options=None,
                meta_info={},
            ),

            # -------------------------------------------------------------
            # LESSON 6 (Skill 3: Food - Part 2)
            # -------------------------------------------------------------
            Exercise(
                lesson_id=6,
                order_index=1,
                exercise_type="multiple_choice",
                prompt="What is 'La cena' in English?",
                correct_answer="Dinner",
                options=[
                    {"id": "Dinner", "text": "Dinner"},
                    {"id": "Breakfast", "text": "Breakfast"},
                    {"id": "Lunch", "text": "Lunch"},
                ],
                meta_info={},
            ),
            Exercise(
                lesson_id=6,
                order_index=2,
                exercise_type="match_pairs",
                prompt="Match Spanish food items",
                correct_answer={"Desayuno": "Breakfast", "Almuerzo": "Lunch", "Cena": "Dinner", "Postre": "Dessert"},
                options={
                    "left": ["Desayuno", "Almuerzo", "Cena", "Postre"],
                    "right": ["Lunch", "Breakfast", "Dessert", "Dinner"],
                },
                meta_info={},
            ),
            Exercise(
                lesson_id=6,
                order_index=3,
                exercise_type="translate_word_bank",
                prompt="Translate: 'We eat delicious pizza'",
                correct_answer={"text": "Comemos pizza deliciosa", "alternatives": ["Nosotros comemos pizza deliciosa", "Comemos una pizza deliciosa"]},
                options=["Comemos", "pizza", "deliciosa", "bebemos", "ensalada", "arroz", "carne"],
                meta_info={},
            ),
            Exercise(
                lesson_id=6,
                order_index=4,
                exercise_type="fill_blank",
                prompt="Quiero una taza de _____ caliente.",
                correct_answer={"blank": "café", "alternatives": ["cafe", "te"]},
                options=["café", "pan", "mesa", "pescado"],
                meta_info={"translation": "I want a cup of hot coffee."},
            ),
            Exercise(
                lesson_id=6,
                order_index=5,
                exercise_type="type_answer",
                prompt="Type 'Apple' in Spanish:",
                correct_answer={"text": "Manzana", "alternatives": ["La manzana", "una manzana"]},
                options=None,
                meta_info={},
            ),

            # -------------------------------------------------------------
            # LESSON 7 (Skill 4: Verbs: To Be - Part 1)
            # -------------------------------------------------------------
            Exercise(
                lesson_id=7,
                order_index=1,
                exercise_type="multiple_choice",
                prompt="Which verb is used for permanent characteristics (e.g. nationality)?",
                correct_answer="Ser",
                options=[
                    {"id": "Ser", "text": "Ser"},
                    {"id": "Estar", "text": "Estar"},
                    {"id": "Tener", "text": "Tener"},
                ],
                meta_info={},
            ),
            Exercise(
                lesson_id=7,
                order_index=2,
                exercise_type="translate_word_bank",
                prompt="Translate: 'I am a student'",
                correct_answer={"text": "Yo soy un estudiante", "alternatives": ["Soy estudiante", "Yo soy estudiante", "Soy un estudiante"]},
                options=["Yo", "soy", "un", "estudiante", "estoy", "eres", "doctor"],
                meta_info={},
            ),
            Exercise(
                lesson_id=7,
                order_index=3,
                exercise_type="match_pairs",
                prompt="Match pronouns with forms of 'Ser'",
                correct_answer={"Yo": "Soy", "Tú": "Eres", "Él/Ella": "Es", "Nosotros": "Somos"},
                options={
                    "left": ["Yo", "Tú", "Él/Ella", "Nosotros"],
                    "right": ["Eres", "Soy", "Somos", "Es"],
                },
                meta_info={},
            ),
            Exercise(
                lesson_id=7,
                order_index=4,
                exercise_type="fill_blank",
                prompt="Ella _____ muy inteligente.",
                correct_answer={"blank": "es", "alternatives": ["es"]},
                options=["es", "está", "son", "tengo"],
                meta_info={"translation": "She is very intelligent."},
            ),
            Exercise(
                lesson_id=7,
                order_index=5,
                exercise_type="type_answer",
                prompt="Type 'I am' (temporary condition, using estar):",
                correct_answer={"text": "Estoy", "alternatives": ["Yo estoy"]},
                options=None,
                meta_info={},
            ),

            # -------------------------------------------------------------
            # LESSON 8 (Skill 4: Verbs: To Be - Part 2)
            # -------------------------------------------------------------
            Exercise(
                lesson_id=8,
                order_index=1,
                exercise_type="multiple_choice",
                prompt="Choose the correct form: 'Nosotros _____ en la escuela'",
                correct_answer="estamos",
                options=[
                    {"id": "estamos", "text": "estamos"},
                    {"id": "somos", "text": "somos"},
                    {"id": "están", "text": "están"},
                ],
                meta_info={},
            ),
            Exercise(
                lesson_id=8,
                order_index=2,
                exercise_type="match_pairs",
                prompt="Match pronouns with forms of 'Estar'",
                correct_answer={"Yo": "Estoy", "Tú": "Estás", "Él": "Está", "Ellos": "Están"},
                options={
                    "left": ["Yo", "Tú", "Él", "Ellos"],
                    "right": ["Estás", "Estoy", "Están", "Está"],
                },
                meta_info={},
            ),
            Exercise(
                lesson_id=8,
                order_index=3,
                exercise_type="translate_word_bank",
                prompt="Translate: 'Where are you right now?'",
                correct_answer={"text": "¿Dónde estás ahora?", "alternatives": ["Donde estas ahora", "¿Dónde estás?", "Donde estas"]},
                options=["¿Dónde", "estás", "ahora?", "eres", "estamos", "aquí", "cuándo"],
                meta_info={},
            ),
            Exercise(
                lesson_id=8,
                order_index=4,
                exercise_type="fill_blank",
                prompt="El café _____ muy caliente hoy.",
                correct_answer={"blank": "está", "alternatives": ["esta", "es"]},
                options=["está", "son", "somos", "eres"],
                meta_info={"translation": "The coffee is very hot today."},
            ),
            Exercise(
                lesson_id=8,
                order_index=5,
                exercise_type="type_answer",
                prompt="Type the form of 'Ser' for 'We are':",
                correct_answer={"text": "Somos", "alternatives": ["Nosotros somos"]},
                options=None,
                meta_info={},
            ),

            # -------------------------------------------------------------
            # LESSON 9 (Skill 5: Numbers - Part 1)
            # -------------------------------------------------------------
            Exercise(
                lesson_id=9,
                order_index=1,
                exercise_type="multiple_choice",
                prompt="What is 'Tres' in English?",
                correct_answer="Three",
                options=[
                    {"id": "Three", "text": "Three"},
                    {"id": "Two", "text": "Two"},
                    {"id": "Four", "text": "Four"},
                ],
                meta_info={},
            ),
            Exercise(
                lesson_id=9,
                order_index=2,
                exercise_type="match_pairs",
                prompt="Match numbers 1 to 4",
                correct_answer={"Uno": "1", "Dos": "2", "Tres": "3", "Cuatro": "4"},
                options={
                    "left": ["Uno", "Dos", "Tres", "Cuatro"],
                    "right": ["2", "1", "4", "3"],
                },
                meta_info={},
            ),
            Exercise(
                lesson_id=9,
                order_index=3,
                exercise_type="translate_word_bank",
                prompt="Translate: 'I need five tickets'",
                correct_answer={"text": "Necesito cinco boletos", "alternatives": ["Yo necesito cinco boletos", "Necesito cinco entradas"]},
                options=["Necesito", "cinco", "boletos", "seis", "cuatro", "tengo", "dinero"],
                meta_info={},
            ),
            Exercise(
                lesson_id=9,
                order_index=4,
                exercise_type="fill_blank",
                prompt="Uno, dos, tres, _____ , cinco.",
                correct_answer={"blank": "cuatro", "alternatives": ["cuatro"]},
                options=["cuatro", "siete", "ocho", "diez"],
                meta_info={"translation": "One, two, three, four, five."},
            ),
            Exercise(
                lesson_id=9,
                order_index=5,
                exercise_type="type_answer",
                prompt="Type the Spanish word for the number '10':",
                correct_answer={"text": "Diez", "alternatives": ["diez"]},
                options=None,
                meta_info={},
            ),

            # -------------------------------------------------------------
            # LESSON 10 (Skill 5: Numbers - Part 2)
            # -------------------------------------------------------------
            Exercise(
                lesson_id=10,
                order_index=1,
                exercise_type="multiple_choice",
                prompt="How do you say 'Twenty' in Spanish?",
                correct_answer="Veinte",
                options=[
                    {"id": "Veinte", "text": "Veinte"},
                    {"id": "Treinta", "text": "Treinta"},
                    {"id": "Cincuenta", "text": "Cincuenta"},
                ],
                meta_info={},
            ),
            Exercise(
                lesson_id=10,
                order_index=2,
                exercise_type="match_pairs",
                prompt="Match larger numbers",
                correct_answer={"Diez": "10", "Veinte": "20", "Cincuenta": "50", "Cien": "100"},
                options={
                    "left": ["Diez", "Veinte", "Cincuenta", "Cien"],
                    "right": ["20", "10", "100", "50"],
                },
                meta_info={},
            ),
            Exercise(
                lesson_id=10,
                order_index=3,
                exercise_type="translate_word_bank",
                prompt="Translate: 'It costs fifteen euros'",
                correct_answer={"text": "Cuesta quince euros", "alternatives": ["Esto cuesta quince euros", "Son quince euros"]},
                options=["Cuesta", "quince", "euros", "veinte", "dólares", "tengo", "diez"],
                meta_info={},
            ),
            Exercise(
                lesson_id=10,
                order_index=4,
                exercise_type="fill_blank",
                prompt="Son las _____ en punto de la tarde.",
                correct_answer={"blank": "ocho", "alternatives": ["ocho", "dos", "tres", "cuatro", "seis"]},
                options=["ocho", "gato", "agua", "mesa"],
                meta_info={"translation": "It is eight o'clock in the afternoon."},
            ),
            Exercise(
                lesson_id=10,
                order_index=5,
                exercise_type="type_answer",
                prompt="Type the Spanish word for 'Zero':",
                correct_answer={"text": "Cero", "alternatives": ["cero"]},
                options=None,
                meta_info={},
            ),

            # -------------------------------------------------------------
            # LESSON 11 (Skill 6: Travel - Part 1)
            # -------------------------------------------------------------
            Exercise(
                lesson_id=11,
                order_index=1,
                exercise_type="multiple_choice",
                prompt="Which word means 'Airport'?",
                correct_answer="Aeropuerto",
                options=[
                    {"id": "Aeropuerto", "text": "Aeropuerto"},
                    {"id": "Estación", "text": "Estación"},
                    {"id": "Hotel", "text": "Hotel"},
                ],
                meta_info={},
            ),
            Exercise(
                lesson_id=11,
                order_index=2,
                exercise_type="translate_word_bank",
                prompt="Translate: 'Where is my passport?'",
                correct_answer={"text": "¿Dónde está mi pasaporte?", "alternatives": ["Donde esta mi pasaporte", "¿Dónde está el pasaporte?"]},
                options=["¿Dónde", "está", "mi", "pasaporte?", "boleto", "tu", "maleta"],
                meta_info={},
            ),
            Exercise(
                lesson_id=11,
                order_index=3,
                exercise_type="match_pairs",
                prompt="Match travel terms",
                correct_answer={"Avión": "Airplane", "Tren": "Train", "Maleta": "Suitcase", "Boleto": "Ticket"},
                options={
                    "left": ["Avión", "Tren", "Maleta", "Boleto"],
                    "right": ["Train", "Airplane", "Ticket", "Suitcase"],
                },
                meta_info={},
            ),
            Exercise(
                lesson_id=11,
                order_index=4,
                exercise_type="fill_blank",
                prompt="Necesito un taxi al _____ ahora.",
                correct_answer={"blank": "hotel", "alternatives": ["hotel", "aeropuerto"]},
                options=["hotel", "perro", "pan", "hermano"],
                meta_info={"translation": "I need a taxi to the hotel now."},
            ),
            Exercise(
                lesson_id=11,
                order_index=5,
                exercise_type="type_answer",
                prompt="Type 'Airplane' in Spanish:",
                correct_answer={"text": "Avión", "alternatives": ["Avion", "El avión", "El avion"]},
                options=None,
                meta_info={},
            ),

            # -------------------------------------------------------------
            # LESSON 12 (Skill 6: Travel - Part 2)
            # -------------------------------------------------------------
            Exercise(
                lesson_id=12,
                order_index=1,
                exercise_type="multiple_choice",
                prompt="What does '¡Buen viaje!' mean?",
                correct_answer="Have a good trip!",
                options=[
                    {"id": "Have a good trip!", "text": "Have a good trip!"},
                    {"id": "Good morning!", "text": "Good morning!"},
                    {"id": "Welcome back!", "text": "Welcome back!"},
                ],
                meta_info={},
            ),
            Exercise(
                lesson_id=12,
                order_index=2,
                exercise_type="match_pairs",
                prompt="Match navigation words",
                correct_answer={"Izquierda": "Left", "Derecha": "Right", "Recto": "Straight", "Cerca": "Near"},
                options={
                    "left": ["Izquierda", "Derecha", "Recto", "Cerca"],
                    "right": ["Right", "Left", "Near", "Straight"],
                },
                meta_info={},
            ),
            Exercise(
                lesson_id=12,
                order_index=3,
                exercise_type="translate_word_bank",
                prompt="Translate: 'I have a reservation at the hotel'",
                correct_answer={"text": "Tengo una reservación en el hotel", "alternatives": ["Tengo una reserva en el hotel", "Yo tengo una reservación en el hotel"]},
                options=["Tengo", "una", "reservación", "en", "el", "hotel", "cuarto"],
                meta_info={},
            ),
            Exercise(
                lesson_id=12,
                order_index=4,
                exercise_type="fill_blank",
                prompt="El tren sale a las _____ de la mañana.",
                correct_answer={"blank": "nueve", "alternatives": ["nueve", "ocho", "diez", "siete"]},
                options=["nueve", "agua", "carro", "nieve"],
                meta_info={"translation": "The train leaves at nine in the morning."},
            ),
            Exercise(
                lesson_id=12,
                order_index=5,
                exercise_type="type_answer",
                prompt="Type 'Hotel' in Spanish:",
                correct_answer={"text": "Hotel", "alternatives": ["El hotel"]},
                options=None,
                meta_info={},
            ),
        ]
        db.add_all(exercises)
        db.flush()

        # 11. Seeded Lesson Attempts for Learner (3-4 attempts)
        attempts = [
            LessonAttempt(
                user_id=1,
                lesson_id=1,
                started_at=datetime(2026, 9, 23, 14, 0, 0, tzinfo=timezone.utc),
                completed_at=datetime(2026, 9, 23, 14, 4, 30, tzinfo=timezone.utc),
                correct_count=5,
                incorrect_count=0,
                xp_earned=20,
                hearts_lost=0,
            ),
            LessonAttempt(
                user_id=1,
                lesson_id=2,
                started_at=datetime(2026, 9, 24, 10, 15, 0, tzinfo=timezone.utc),
                completed_at=datetime(2026, 9, 24, 10, 19, 45, tzinfo=timezone.utc),
                correct_count=5,
                incorrect_count=0,
                xp_earned=20,
                hearts_lost=0,
            ),
            LessonAttempt(
                user_id=1,
                lesson_id=3,
                started_at=datetime(2026, 9, 24, 18, 0, 0, tzinfo=timezone.utc),
                completed_at=datetime(2026, 9, 24, 18, 5, 12, tzinfo=timezone.utc),
                correct_count=4,
                incorrect_count=1,
                xp_earned=17,
                hearts_lost=1,
            ),
            LessonAttempt(
                user_id=1,
                lesson_id=1,
                started_at=datetime(2026, 9, 24, 21, 30, 0, tzinfo=timezone.utc),
                completed_at=datetime(2026, 9, 24, 21, 34, 0, tzinfo=timezone.utc),
                correct_count=5,
                incorrect_count=0,
                xp_earned=20,
                hearts_lost=0,
            ),
        ]
        db.add_all(attempts)

        db.commit()
        print("Database seeded successfully with Spanish course, units, skills, exercises, and learner data!")

    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise
    finally:
        if close_after:
            db.close()


if __name__ == "__main__":
    seed_db()
