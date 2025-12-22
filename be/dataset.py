import os
from typing import Optional, Tuple
import cv2
import torch
from torch.utils.data import Dataset

class MelSpectrogram(Dataset):
  def __init__(self, 
               root: str, 
               train: bool = True, 
               mean: Optional[Tuple | None] = (0.485, 0.456, 0.406), 
               std: Optional[Tuple | None] = (0.229, 0.224, 0.225),
               img_size : Tuple[int, int] = (448, 448)
               ) -> None:
    
    self.classes = []
    self.image_paths = []
    self.labels = []
    self.train = train
    self.img_size = img_size

    if mean is not None and std is not None:
      self.mean = torch.tensor(mean).view(3, 1, 1)
      self.std = torch.tensor(std).view(3, 1, 1)
    else:
      self.mean = None
      self.std = None

    root = os.path.join(root, "train" if train else "test")

    self.classes = sorted(os.listdir(root))  
    for iter, cl in enumerate(self.classes):
      class_path = os.path.join(root, cl)
      if not os.path.isdir(class_path): 
        continue
      for file in os.listdir(class_path):
        file_path = os.path.join(class_path, file)
        if os.path.isfile(file_path):  
          self.image_paths.append(file_path)
          self.labels.append(iter)

  def __len__(self) -> int:
    return len(self.labels)

  def __getitem__(self, 
                  idx: int) -> tuple[torch.Tensor, torch.Tensor]:
    
    imagePath = self.image_paths[idx]
  
    img = cv2.imread(imagePath)
    if img is None:
      raise ValueError(f"Failed to load image at {imagePath}")
    img = cv2.resize(img, self.img_size)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = torch.tensor(img, dtype=torch.float32)
    img = img.permute(2, 0, 1)
    img /= 255.0
    
    if self.mean is not None and self.std is not None:
      img = (img - self.mean) / self.std

    label = torch.tensor(self.labels[idx], dtype=torch.long)

    return img, label


if __name__ == "__main__":
  dataset = MelSpectrogram(root="datasets")
  print(len(dataset))
  print(dataset.classes)
  print(dataset[0][0].shape)