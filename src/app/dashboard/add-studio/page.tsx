"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";
import {
  PlusCircle,
  X,
  UploadCloud,
  Loader2,
  ImagePlus,
} from "lucide-react";

const categories = [
  "Photography Studio",
  "Video Production Studio",
  "Podcast Studio",
  "Music Studio",
  "Dance Studio",
  "Event Space",
  "Creative Workspace",
];

const availableAmenities = [
  "Air Conditioning",
  "Professional Lighting",
  "Wi-Fi",
  "Parking",
  "Sound System",
  "Changing Room",
  "Lighting Equipment",
  "Projector",
];

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_GALLERY_IMAGES = 4;

const inputClass =
  "w-full min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-violet-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500";

export default function AddStudioPage() {
  const { data: session, isPending } = authClient.useSession();

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const [imagePreview, setImagePreview] = useState("");
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    hourlyRate: "",
    securityDeposit: "",
    maxCapacity: "",
    image: "",
    galleryImages: [] as string[],
    overview: "",
  });

  const [amenities, setAmenities] = useState<string[]>([]);

  const uploadToImgBB = async (file: File): Promise<string> => {
    if (!IMGBB_API_KEY) {
      throw new Error("ImgBB API Key is missing. Check your .env.local file.");
    }

    if (!file.type.startsWith("image/")) {
      throw new Error("Please select a valid image file.");
    }

    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error(`${file.name} must be less than 5MB.`);
    }

    const uploadData = new FormData();
    uploadData.append("image", file);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: "POST",
        body: uploadData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error?.message || "Image upload failed.");
    }

    return result.data.url;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (uploadingGallery || loading) {
      e.target.value = "";
      return;
    }

    if (!IMGBB_API_KEY) {
      toast.error("ImgBB API Key is missing.");
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
    setUploadingImage(true);

    try {
      const imageUrl = await uploadToImgBB(file);

      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }));

      URL.revokeObjectURL(previewUrl);
      setImagePreview(imageUrl);

      toast.success("Main image uploaded successfully!");
    } catch (error) {
      console.error("Main Image Upload Error:", error);

      URL.revokeObjectURL(previewUrl);
      setImagePreview("");

      setFormData((prev) => ({
        ...prev,
        image: "",
      }));

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not upload main image."
      );
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleGalleryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    if (uploadingImage || loading) {
      e.target.value = "";
      return;
    }

    if (!IMGBB_API_KEY) {
      toast.error("ImgBB API Key is missing.");
      e.target.value = "";
      return;
    }

    const remainingSlots =
      MAX_GALLERY_IMAGES - formData.galleryImages.length;

    if (remainingSlots <= 0) {
      toast.error("You can upload maximum 4 gallery images.");
      e.target.value = "";
      return;
    }

    if (files.length > remainingSlots) {
      toast.error(
        `You can upload only ${remainingSlots} more gallery image(s).`
      );
      e.target.value = "";
      return;
    }

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image.`);
        e.target.value = "";
        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(`${file.name} must be less than 5MB.`);
        e.target.value = "";
        return;
      }
    }

    setUploadingGallery(true);

    const temporaryPreviews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setGalleryPreviews((prev) => [
      ...prev,
      ...temporaryPreviews,
    ]);

    const successfulUrls: string[] = [];
    const successfulPreviews: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        try {
          const imageUrl = await uploadToImgBB(files[i]);

          successfulUrls.push(imageUrl);
          successfulPreviews.push(imageUrl);

          URL.revokeObjectURL(temporaryPreviews[i]);
        } catch (error) {
          console.error("Gallery Image Upload Error:", error);

          URL.revokeObjectURL(temporaryPreviews[i]);

          toast.error(
            error instanceof Error
              ? error.message
              : `Could not upload ${files[i].name}.`
          );
        }
      }

      setFormData((prev) => ({
        ...prev,
        galleryImages: [
          ...prev.galleryImages,
          ...successfulUrls,
        ],
      }));

      setGalleryPreviews((prev) => {
        const previousCount = prev.length - temporaryPreviews.length;

        return [
          ...prev.slice(0, previousCount),
          ...successfulPreviews,
        ];
      });

      if (successfulUrls.length > 0) {
        toast.success(
          `${successfulUrls.length} gallery image(s) uploaded successfully!`
        );
      }
    } finally {
      setUploadingGallery(false);
      e.target.value = "";
    }
  };

  const removeMainImage = () => {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview("");

    setFormData((prev) => ({
      ...prev,
      image: "",
    }));

    toast.info("Main image removed.");
  };

  const removeGalleryImage = (index: number) => {
    if (uploadingGallery) {
      toast.info("Please wait until gallery upload is complete.");
      return;
    }

    setGalleryPreviews((prev) => {
      const preview = prev[index];

      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }

      return prev.filter((_, i) => i !== index);
    });

    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter(
        (_, i) => i !== index
      ),
    }));

    toast.info("Gallery image removed.");
  };

  const handleAmenityChange = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  };

  const resetForm = () => {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    galleryPreviews.forEach((preview) => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    });

    setFormData({
      title: "",
      category: "",
      location: "",
      hourlyRate: "",
      securityDeposit: "",
      maxCapacity: "",
      image: "",
      galleryImages: [],
      overview: "",
    });

    setAmenities([]);
    setImagePreview("");
    setGalleryPreviews([]);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (isPending) {
      toast.info("Please wait. Loading your account...");
      return;
    }

    if (!session?.user?.email) {
      toast.error("Please login before adding a studio!");
      return;
    }

    if (uploadingImage || uploadingGallery) {
      toast.info("Please wait until all image uploads are complete.");
      return;
    }

    if (
      !formData.title.trim() ||
      !formData.category ||
      !formData.location.trim() ||
      !formData.hourlyRate ||
      !formData.securityDeposit ||
      !formData.maxCapacity ||
      !formData.image.trim() ||
      !formData.overview.trim()
    ) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const hourlyRate = Number(formData.hourlyRate);
    const securityDeposit = Number(formData.securityDeposit);
    const maxCapacity = Number(formData.maxCapacity);

    if (
      !Number.isFinite(hourlyRate) ||
      !Number.isFinite(securityDeposit) ||
      !Number.isInteger(maxCapacity) ||
      hourlyRate <= 0 ||
      securityDeposit < 0 ||
      maxCapacity <= 0
    ) {
      toast.error("Please enter valid pricing and capacity numbers!");
      return;
    }

    if (amenities.length === 0) {
      toast.error("Please select at least one amenity!");
      return;
    }

    if (formData.overview.trim().length < 20) {
      toast.error("Studio description must be at least 20 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/studios",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title.trim(),
            category: formData.category,
            location: formData.location.trim(),
            hourlyRate,
            securityDeposit,
            maxCapacity,
            image: formData.image.trim(),
            galleryImages: formData.galleryImages,
            overview: formData.overview.trim(),
            amenities,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.success !== true) {
        toast.error(
          result.message || "Failed to add studio. Please try again."
        );
        return;
      }

      toast.success("Studio added successfully!");
      resetForm();
    } catch (error) {
      console.error("Add Studio Error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full min-w-0 max-w-4xl text-gray-900 dark:text-gray-100">

      {/* Heading */}
      <div className="mb-6 sm:mb-8">
        <div className="mb-3 flex items-center gap-3">
          <div className="shrink-0 rounded-xl bg-violet-100 p-2.5 dark:bg-violet-950 sm:p-3">
            <PlusCircle
              className="text-violet-600 dark:text-violet-400"
              size={26}
            />
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            Add New Studio
          </h2>
        </div>

        <p className="text-sm leading-6 text-gray-500 dark:text-gray-400 sm:text-base">
          Share your creative space with people and start earning.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="min-w-0 space-y-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900 sm:space-y-8 sm:p-6 md:p-8"
      >

        {/* Basic Information */}
        <section className="min-w-0">
          <h3 className="mb-4 text-base font-bold text-gray-900 dark:text-white sm:mb-5 sm:text-lg">
            Basic Information
          </h3>

          <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
            <div className="min-w-0">
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Studio Name *
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={100}
                placeholder="Enter studio name"
                className={inputClass}
              />
            </div>

            <div className="min-w-0">
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Category *
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="">Select category</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-0 md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Location *
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g. Dhanmondi, Dhaka, Bangladesh"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <div className="border-t border-gray-100 dark:border-gray-800" />

        {/* Pricing & Capacity */}
        <section className="min-w-0">
          <h3 className="mb-4 text-base font-bold text-gray-900 dark:text-white sm:mb-5 sm:text-lg">
            Pricing & Capacity
          </h3>

          <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div className="min-w-0">
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Hourly Rate (৳) *
              </label>

              <input
                type="number"
                name="hourlyRate"
                min="1"
                step="any"
                value={formData.hourlyRate}
                onChange={handleChange}
                required
                placeholder="1200"
                className={inputClass}
              />
            </div>

            <div className="min-w-0">
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Security Deposit (৳) *
              </label>

              <input
                type="number"
                name="securityDeposit"
                min="0"
                step="any"
                value={formData.securityDeposit}
                onChange={handleChange}
                required
                placeholder="3000"
                className={inputClass}
              />
            </div>

            <div className="min-w-0 sm:col-span-2 lg:col-span-1">
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Maximum Capacity *
              </label>

              <input
                type="number"
                name="maxCapacity"
                min="1"
                step="1"
                value={formData.maxCapacity}
                onChange={handleChange}
                required
                placeholder="10"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <div className="border-t border-gray-100 dark:border-gray-800" />

        {/* Main Image Upload */}
        <section className="min-w-0">
          <h3 className="mb-4 text-base font-bold text-gray-900 dark:text-white sm:mb-5 sm:text-lg">
            Main Studio Image
          </h3>

          <label className="mb-3 block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Upload Main Image *
          </label>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center transition hover:border-violet-400 hover:bg-violet-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-violet-500 dark:hover:bg-gray-700 sm:px-5 sm:py-10">
            {uploadingImage ? (
              <>
                <Loader2
                  size={35}
                  className="animate-spin text-violet-600 dark:text-violet-400"
                />

                <p className="mt-3 text-sm font-semibold text-violet-700 dark:text-violet-400 sm:text-base">
                  Uploading Main Image...
                </p>
              </>
            ) : (
              <>
                <UploadCloud
                  size={35}
                  className="text-violet-600 dark:text-violet-400"
                />

                <p className="mt-3 text-sm font-semibold text-gray-800 dark:text-gray-200 sm:text-base">
                  Click to upload main image
                </p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, JPEG or WEBP (Maximum 5MB)
                </p>
              </>
            )}

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageUpload}
              disabled={uploadingImage || uploadingGallery || loading}
              className="hidden"
            />
          </label>

          {imagePreview && (
            <div className="relative mt-5 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
              <img
                src={imagePreview}
                alt="Main studio preview"
                className="h-48 w-full object-cover sm:h-64"
              />

              {!uploadingImage && (
                <button
                  type="button"
                  onClick={removeMainImage}
                  className="absolute right-3 top-3 rounded-full bg-white p-2 text-red-500 shadow-md transition hover:bg-red-50"
                  aria-label="Remove main image"
                >
                  <X size={20} />
                </button>
              )}

              <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                Main Image
              </div>
            </div>
          )}
        </section>

        <div className="border-t border-gray-100 dark:border-gray-800" />

        {/* Gallery Images */}
        <section className="min-w-0">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white sm:text-lg">
                <ImagePlus
                  size={21}
                  className="shrink-0 text-violet-600 dark:text-violet-400"
                />
                Gallery Images
              </h3>

              <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400 sm:text-sm">
                Upload additional photos of your studio.
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950 dark:text-violet-400 sm:text-sm">
              {formData.galleryImages.length}/4
            </span>
          </div>

          <label
            className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-7 text-center transition sm:px-5 sm:py-8 ${
              formData.galleryImages.length >= 4 ||
              uploadingGallery ||
              uploadingImage ||
              loading
                ? "cursor-not-allowed border-gray-200 bg-gray-100 opacity-60 dark:border-gray-700 dark:bg-gray-800"
                : "cursor-pointer border-gray-300 bg-gray-50 hover:border-violet-400 hover:bg-violet-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-violet-500 dark:hover:bg-gray-700"
            }`}
          >
            {uploadingGallery ? (
              <>
                <Loader2
                  size={35}
                  className="animate-spin text-violet-600 dark:text-violet-400"
                />

                <p className="mt-3 text-sm font-semibold text-violet-700 dark:text-violet-400">
                  Uploading Gallery Images...
                </p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Please wait while your images are uploading.
                </p>
              </>
            ) : (
              <>
                <ImagePlus
                  size={35}
                  className="text-violet-600 dark:text-violet-400"
                />

                <p className="mt-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Click to upload gallery images
                </p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Select up to {4 - formData.galleryImages.length} more
                  image(s). Maximum 5MB per image.
                </p>
              </>
            )}

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={handleGalleryUpload}
              disabled={
                formData.galleryImages.length >= 4 ||
                uploadingGallery ||
                uploadingImage ||
                loading
              }
              className="hidden"
            />
          </label>

          {galleryPreviews.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4">
              {galleryPreviews.map((preview, index) => (
                <div
                  key={`${preview}-${index}`}
                  className="group relative min-w-0 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <img
                    src={preview}
                    alt={`Gallery image ${index + 1}`}
                    className="h-28 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-36"
                  />

                  {!uploadingGallery && (
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute right-2 top-2 rounded-full bg-white p-1.5 text-red-500 shadow-md transition hover:bg-red-50"
                      aria-label={`Remove gallery image ${index + 1}`}
                    >
                      <X size={16} />
                    </button>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1 text-center text-xs font-medium text-white">
                    Gallery {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
            Gallery images will be uploaded to ImgBB automatically.
          </p>
        </section>

        <div className="border-t border-gray-100 dark:border-gray-800" />

        {/* Amenities */}
        <section className="min-w-0">
          <h3 className="mb-4 text-base font-bold text-gray-900 dark:text-white sm:mb-5 sm:text-lg">
            Studio Amenities *
          </h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {availableAmenities.map((amenity) => (
              <label
                key={amenity}
                className={`flex min-w-0 cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition ${
                  amenities.includes(amenity)
                    ? "border-violet-500 bg-violet-50 text-violet-700 dark:border-violet-500 dark:bg-violet-950 dark:text-violet-300"
                    : "border-gray-200 text-gray-700 hover:border-violet-300 dark:border-gray-700 dark:text-gray-300 dark:hover:border-violet-500"
                }`}
              >
                <input
                  type="checkbox"
                  checked={amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                  className="shrink-0 accent-violet-600"
                />

                <span className="min-w-0 break-words">{amenity}</span>

                {amenities.includes(amenity) && (
                  <X size={14} className="ml-auto shrink-0" />
                )}
              </label>
            ))}
          </div>
        </section>

        <div className="border-t border-gray-100 dark:border-gray-800" />

        {/* Description */}
        <section className="min-w-0">
          <h3 className="mb-4 text-base font-bold text-gray-900 dark:text-white sm:mb-5 sm:text-lg">
            Studio Description
          </h3>

          <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Overview *
          </label>

          <textarea
            name="overview"
            value={formData.overview}
            onChange={handleChange}
            required
            minLength={20}
            maxLength={2000}
            rows={5}
            placeholder="Describe your studio, facilities and creative environment..."
            className={`${inputClass} resize-none`}
          />
        </section>

        {/* Submit */}
        <button
          type="submit"
          disabled={
            loading ||
            isPending ||
            uploadingImage ||
            uploadingGallery
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:py-4 sm:text-base"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Adding Studio...
            </>
          ) : uploadingImage || uploadingGallery ? (
            "Uploading Images..."
          ) : isPending ? (
            "Loading Account..."
          ) : (
            "Publish Studio"
          )}
        </button>
      </form>
    </div>
  );
}