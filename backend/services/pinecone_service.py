import os
import cohere
from pinecone import Pinecone

pc = None
index = None
co = None


def _init():
    global pc, index, co
    if pc is None:
        pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
        index = pc.Index(os.getenv("PINECONE_INDEX_NAME", "gtm-intelligence"))
        co = cohere.Client(os.getenv("COHERE_API_KEY"))


def embed_text(text: str) -> list[float]:
    _init()
    response = co.embed(
        texts=[text],
        model="embed-english-v3.0",
        input_type="search_document",
    )
    return response.embeddings[0]


def embed_query(text: str) -> list[float]:
    _init()
    response = co.embed(
        texts=[text],
        model="embed-english-v3.0",
        input_type="search_query",
    )
    return response.embeddings[0]


async def upsert_records(records: list[dict]) -> int:
    _init()
    vectors = []
    for i, record in enumerate(records):
        text = " | ".join(f"{k}: {v}" for k, v in record.items())
        embedding = embed_text(text)
        vectors.append({
            "id": f"record-{i}-{record.get('company', 'unknown')}".replace(" ", "-").lower(),
            "values": embedding,
            "metadata": {**record, "_text": text},
        })

    batch_size = 100
    for i in range(0, len(vectors), batch_size):
        batch = vectors[i:i + batch_size]
        index.upsert(vectors=batch)

    return len(vectors)


async def query_similar(query: str, top_k: int = 5) -> list[dict]:
    _init()
    embedding = embed_query(query)
    results = index.query(vector=embedding, top_k=top_k, include_metadata=True)
    return [
        {**match.metadata, "_score": match.score}
        for match in results.matches
    ]


def get_all_records(limit: int = 100) -> list[dict]:
    """Fetch all records from Pinecone."""
    _init()
    try:
        # Query with a neutral vector to get all records
        dummy_vector = [0.0] * 1024
        results = index.query(
            vector=dummy_vector,
            top_k=limit,
            include_metadata=True
        )
        return [match.metadata for match in results.matches
                if match.metadata]
    except Exception as e:
        print(f"[Pinecone] Error fetching all records: {e}")
        return []


async def delete_all_vectors() -> int:
    _init()
    stats = index.describe_index_stats()
    total = stats.total_vector_count
    index.delete(delete_all=True)
    return total
