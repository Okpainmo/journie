from datetime import datetime
from typing import List, Optional
from ninja import NinjaAPI, Router, Schema
from django.shortcuts import get_object_or_404
from .models import Entry
from utils.auth import AuthBearer

entry_router = Router()

# Schema for input data
class EntryIn(Schema):
    entry_title: str
    entry_location: str
    entry_body: str
    entry_index: Optional[int] = None

# Schema for output data
class EntryOut(Schema):
    id: int
    entry_title: str
    entry_location: str
    entry_body: str
    entry_index: Optional[int]
    created_by: int
    created_at: datetime
    updated_at: datetime

# Create entry
# @entry_router.post("/create-entry", auth=AuthBearer())
@entry_router.post("/create-entry", response={200: EntryOut})
def create_entry(request, payload: EntryIn):
    # Create an Entry instance
    entry = Entry.objects.create(**payload.dict())
    return entry  # The schema `EntryOut` handles serialization

# Get a single entry
# @entry_router.get("/get-entry/{entry_id}", response=EntryOut, auth=AuthBearer())
# def get_entry(request, entry_id: int):
#     entry = get_object_or_404(Entry, id=entry_id, created_by=request.auth)
#     return entry

# Get all entries for a user
# @entry_router.get("/get-all-entries", response=List[EntryOut], auth=AuthBearer())
# def get_all_entries(request):
#     entries = Entry.objects.filter(created_by=request.auth)
#     return entries

# Delete entry
# @entry_router.delete("/delete-entry/{entry_id}", auth=AuthBearer())
# def delete_entry(request, entry_id: int):
#     entry = get_object_or_404(Entry, id=entry_id, created_by=request.auth)
#     entry.delete()
#     return {"requestStatus": "entry deleted successfully"}

# Edit entry
# @entry_router.patch("/edit-entry/{entry_id}", response=EntryOut, auth=AuthBearer())
# def edit_entry(request, entry_id: int, payload: EntryIn):
#     entry = get_object_or_404(Entry, id=entry_id, created_by=request.auth)
#     for attr, value in payload.dict(exclude_unset=True).items():
#         setattr(entry, attr, value)
#     entry.save()
#     return entry


