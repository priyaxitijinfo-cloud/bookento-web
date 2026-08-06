export const DOCTOR_LISTING_IMAGES = [
  "/images/listing/doctors/doctor-1.png",
  "/images/listing/doctors/doctor-2.png",
  "/images/listing/doctors/doctor-3.png",
  "/images/listing/doctors/doctor-4.png",
];

export const DOCTOR_LISTING_COUNT = 50;

export function getDoctorListingImage(index) {
  return DOCTOR_LISTING_IMAGES[index % DOCTOR_LISTING_IMAGES.length];
}
