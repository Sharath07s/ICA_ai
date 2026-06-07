from neo4j import GraphDatabase
from app.core.config import settings

class Neo4jConnection:
    def __init__(self):
        self.driver = None
        if settings.NEO4J_URI and settings.NEO4J_USER and settings.NEO4J_PASSWORD:
            try:
                self.driver = GraphDatabase.driver(
                    settings.NEO4J_URI, 
                    auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
                )
            except Exception as e:
                print(f"Failed to create Neo4j driver: {e}")

    def close(self):
        if self.driver:
            self.driver.close()

    def get_session(self):
        if self.driver:
            return self.driver.session()
        return None

neo4j_conn = Neo4jConnection()

def get_neo4j_session():
    session = neo4j_conn.get_session()
    if session:
        try:
            yield session
        finally:
            session.close()
    else:
        yield None
