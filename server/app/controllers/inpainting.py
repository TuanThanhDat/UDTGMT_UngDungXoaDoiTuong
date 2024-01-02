#pip install -qq -U diffusers==0.11.1 transformers ftfy accelerate

import inspect
from typing import List, Optional, Union

import numpy as np
import torch

import PIL
from diffusers import StableDiffusionInpaintPipeline

def load_model():
  device = "cuda"
  model_path = "runwayml/stable-diffusion-inpainting"

  pipe = StableDiffusionInpaintPipeline.from_pretrained(
      model_path,
      torch_dtype=torch.float16,
  ).to(device)
  return pipe

def inpainting(image, mask_image):
  prompt = ""
  guidance_scale=7.5
  num_samples = 1
  generator = torch.Generator(device="cuda").manual_seed(0) # change the seed to get different results

  pipe = load_model()
  images = pipe(
      prompt=prompt,
      image=image,
      mask_image=mask_image,
      guidance_scale=guidance_scale,
      generator=generator,
      num_images_per_prompt=num_samples,
  ).images[0]
  return images

import requests
from io import BytesIO
def download_image(url):
    response = requests.get(url)
    return PIL.Image.open(BytesIO(response.content)).convert("RGB")
img_url = "https://raw.githubusercontent.com/CompVis/latent-diffusion/main/data/inpainting_examples/overture-creations-5sI6fQgYIuo.png"
mask_url = "https://raw.githubusercontent.com/CompVis/latent-diffusion/main/data/inpainting_examples/overture-creations-5sI6fQgYIuo_mask.png"

image = download_image(img_url).resize((512, 512))
mask_image = download_image(mask_url).resize((512, 512))

image = inpainting(image, mask_image)

image[0].show()