import argparse
import os

import matplotlib.pyplot as plt
import numpy as np
import torch
import torch.nn as nn
from sklearn.metrics import f1_score, confusion_matrix
from torch.optim import AdamW
from torch.optim.lr_scheduler import ReduceLROnPlateau
from torch.utils.data import DataLoader
from torch.utils.tensorboard import SummaryWriter
from tqdm.autonotebook import tqdm

from dataset import MelSpectrogram
from model import CNNTransformer


def get_args() -> argparse.Namespace:
  parser = argparse.ArgumentParser()

  parser.add_argument("--dataset", "-d", type=str, default="./datasets",
                      help="Path to the dataset")
  parser.add_argument("--num-epochs", "-n", type=int, default=50,
                      help="Number of epochs")
  parser.add_argument("--batch-size", "-b", type=int, default=32,
                      help="Number of images in a batch")
  parser.add_argument("--lr", "-l", type=float, default=1e-3,
                      help="Learning rate of the optimizer")
  parser.add_argument("--checkpoint-path", "-c", type=str, default="./checkpoints",
                      help="Path to save the models")
  parser.add_argument("--tensorboard-path", "-t", type=str, default="./tensorboard",
                      help="Path to the tensorboard")
  parser.add_argument("--resume-training", "-r", type=bool, default=True,
                      help="Continue training from previous model or not")
  parser.add_argument("--patience", "-p", type=int, default=10,
                      help="Number of epochs to wait for improvement before early stopping")

  return parser.parse_args()


# This function is used to plot the confusion matrix in the tensorboard
def plot_confusion_matrix(writer: SummaryWriter, 
                          cm: np.ndarray, 
                          class_names: list[str], 
                          epoch: int) -> None:
  """
  Returns a matplotlib figure containing the plotted confusion matrix.

  Args:
     cm (array, shape = [n, n]): a confusion matrix of integer classes
     class_names (array, shape = [n]): String names of the integer classes
  """

  figure = plt.figure(figsize=(20, 20))
  # color map: https://matplotlib.org/stable/gallery/color/colormap_reference.html
  plt.imshow(cm, interpolation='nearest', cmap="Blues")
  plt.title("Confusion matrix")
  plt.colorbar()
  tick_marks = np.arange(len(class_names))
  plt.xticks(tick_marks, class_names, rotation=45)
  plt.yticks(tick_marks, class_names)

  # Normalize the confusion matrix.
  cm = np.around(cm.astype('float') / cm.sum(axis=1)[:, np.newaxis], decimals=2)

  # Use white text if squares are dark; otherwise black.
  threshold = cm.max() / 2.

  for i in range(cm.shape[0]):
    for j in range(cm.shape[1]):
      color = "white" if cm[i, j] > threshold else "black"
      plt.text(j, i, cm[i, j], horizontalalignment="center", color=color)

  plt.tight_layout()
  plt.ylabel('True label')
  plt.xlabel('Predicted label')
  writer.add_figure('confusion_matrix', figure, epoch)


