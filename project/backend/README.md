# Scientific Article GraphRAG System

A specialized approach that enhances GPT-4 with graph-based knowledge representation for scientific articles. This system combines GPT-4's powerful language capabilities with structured knowledge graphs to provide rich, context-aware responses to academic queries.

## Architecture

- **Base Model**: GPT-4 (via Azure OpenAI)
- **Knowledge Enhancement**: Graph-based representation of scientific knowledge
- **Domain Adaptation**: Scientific article processing and academic context

## Features

- **Article Processing**
  - Automatic extraction of metadata, citations, and concepts
  - Section-based content analysis
  - Support for academic citation formats
  - Keyword and concept extraction using scientific NLP models

- **Knowledge Graph Enhancement**
  - Citation network analysis for better context
  - Concept relationship mapping
  - Author collaboration networks
  - Multi-hop reasoning through graph traversal

- **GPT-4 Integration**
  - Graph-enhanced context preparation
  - Academic writing style responses
  - Proper citation formatting
  - Concept-aware query processing

## Setup

1. Create a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Download the scientific NLP model:
   ```bash
   python -m spacy download en_core_sci_md
   ```

4. Set up environment variables:
   ```bash
   # Azure OpenAI Configuration
   AZURE_OPENAI_ENDPOINT=your_azure_endpoint
   AZURE_OPENAI_API_KEY=your_api_key
   AZURE_OPENAI_API_VERSION=2024-02-15-preview
   
   # Model Deployment Names
   AZURE_GPT4_DEPLOYMENT=your_gpt4_deployment_name  # The name of your GPT-4 deployment in Azure
   AZURE_EMBEDDINGS_DEPLOYMENT=your_embeddings_deployment_name  # Optional: for future embedding support
   
   # Storage Configuration
   UPLOAD_DIR=./uploads  # Directory for storing processed articles
   DATABASE_URL=sqlite:///./articles.db  # Database connection string
   ```

## Directory Structure

```
backend/
├── src/
│   ├── models/          # Data structure definitions
│   ├── services/        # Core services including GPT-4 integration
│   └── database/        # Graph-based knowledge storage
├── tests/              # Test files
└── data/              # Storage for processed articles
```

## Usage

1. Start the server:
   ```bash
   uvicorn app:app --reload
   ```

2. Process an article:
   ```python
   from src.services.rag_service import ScientificRAGService

   # Initialize with custom deployment name if needed
   rag = ScientificRAGService(
       storage_dir="data",
       deployment_name="your-gpt4-deployment"  # Optional: defaults to AZURE_GPT4_DEPLOYMENT
   )
   article = await rag.process_article(content, metadata)
   ```

3. Query with GPT-4 and graph enhancement:
   ```python
   response = await rag.query("What are the main approaches to anomaly detection?")
   ```

4. Get knowledge graph visualization:
   ```python
   graph = rag.get_article_graph("article_id")
   ```

## API Endpoints

- `POST /api/articles/process`: Process and index a new article
- `POST /api/articles/query`: Query using GPT-4 with graph enhancement
- `GET /api/articles/{id}/graph`: Get article knowledge graph
- `GET /api/articles/{id}/citations`: Get citation network
- `GET /api/articles/{id}/concepts`: Get concept graph

## How It Works

1. **Article Processing**: Scientific articles are processed to extract structured information about concepts, citations, and relationships.

2. **Knowledge Graph Construction**: The system builds and maintains multiple interconnected graphs:
   - Citation network showing paper relationships
   - Concept graph linking related academic concepts
   - Author collaboration network

3. **Enhanced Querying**:
   - User query is analyzed for relevant concepts
   - System traverses knowledge graphs to find relevant context
   - Context is prepared for GPT-4 in a structured format
   - GPT-4 generates response using the enhanced context

4. **Response Generation**: GPT-4 combines its base knowledge with the graph-enhanced context to provide academically-styled responses with proper citations.

## Troubleshooting

### Common Issues

1. **GPT-4 Deployment Error**:
   ```
   Error: Unknown model: {deployment_name}
   ```
   Solution: Make sure your Azure OpenAI deployment name is correctly set in the environment variables or pass it explicitly when initializing the service.

2. **Authentication Error**:
   ```
   Error: Azure OpenAI credentials not found
   ```
   Solution: Check that your Azure OpenAI API key and endpoint are correctly set in the environment variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
