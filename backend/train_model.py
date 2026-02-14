import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader
import os

# Path to dataset
DATASET_PATH = "E:\\Dotcom\\CouncilProject\\ImageData"  # change to your actual path

# Image transformations
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

# Load dataset
dataset = datasets.ImageFolder(DATASET_PATH, transform=transform)

# Save class names
class_names = dataset.classes
print("Classes:", class_names)

# DataLoader
train_loader = DataLoader(dataset, batch_size=16, shuffle=True)

# Load pretrained model
model = models.mobilenet_v2(pretrained=True)

# Freeze feature layers
for param in model.features.parameters():
    param.requires_grad = False

# Replace classifier
model.classifier[1] = nn.Linear(model.last_channel, len(class_names))

# Loss and optimizer
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Training loop
EPOCHS = 5

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

for epoch in range(EPOCHS):
    running_loss = 0.0

    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item()

    print(f"Epoch [{epoch+1}/{EPOCHS}], Loss: {running_loss:.4f}")

# Save model
torch.save({
    "model_state_dict": model.state_dict(),
    "class_names": class_names
}, "complaint_model.pt")

print("Model saved as complaint_model.pt")
