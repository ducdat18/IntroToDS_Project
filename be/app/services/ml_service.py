import torch
import cv2
import logging
from typing import Optional, Tuple
from app.ml.model import CNNTransformer
from app.ml.spectrogram import melSpectrogramCompute
from app.core.config import settings

logger = logging.getLogger(__name__)

class MLService:
    def __init__(self):
        self.device = torch.device(settings.DEVICE if torch.cuda.is_available() else "cpu")
        self.model = None
        self.classes = None
        self.mean = (0.485, 0.456, 0.406)
        self.std = (0.229, 0.224, 0.225)

    def load_model(self):
        """Loads the model from disk."""
        try:
            logger.info(f"Loading model from {settings.MODEL_PATH}...")
            state_dict = torch.load(settings.MODEL_PATH, map_location=self.device)
            
            self.classes = state_dict.get("classes", None)
            if self.classes is None:
                raise ValueError("Checkpoint does not contain 'classes' list.")
            
            num_classes = len(self.classes)
            
            self.model = CNNTransformer(num_classes=num_classes)
            self.model.load_state_dict(state_dict["model"])
            self.model.to(self.device)
            self.model.eval()
            logger.info("Model loaded successfully.")
            return True
        except FileNotFoundError:
            logger.error(f"Model checkpoint not found at {settings.MODEL_PATH}")
            return False
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            return False

    def preprocess_audio(self, audio_path: str) -> Optional[torch.Tensor]:
        """Preprocesses audio file into a tensor."""
        try:
            # 1. Compute Spectrogram
            spectrogram_image = melSpectrogramCompute(audio_path)
            
            if spectrogram_image is None:
                raise ValueError(f"Could not compute spectrogram for {audio_path}")
            
            # 2. Resize
            spectrogram_image = cv2.resize(spectrogram_image, (448, 448))
            
            # 3. Convert to Tensor and Normalize
            spectrogram_tensor = torch.tensor(spectrogram_image, dtype=torch.float32)
            spectrogram_tensor = spectrogram_tensor.permute(2, 0, 1) / 255.0
            
            mean_tensor = torch.tensor(self.mean).view(3, 1, 1)
            std_tensor = torch.tensor(self.std).view(3, 1, 1)
            spectrogram_tensor = (spectrogram_tensor - mean_tensor) / std_tensor

            spectrogram_tensor = spectrogram_tensor.unsqueeze(0)  # Add batch dimension
            return spectrogram_tensor
        except Exception as e:
            logger.error(f"Error in preprocessing: {e}")
            return None

    def predict(self, audio_path: str) -> Optional[Tuple[str, float]]:
        """Runs inference on the audio file."""
        if self.model is None:
            logger.error("Model not loaded.")
            return None

        audio_tensor = self.preprocess_audio(audio_path)
        if audio_tensor is None:
            return None

        audio_tensor = audio_tensor.to(self.device)

        with torch.no_grad():
            output = self.model(audio_tensor)
            probabilities = torch.softmax(output, dim=1)

        prob = torch.max(probabilities, dim=1)[0] * 100
        index = torch.argmax(probabilities, dim=1)

        return self.classes[index], prob.item()

# Global instance
ml_service = MLService()
