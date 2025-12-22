import os
import librosa
import librosa.display
import matplotlib.pyplot as plt
import numpy as np
from tqdm import tqdm
import io
from PIL import Image
from typing import Optional


def melSpectrogramCompute(audio_file_path: str, 
                          figsize=(8, 8)
                          ) -> Optional[np.ndarray | None]:
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
    fig = plt.figure(figsize=figsize)
    librosa.display.specshow(S_dB, sr=sr, x_axis='time', y_axis='mel')
    
    # Remove axes and margins to get just the image
    plt.gca().set_axis_off()
    plt.subplots_adjust(top=1, bottom=0, right=1, left=0, hspace=0, wspace=0)
    plt.margins(0, 0)
    
    # Save to a BytesIO buffer instead of using buffer_rgba()
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
    
    # Close the figure to free memory
    plt.close(fig)
    
    return data

  except Exception as e:
    print(f"Error processing {audio_file_path}: {e}")
    return None

def soundToSpectrogram(audio_data_dir: str, 
                       spectrogram_data_dir: str,
                       ratio: float = 0.9) -> None:
  genres = os.listdir(audio_data_dir)

  for genre in tqdm(genres, desc="Calculating Mel Spectrogram"):
    genre_path = os.path.join(audio_data_dir, genre)

    # Filter for audio files only
    all_audio_files = [f for f in os.listdir(genre_path)
                       if f.endswith(".mp3") or f.endswith(".wav")]

    if not all_audio_files:
      print(f"No audio files found in {genre_path}, skipping.")
      continue
    
    num_files = len(all_audio_files)
    num_train_files = int(num_files * ratio)

    for counter, audio_file in enumerate(all_audio_files):
      audio_file_path = os.path.join(genre_path, audio_file)
      
      # Determine train/test split
      if counter < num_train_files:
        mode = "train"
      else:
        mode = "test"

      # Prepare directories
      os.makedirs(os.path.join(spectrogram_data_dir, mode, genre), exist_ok=True)
      spectrogram_base = os.path.splitext(audio_file)[0] + ".png"
      save_path = os.path.join(spectrogram_data_dir, mode, genre, spectrogram_base)
      
      # Compute and Get the image array
      image_data = melSpectrogramCompute(audio_file_path)
      
      # Save the image array if extraction was successful
      if image_data is not None:
        plt.imsave(save_path, image_data)

  print("Spectrogram extraction complete.")    


if __name__ == "__main__":
  audio_data_dir = "music_by_genre"
  spectrogram_data_dir = "datasets"
  ratio = 0.9

  soundToSpectrogram(audio_data_dir, spectrogram_data_dir, ratio)