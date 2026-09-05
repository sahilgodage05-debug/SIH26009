from PIL import Image
from pathlib import Path

# Find the main project folder automatically
project_root = Path(__file__).resolve().parent.parent

# Input PNG and output ICO paths
input_path = project_root / "public" / "favicon_new.png"
output_path = project_root / "public" / "/favicon_new.png?v=2"

# Check whether the PNG exists
if not input_path.exists():
    print(f"ERROR: Input file not found:\n{input_path}")
    raise SystemExit(1)

# Open the original image
image = Image.open(input_path).convert("RGBA")

# Create a high-quality multi-resolution favicon
image.save(
    output_path,
    format="ICO",
    sizes=[
        (16, 16),
        (32, 32),
        (48, 48),
        (64, 64),
        (128, 128),
        (256, 256),
    ],
)

print("SUCCESS: Favicon created successfully!")
print(f"Input:  {input_path}")
print(f"Output: {output_path}")
print(f"Original image size: {image.size}")