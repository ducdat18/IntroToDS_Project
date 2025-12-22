import torch
import torch.nn as nn
from torchvision.models import efficientnet_b0, EfficientNet_B0_Weights


class CNNTransformer(nn.Module):
  def __init__(self, 
               num_classes: int,
               dropout: float = 0.1) -> None:
     
    super(CNNTransformer, self).__init__()

    # CNN to extract important features from spectrogram
    self.features = efficientnet_b0(weights=EfficientNet_B0_Weights.DEFAULT).features
    self.pool = nn.AdaptiveAvgPool2d((1, None))

    # Multihead attention to analyse data through time steps
    cnn_output_channels = 1280  # Output channels of efficientnet_b0

    self.attention = nn.MultiheadAttention(
      embed_dim=cnn_output_channels,
      num_heads=8,
      dropout=dropout,
      batch_first=True
    )

    # Fully connected layer
    self.classifier = nn.Sequential(
      nn.Dropout(p=dropout),
      nn.Linear(cnn_output_channels, num_classes)
    )

  def forward(self, 
              x: torch.Tensor) -> torch.Tensor:
    # CNN
    x = self.features(x)  # (batch, 1280, 32, 13)

    # # Modify the data to forward to Attention layer
    x = self.pool(x)
    x = x.squeeze(2)
    x = x.permute(0, 2, 1)  # (batch, 13, 1280)
    
    # Attention layer
    attn_output, _ = self.attention(x, x, x) 

    # Classifier
    x = torch.mean(attn_output, dim=1)
    x = self.classifier(x)
    return x

