import unicodedata
import re
from typing import Any, Tuple, Dict


def normalize_text(text: Any) -> str:
    """
    Normalizes text for fuzzy matching:
    - Strips whitespace
    - Lowercase
    - Strips diacritics/accents (e.g. 'á' -> 'a', 'ñ' -> 'n', 'é' -> 'e', '¿' -> '')
    - Removes punctuation marks
    - Collapses multiple whitespace
    """
    if text is None:
        return ""
    if not isinstance(text, str):
        text = str(text)

    # Decompose unicode characters into base char + combining characters
    normalized = unicodedata.normalize("NFD", text)
    # Filter out combining marks (accents)
    stripped = "".join(ch for ch in normalized if unicodedata.category(ch) != "Mn")
    # Lowercase
    lowered = stripped.lower()
    # Remove punctuation
    cleaned = re.sub(r"[^\w\s]", "", lowered)
    # Collapse whitespace
    collapsed = re.sub(r"\s+", " ", cleaned).strip()
    return collapsed


def grade_exercise(exercise_type: str, correct_answer: Any, user_answer: Any) -> Tuple[bool, str]:
    """
    Grades a single exercise based on its type and returns (is_correct, feedback_note).
    """
    if user_answer is None:
        return False, "No answer provided."

    # 1. Multiple Choice
    if exercise_type == "multiple_choice":
        # correct_answer could be "id" string, exact text, or object { "id": "...", "text": "..." }
        if isinstance(correct_answer, dict):
            expected_id = correct_answer.get("id") or correct_answer.get("text")
            expected_text = correct_answer.get("text")
        else:
            expected_id = str(correct_answer)
            expected_text = str(correct_answer)

        if isinstance(user_answer, dict):
            actual_val = str(user_answer.get("id") or user_answer.get("text"))
        else:
            actual_val = str(user_answer)

        is_correct = (
            normalize_text(actual_val) == normalize_text(expected_id)
            or (expected_text and normalize_text(actual_val) == normalize_text(expected_text))
        )
        return is_correct, "Correct!" if is_correct else f"Correct answer: {expected_text or expected_id}"

    # 2. Translate Word Bank
    elif exercise_type == "translate_word_bank":
        # user_answer can be list of strings or string
        if isinstance(user_answer, list):
            user_str = " ".join(str(w) for w in user_answer)
        else:
            user_str = str(user_answer)

        if isinstance(correct_answer, list):
            correct_str = " ".join(str(w) for w in correct_answer)
            accepted = [correct_str] + [str(x) for x in correct_answer]
        elif isinstance(correct_answer, dict) and "text" in correct_answer:
            correct_str = str(correct_answer["text"])
            accepted = [correct_str] + correct_answer.get("alternatives", [])
        else:
            correct_str = str(correct_answer)
            accepted = [correct_str]

        norm_user = normalize_text(user_str)
        is_correct = any(normalize_text(acc) == norm_user for acc in accepted)
        return is_correct, "Nice job!" if is_correct else f"Correct translation: {correct_str}"

    # 3. Match Pairs
    elif exercise_type == "match_pairs":
        # correct_answer is typically dict of { prompt_item: matching_item }
        # or list of pairs [ [a, b], [c, d] ]
        expected_pairs: Dict[str, str] = {}
        if isinstance(correct_answer, dict):
            for k, v in correct_answer.items():
                expected_pairs[normalize_text(k)] = normalize_text(v)
        elif isinstance(correct_answer, list):
            for item in correct_answer:
                if isinstance(item, (list, tuple)) and len(item) == 2:
                    expected_pairs[normalize_text(item[0])] = normalize_text(item[1])

        # user_answer can be dict { item: match } or list of pairs
        user_pairs: Dict[str, str] = {}
        if isinstance(user_answer, dict):
            for k, v in user_answer.items():
                user_pairs[normalize_text(k)] = normalize_text(v)
        elif isinstance(user_answer, list):
            for item in user_answer:
                if isinstance(item, (list, tuple)) and len(item) == 2:
                    user_pairs[normalize_text(item[0])] = normalize_text(item[1])

        if not expected_pairs:
            return True, "All matched!"

        # Check all expected pairs are matched correctly (bidirectional tolerance)
        for k, v in expected_pairs.items():
            user_match = user_pairs.get(k)
            alt_match = [uk for uk, uv in user_pairs.items() if uv == k]
            if user_match != v and not (alt_match and user_pairs.get(alt_match[0]) == k and alt_match[0] == v):
                return False, "Not all pairs were matched correctly."

        return True, "All pairs matched perfectly!"

    # 4. Fill in the Blank
    elif exercise_type == "fill_blank":
        user_str = str(user_answer)
        if isinstance(correct_answer, dict):
            expected_word = correct_answer.get("blank") or correct_answer.get("text")
            alternatives = correct_answer.get("alternatives", [])
        elif isinstance(correct_answer, list):
            expected_word = str(correct_answer[0]) if correct_answer else ""
            alternatives = [str(x) for x in correct_answer]
        else:
            expected_word = str(correct_answer)
            alternatives = [expected_word]

        norm_user = normalize_text(user_str)
        is_correct = any(normalize_text(alt) == norm_user for alt in [expected_word] + list(alternatives))
        return is_correct, "Great!" if is_correct else f"Correct blank: {expected_word}"

    # 5. Type Answer (Fuzzy match)
    elif exercise_type == "type_answer":
        user_str = str(user_answer)
        if isinstance(correct_answer, dict):
            primary = correct_answer.get("text") or correct_answer.get("answer")
            alternatives = correct_answer.get("alternatives", [])
        elif isinstance(correct_answer, list):
            primary = str(correct_answer[0]) if correct_answer else ""
            alternatives = [str(x) for x in correct_answer]
        else:
            primary = str(correct_answer)
            alternatives = []

        accepted_list = [primary] + list(alternatives)
        norm_user = normalize_text(user_str)
        is_correct = any(normalize_text(acc) == norm_user for acc in accepted_list if acc)

        return is_correct, "Spot on!" if is_correct else f"Correct answer: {primary}"

    # Fallback
    else:
        norm_user = normalize_text(str(user_answer))
        norm_correct = normalize_text(str(correct_answer))
        is_correct = norm_user == norm_correct
        return is_correct, "Good!" if is_correct else f"Correct: {correct_answer}"
