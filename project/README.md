# PDF Management System

## Overview
A comprehensive PDF management web application with local file storage, built using React, TypeScript, FastAPI, and Zustand.

## Features
- Create and manage multiple projects
- Upload PDFs to specific projects
- Preview PDFs within the application
- Local file storage
- Responsive and modern UI

## Tech Stack
### Frontend
- React 18
- TypeScript
- Vite
- Zustand (State Management)
- Tailwind CSS
- Framer Motion
- react-pdf

### Backend
- FastAPI
- Python 3.9+
- Uvicorn

## Prerequisites
- Node.js 16+
- Python 3.9+
- npm or yarn

## Setup and Installation

### Frontend Setup
1. Navigate to the project directory
```bash
cd project
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

### Backend Setup
1. Navigate to the backend directory
```bash
cd backend
```

2. Create a virtual environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Run the backend server
```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8080
```

## Development Servers
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`

## Project Structure
```
project/
├── backend/
│   ├── app.py          # FastAPI backend
│   ├── uploads/        # Local PDF storage
│   └── requirements.txt
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   └── store/          # State management
└── README.md
```

## Key Features
- Multi-project PDF management
- Local file storage
- PDF preview and navigation
- Responsive design
- State persistence

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License
[Specify your license here]

## Contact
[Your contact information]

# Data Loader Documentation

## Overview
`data_loader.py` is a core component that handles data loading and preprocessing for various time-series datasets used in anomaly detection. It provides standardized data loading interfaces for multiple datasets through PyTorch's DataLoader system.

## Main Components

### 1. Dataset Loaders
The file implements four specialized dataset loaders:

- **PSMSegLoader**
  - Purpose: Loads Power System Machine (PSM) dataset
  - Data Source: CSV files
  - Validation: Uses test set as validation

- **MSLSegLoader**
  - Purpose: Loads Mars Science Laboratory (MSL) dataset
  - Data Source: NumPy files
  - Validation: Uses test set as validation

- **SMAPSegLoader**
  - Purpose: Loads Soil Moisture Active Passive (SMAP) dataset
  - Data Source: NumPy files
  - Validation: Uses test set as validation

- **SMDSegLoader**
  - Purpose: Loads Server Machine Dataset (SMD)
  - Data Source: NumPy files
  - Validation: Uses portion of training data

### 2. Core Features

#### Data Preprocessing
- Standardization using sklearn's StandardScaler
- Time series segmentation into fixed-size windows
- Support for overlapping/non-overlapping segments
- Train/validation/test split handling

#### Data Iteration
- Implementation of PyTorch Dataset interface
- Support for batch processing
- Efficient data loading through __len__ and __getitem__

#### Configuration
- Configurable window size
- Adjustable step size for segmentation
- Batch size customization
- Multiple operation modes (train/valid/test)

### 3. Utility Functions

#### get_loader_segment
```python
def get_loader_segment(
    data_path: str,
    batch_size: int,
    win_size: int,
    step: int,
    mode: str = "train",
    dataset: str = "PSM"
) -> DataLoader:
```
- **Purpose**: Factory function for creating dataset loaders
- **Parameters**:
  - data_path: Path to dataset files
  - batch_size: Number of samples per batch
  - win_size: Size of sliding window
  - step: Step size for window sliding
  - mode: Operating mode (train/valid/test)
  - dataset: Dataset name (PSM/MSL/SMAP/SMD)
- **Returns**: Configured PyTorch DataLoader

## Related Files

### Project Structure
```
project/
├── data_factory/
│   ├── __init__.py
│   └── data_loader.py
├── model/
│   └── AnomalyTransformer.py
├── main.py
└── .gitignore
```

### File Dependencies
- **main.py**: Entry point that utilizes the data loaders
- **model/AnomalyTransformer.py**: Model implementation consuming loader data
- **data_factory/__init__.py**: Package marker file
- **.gitignore**: Git ignore configurations

## Usage Example

```python
# Initialize data loader
loader = get_loader_segment(
    data_path="./data",
    batch_size=32,
    win_size=100,
    step=100,
    mode="train",
    dataset="PSM"
)

# Iterate through batches
for batch_x, batch_y in loader:
    # Process batch
    pass
```

## Notes
- Datasets are not included in repository
- Validation strategy varies by dataset
- Supports both overlapping and non-overlapping window configurations
- Implements efficient data loading through PyTorch's DataLoader system