def train(args):
  # hyperparameters
  device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
  if not os.path.exists(args.checkpoint_path):
    os.makedirs(args.checkpoint_path, exist_ok=True)
  if not os.path.exists(args.tensorboard_path):
    os.makedirs(args.tensorboard_path, exist_ok=True)
  writer = SummaryWriter(args.tensorboard_path)

  # dataset
  train_set = MelSpectrogram(root=args.dataset,
                             train=True)
  train_dataloader = DataLoader(dataset=train_set,
                                batch_size=args.batch_size,
                                shuffle=True,
                                drop_last=True,
                                num_workers=6)
  test_set = MelSpectrogram(root=args.dataset,
                            train=False)
  test_dataloader = DataLoader(dataset=test_set,
                               batch_size=args.batch_size,
                               shuffle=False,
                               drop_last=False,
                               num_workers=6)

  model = CNNTransformer(num_classes=len(train_set.classes))
  model.to(device)
  criterion = nn.CrossEntropyLoss()
  optimizer = AdamW(params=model.parameters(), lr=args.lr, weight_decay=1e-3)
  scheduler = ReduceLROnPlateau(optimizer, mode='max', factor=0.1, patience=5)

  # training parameters
  start_epoch = 0
  best_f1 = 0
  cur_patience = 0
  if args.resume_training:
    try:
      saved_data = torch.load(os.path.join(args.checkpoint_path, "best.pt"))
      model.load_state_dict(saved_data["model"])
      optimizer.load_state_dict(saved_data["optimizer"])
      start_epoch = saved_data["cur_epoch"] + 1
      best_f1 = saved_data["best_f1"]
    except FileNotFoundError:
      print("No previous model found. Training from scratch...")

  # training
  for epoch_id in range(start_epoch, args.num_epochs):
    # training stage
    model.train()
    progress_bar = tqdm(train_dataloader, colour="green")
    total_loss = 0

    for batch_id, (images, labels) in enumerate(progress_bar):
      # move data to GPU
      images = images.to(device)
      labels = labels.to(device)

      # forward pass
      output = model(images)

      # calculate loss
      loss = criterion(output, labels)
      total_loss += loss.item()
      avg_loss = total_loss / (batch_id + 1)
      progress_bar.set_description(
        f"Epoch: {epoch_id + 1}/{args.num_epochs}, avg_loss: {avg_loss: .4f}, devcice : {device}")
      writer.add_scalar("Train/Avg_loss", avg_loss, epoch_id * len(train_dataloader) + batch_id)

      # backward pass
      optimizer.zero_grad()
      loss.backward()
      optimizer.step()

    # validation stage
    model.eval()
    progress_bar = tqdm(test_dataloader, colour="yellow")
    total_loss = 0
    y_true = []
    y_pred = []
    with torch.no_grad():
      for batch_id, (images, labels) in enumerate(progress_bar):
        # move data to GPU
        images = images.to(device)
        labels = labels.to(device)

        # forward pass
        output = model(images)

        # calculate loss
        loss = criterion(output, labels)
        total_loss += loss.item()
        avg_loss = total_loss / (batch_id + 1)
        progress_bar.set_description(
          f"Epoch: {epoch_id + 1}/{args.num_epochs}, avg_loss: {avg_loss: .4f}, devcice : {device}")
        writer.add_scalar("Eval/Avg_loss", avg_loss, epoch_id * len(test_dataloader) + batch_id)

        y_true.extend(labels.cpu().numpy())
        predictions = torch.argmax(output, dim=1)
        y_pred.extend(predictions.cpu().numpy())

      cur_f1 = f1_score(y_true, y_pred, average="weighted")
      scheduler.step(cur_f1)
      print(f"f1_score: {cur_f1}")
      writer.add_scalar("Eval/f1 score", cur_f1, epoch_id)
      plot_confusion_matrix(writer, confusion_matrix(y_true, y_pred), train_set.classes, epoch_id)

    # save the model
    if cur_f1 > best_f1:
      best_f1 = cur_f1
      cur_patience = 0
      # save the best model
      saved_data = {
        "model": model.state_dict(),
        "optimizer": optimizer.state_dict(),
        "cur_epoch": epoch_id,
        "best_f1": best_f1,
        "cur_patience": cur_patience,
        "classes": train_set.classes
      }
      torch.save(saved_data, os.path.join(args.checkpoint_path, "best.pt"))

    else:
      cur_patience += 1
      print(f"f1 score did not improve. Counter: {cur_patience}/{args.patience}")
      # early stopping
      if cur_patience == args.patience:
        print('Early stoppping due to maximum number of patience reached.')
        exit()

    # save the last model
    saved_data = {
      "model": model.state_dict(),
      "optimizer": optimizer.state_dict(),
      "cur_epoch": epoch_id,
      "best_f1": best_f1,
      "cur_patience": cur_patience,
      "classes": train_set.classes
    }
    torch.save(saved_data, os.path.join(args.checkpoint_path, "last.pt"))


if __name__ == "__main__":
  args = get_args()
  train(args)
