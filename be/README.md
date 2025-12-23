# 🎵 Music Genre Classification using CNN + Transformer

![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![PyTorch](https://img.shields.io/badge/PyTorch-Deep%20Learning-red)
![Status](https://img.shields.io/badge/Status-Active-success)

A deep learning project that leverages a hybrid architecture combining **Convolutional Neural Networks (CNN)** and **Transformers** to classify music genres.

## 📖 Overview

Classifying music genres is a classic problem in Music Information Retrieval (MIR). This project moves beyond standard CNN-only approaches by introducing a **Transformer** encoder.

* **CNN (Convolutional Neural Network):** Acts as a feature extractor, capturing local spectral features (timbre, pitch) from the Mel-spectrograms.
* **Transformer:** Models the long-term temporal dependencies and rhythmic patterns in the sequence of features extracted by the CNN.

This hybrid approach allows the model to understand both *what* the audio sounds like at a specific moment and *how* it evolves over time.

## 📂 Repository Structure

```text
MusicGenreClassification/
├── dataset.py               # Custom Dataset class for loading and batching spectrograms
├── model.py                 # The hybrid CNN + Transformer neural network architecture
├── sound_to_spectrogram.py  # Preprocessing script: converts raw audio (.wav) to spectrogram images
├── train.py                 # Main training loop, validation, and model checkpointing
├── .gitignore               # Git ignore rules
└── README.md                # Project 
```

## 🛠️ Prerequisites
Ensure you have **Python 3.8+** installed. The core dependencies are PyTorch for modeling and Librosa for audio processing.

Install the required packages:

``pip install torch torchvision torchaudio librosa numpy pandas matplotlib scikit-learn``

## 🚀 Usage Pipeline
1. **Data Preparation**

This project requires a dataset of audio files (e.g., .wav or .mp3) organized by genre. A common benchmark is the **GTZAN Dataset**.

Expected Data Structure:
```text
data/
    genres_original/
        blues/
        classical/
        ...
```

2. **Preprocessing**

Before training, the raw audio must be converted into Mel-spectrograms. Run the `sound_to_spectrogram.py` script:

``python sound_to_spectrogram.py --input_dir ./data/genres_original --output_dir ./data/spectrograms``

(Note: Check the script for specific flags regarding sample rate, FFT size, or hop length).

3. **Training the Model**

Once the spectrograms are generated, use `train.py` to start the training process.

``python train.py --dataset_path ./data/spectrograms --epochs 50 --batch_size 32 --learning_rate 0.001``

What happens during training:

- The `dataset.py` script loads spectrograms and applies transformations/normalization.

- The `model.py` initializes the CNN-Transformer architecture.

- The model optimizes the Loss Function (likely CrossEntropy) over the specified epochs.

- Checkpoints are saved periodically.

## 🧠 Model Architecture Details

The model defined in `model.py` likely follows this flow:
- **Input**: Mel-Spectrogram image $[B, C, H, W]$.
- **CNN Encoder**: Several convolutional blocks (Conv2d -> BatchNorm -> ReLU -> MaxPool) reduce the frequency dimension while preserving the time dimension.
- **Projection**: The CNN output is flattened or projected to match the Transformer's input embedding dimension.
- **Positional Encoding**: Added to the sequence to retain order information.
- **Transformer Encoder**: Multi-Head Self-Attention layers process the sequence.
- **Classification Head**: A global average pooling or classification token is passed through a fully connected layer (MLP) to output genre probabilities.

## 📈 Results

You can view the result (including loss graph, confusion matrix, ...) using **Tensorboard**

``tensorboard --logdir=<your tensorboard folder>``

You can get the model checkpoints here

[Checkpoints](https://drive.google.com/drive/folders/10immdRoflqZELBn1LTnoX2kxqMIJcY8b?usp=sharing)

Note: *best.pt* is used for inferencing, while *last.pt* is used for continual training

## 🚀 Running the Backend API

To run the full backend system (FastAPI server + MinIO + PostgreSQL) for the music management application, follow these steps:

### 1. Prerequisites
- Docker & Docker Compose
- Python 3.10+

### 2. Setup Environment
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Start Infrastructure Services
Start MinIO (storage) and PostgreSQL (database) using Docker:
```bash
./start_services.sh
```
*This script initializes the necessary containers and waits for them to be ready.*

### 4. Start the API Server
Run the FastAPI application:
```bash
./start_api.sh
```
*The server will start at http://localhost:8000*
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

To stop the services later, run:
```bash
./stop_services.sh
```