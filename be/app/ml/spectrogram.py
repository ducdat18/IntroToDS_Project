import librosa
import librosa.display
import matplotlib.pyplot as plt
import numpy as np
import io
from PIL import Image
from typing import Optional

def melSpectrogramCompute(audio_file_path: str, 
                          figsize=(8, 8)
                          ) -> Optional[np.ndarray]:
  """
  Computes the Mel Spectrogram and returns the image as a numpy array (RGB).
  """
  try:
    y, sr = librosa.load(audio_file_path, sr=None)

    # Compute Mel Spectrogram
    n_fft = 2048
    hop_length = 512
    n_mels = 128
    fmax = 20000

    S = librosa.feature.melspectrogram(y=y, 
                                       sr=sr, 
                                       n_fft=n_fft, 
                                       hop_length=hop_length, 
                                       n_mels=n_mels, 
                                       fmax=fmax)
    S_dB = librosa.power_to_db(S, ref=np.max)

    # Create figure but do not display it
    # Note: This is not thread-safe and slow. 
    # TODO: Refactor to use direct tensor conversion or thread-safe backend.
    fig = plt.figure(figsize=figsize)
    librosa.display.specshow(S_dB, sr=sr, x_axis='time', y_axis='mel')
    
    # Remove axes and margins to get just the image
    plt.gca().set_axis_off()
    plt.subplots_adjust(top=1, bottom=0, right=1, left=0, hspace=0, wspace=0)
    plt.margins(0, 0)
    
    # Save to a BytesIO buffer
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0)
    buf.seek(0)
    
    # Load the image using PIL and convert to numpy array
    img = Image.open(buf)
    data = np.array(img)
    
    # If the image has an alpha channel, remove it
    if data.shape[2] == 4:
        data = data[:, :, :3]
    
    buf.close()
    plt.close(fig)
    
    return data

  except Exception as e:
    print(f"Error processing {audio_file_path}: {e}")
    return None
