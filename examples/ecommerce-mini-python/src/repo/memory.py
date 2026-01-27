from typing import Dict, List, Optional, TypeVar, Generic

T = TypeVar('T')

class MemoryRepo(Generic[T]):
    def __init__(self):
        self._data: Dict[str, T] = {}

    def save(self, id: str, item: T):
        self._data[id] = item

    def find_by_id(self, id: str) -> Optional[T]:
        return self._data.get(id)

    def find_all(self) -> List[T]:
        return list(self._data.values())
