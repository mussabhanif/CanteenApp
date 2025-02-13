import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../lib/cropImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function BaseImagePicker({ onImageSelect, aspectRatio = 1 }) {
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [open, setOpen] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImage(reader.result);
        setOpen(true);
      };
    }
  };

  const handleCrop = async () => {
    const croppedImage = await getCroppedImg(image, croppedAreaPixels);
    setCroppedImage(croppedImage);
    onImageSelect(croppedImage);
    setOpen(false);
  };

  return (
    <div>
      <Input type="file" accept="image/*" onChange={handleFileChange} />
      {croppedImage && <img src={croppedImage} alt="Cropped" className="mt-4 w-fit h-32 rounded-md" />}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-4">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-60">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleCrop}>Crop & Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
