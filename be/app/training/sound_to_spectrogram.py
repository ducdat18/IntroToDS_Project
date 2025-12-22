import os
import matplotlib.pyplot as plt
from tqdm import tqdm
from app.ml.spectrogram import melSpectrogramCompute

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