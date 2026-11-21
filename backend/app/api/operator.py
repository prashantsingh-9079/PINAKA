import time
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import OperatorReview, Track, SystemEvent
from app.schemas.operator import OperatorReviewCreate, OperatorReviewResponse
from app.services.simulation_engine import simulation_engine

router = APIRouter()

@router.post("/operator/review", response_model=OperatorReviewResponse)
def submit_operator_review(review: OperatorReviewCreate, db: Session = Depends(get_db)):
    now = time.time()
    
    # Save review record
    db_review = OperatorReview(
        track_id=review.trackId,
        status=review.status,
        notes=review.notes,
        operator_id=review.operatorId or "OP-774",
        created_at=now
    )
    db.add(db_review)

    # Update in-memory simulation track state
    for trk in simulation_engine.tracks_state:
        if trk["id"] == review.trackId:
            trk["verificationStatus"] = review.status
            if review.notes:
                trk["operatorNotes"] = review.notes

    # Update track in DB
    db_trk = db.query(Track).filter_by(id=review.trackId).first()
    if db_trk:
        db_trk.verification_status = review.status
        if review.notes:
            db_trk.operator_notes = review.notes

    # Log system event
    severity = "critical" if review.status == "Verified Hostile" else "info" if review.status == "Authorized Flight" else "warning"
    evt = SystemEvent(
        id=f"EVT-{int(now * 1000) % 100000}",
        timestamp=time.strftime("%H:%M:%S UTC"),
        type="OPERATOR_OVERRIDE",
        severity=severity,
        title=f"Operator Verified {review.trackId}",
        message=f"Status set to '{review.status}'. {f'Note: {review.notes}' if review.notes else ''}",
        track_id=review.trackId
    )
    db.add(evt)
    db.commit()
    db.refresh(db_review)

    return {
        "id": db_review.id,
        "trackId": db_review.track_id,
        "status": db_review.status,
        "notes": db_review.notes,
        "operatorId": db_review.operator_id,
        "createdAt": db_review.created_at
    }

@router.get("/operator/reviews", response_model=List[OperatorReviewResponse])
def get_operator_reviews(db: Session = Depends(get_db)):
    reviews = db.query(OperatorReview).order_by(OperatorReview.created_at.desc()).limit(50).all()
    return [
        {
            "id": r.id,
            "trackId": r.track_id,
            "status": r.status,
            "notes": r.notes,
            "operatorId": r.operator_id,
            "createdAt": r.created_at
        }
        for r in reviews
    ]
