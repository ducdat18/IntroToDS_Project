import torch
from model import CNNTransformer
from sound_to_spectrogram import melSpectrogramCompute
from typing import Optional, Tuple
import cv2
import numpy as np

def preprocessAudio(audio_path: str,
                    mean: Optional[Tuple] = (0.485, 0.456, 0.406), 
                    std: Optional[Tuple] = (0.229, 0.224, 0.225)
                    ) -> Optional[torch.Tensor]:

  # 1. Compute Spectrogram
  # Note: This returns an RGB numpy array (from PIL in sound_to_spectrogram.py)
  spectrogram_image = melSpectrogramCompute(audio_path)
  
  if spectrogram_image is None:
    raise ValueError(f"Could not compute spectrogram for {audio_path}")
  
  # 2. Resize
  spectrogram_image = cv2.resize(spectrogram_image, (448, 448))
  
  # 3. Convert to Tensor and Normalize
  spectrogram_tensor = torch.tensor(spectrogram_image, dtype=torch.float32)
  spectrogram_tensor = spectrogram_tensor.permute(2, 0, 1) / 255.0
  
  if mean is not None and std is not None:
    mean_tensor = torch.tensor(mean).view(3, 1, 1)
    std_tensor = torch.tensor(std).view(3, 1, 1)
    spectrogram_tensor = (spectrogram_tensor - mean_tensor) / std_tensor

  spectrogram_tensor = spectrogram_tensor.unsqueeze(0)  # Add batch dimension
  return spectrogram_tensor


def inference(audio_path: str,
              model_checkpoint_path: str,
              device: torch.device
              ) -> Optional[Tuple[str, float]]:
  
  # 1. Load Checkpoint FIRST to get class info
  try:
      state_dict = torch.load(model_checkpoint_path, map_location=device)
  except FileNotFoundError:
      print(f"Error: Checkpoint not found at {model_checkpoint_path}")
      return None

  classes = state_dict.get("classes", None)
  if classes is None:
      raise ValueError("Checkpoint does not contain 'classes' list.")
  
  num_classes_checkpoint = len(classes)
  
  # 2. Initialize Model with correct class count
  model = CNNTransformer(num_classes=num_classes_checkpoint) 
  model.load_state_dict(state_dict["model"])
  model.to(device)
  model.eval()

  # 3. Preprocess Audio
  # We do this after model load to ensure we don't waste time processing if model load fails
  try:
      audio_tensor = preprocessAudio(audio_path)
  except ValueError as e:
      print(e)
      return None
      
  audio_tensor = audio_tensor.to(device) if audio_tensor is not None else None

  # 4. Inference
  with torch.no_grad():
    output = model(audio_tensor)
    probabilities = torch.softmax(output, dim=1)

  prob = torch.max(probabilities, dim=1)[0] * 100
  index = torch.argmax(probabilities, dim=1)

  return classes[index], prob.item()

if __name__ == "__main__":
  audio_path = "music_by_genre/Electronic/065430.mp3" # Ensure this file exists
  model_path = "./checkpoints/best.pt"
  device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
  
  result = inference(audio_path=audio_path, 
                     model_checkpoint_path=model_path, 
                     device=device)
                     
  if result is not None:
    predicted_class, confidence = result
    print(f"Predicted class: {predicted_class}")
    print(f"Confidence: {confidence:.2f}%")
  else:
    print("Inference failed.")