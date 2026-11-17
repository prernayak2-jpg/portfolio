// Everything in the Photography gallery, in order.
// Photos are laid edge to edge in rows; each keeps its own shape.
// To add a photo, copy one of the objects below and change its values.
// `width` and `height` are the photo's size in pixels (only their ratio
// matters), so the layout can be worked out before the photos load.

export type Photo = {
  id: string; // unique short name, e.g. "01"
  src: string; // file inside /public, e.g. "/photography/01.jpg"
  width: number;
  height: number;

  // Shown when the photo is opened larger (all optional)
  title?: string;
  year?: string;
  place?: string; // e.g. "Kochi, India"
};

// Made with: npm run photos -- "D:/PortfolioWebsite_Creatives/photography"
// (vintage black and white; the comment on each line is the original file).
// Add title, year or place to any photo, e.g. { ..., title: "Jal Mahal", place: "Jaipur" }.
export const photos: Photo[] = [
  { id: "01", src: "/photography/01.jpg", width: 1200, height: 1545 }, // 78714b50-d87c-44d3-ad08-2ebb9d8e9da0.jpg
  { id: "02", src: "/photography/02.jpg", width: 1200, height: 1600 }, // IMG_0373.HEIC
  { id: "03", src: "/photography/03.jpg", width: 1200, height: 1600 }, // IMG_0410.HEIC
  { id: "04", src: "/photography/04.jpg", width: 1200, height: 1600 }, // IMG_0577.HEIC
  { id: "05", src: "/photography/05.jpg", width: 1200, height: 1600 }, // IMG_0754.HEIC
  { id: "06", src: "/photography/06.jpg", width: 1200, height: 1600 }, // IMG_0793.HEIC
  { id: "07", src: "/photography/07.jpg", width: 1600, height: 1200 }, // IMG_0967.HEIC
  { id: "08", src: "/photography/08.jpg", width: 1200, height: 1600 }, // IMG_1991.HEIC
  { id: "09", src: "/photography/09.jpg", width: 1200, height: 1600 }, // IMG_2001.HEIC
  { id: "10", src: "/photography/10.jpg", width: 1200, height: 1600 }, // IMG_2030.HEIC
  { id: "11", src: "/photography/11.jpg", width: 1200, height: 1600 }, // IMG_2623.HEIC
  { id: "12", src: "/photography/12.jpg", width: 1600, height: 1200 }, // IMG_3277.HEIC
  { id: "13", src: "/photography/13.jpg", width: 1200, height: 1600 }, // IMG_4231.HEIC
  { id: "14", src: "/photography/14.jpg", width: 1200, height: 1600 }, // IMG_4684.HEIC
  { id: "15", src: "/photography/15.jpg", width: 1200, height: 1600 }, // IMG_4691.HEIC
  { id: "16", src: "/photography/16.jpg", width: 1200, height: 1600 }, // IMG_4696.HEIC
  { id: "17", src: "/photography/17.jpg", width: 1178, height: 1600 }, // IMG_5009.heic
  { id: "18", src: "/photography/18.jpg", width: 1200, height: 1600 }, // IMG_5019.HEIC
  { id: "19", src: "/photography/19.jpg", width: 1142, height: 1600 }, // IMG_5071.heic
  { id: "20", src: "/photography/20.jpg", width: 1200, height: 1600 }, // IMG_5104.HEIC
  { id: "21", src: "/photography/21.jpg", width: 1200, height: 1600 }, // IMG_5127.HEIC
  { id: "22", src: "/photography/22.jpg", width: 1200, height: 1600 }, // IMG_9826.HEIC
];
