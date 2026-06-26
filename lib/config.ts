export interface EntourageGroup {
  role: string;
  members: string[];
}

export interface EventInfo {
  time: string;
  venue: string;
  address: string;
  mapsUrl: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
}

export const weddingConfig = {
  coupleName: "Bretch & Joyce",
  partnerOne: "Bretch",
  partnerTwo: "Joyce",
  weddingDate: "2026-08-01",
  weddingDateLabel: "August 1, 2026",
  hashtag: "#spendtheBRETCHofmylifewithJOYCE",
  photoAlbumUrl: "",
  ceremony: {
    time: "3:00 PM",
    venue: "St. John the Baptist Parish",
    address: "123 Main Street, Taguig, Metro Manila, Philippines",
    mapsUrl: "https://maps.google.com/?q=St.+John+the+Baptist+Parish+Taguig",
  } as EventInfo,
  reception: {
    time: "6:00 PM",
    venue: "The Garden Pavilion",
    address: "456 Garden Road, Taguig, Metro Manila, Philippines",
    mapsUrl: "https://maps.google.com/?q=The+Garden+Pavilion+Taguig",
  } as EventInfo,
  dressCode: {
    description: "Semi-formal / Garden Party",
    palette: [
      { name: "Sunflower", hex: "#E8C800" },
      { name: "Garden", hex: "#7BB040" },
      { name: "Sage", hex: "#B5CC6E" },
      { name: "Forest", hex: "#4E8A20" },
      { name: "Butter", hex: "#F5F2C0" },
    ] as ColorSwatch[],
  },
  entourage: [
    {
      role: "Principal Sponsors",
      members: [
        "Mr. Robert & Mrs. Maria Santos",
        "Mr. Thomas & Mrs. Clara Dela Cruz",
        "Mr. Antonio & Mrs. Sofia Reyes",
        "Mr. Julius & Mrs. Mary-Jane Watson",
      ],
    },
    {
      role: "Best Man",
      members: ["David Miller"],
    },
    {
      role: "Maid of Honor",
      members: ["Sarah Joyce"],
    },
    {
      role: "Groomsmen",
      members: ["Liam Wilson", "Noah Garcia", "Lucas Martinez"],
    },
    {
      role: "Bridesmaids",
      members: ["Emma Watson", "Olivia Chen", "Sophia Reyes"],
    },
  ] as EntourageGroup[],
  bibleVerse: {
    text: "So they are no longer two, but one flesh. Therefore what God has joined together, let no one separate.",
    reference: "Matthew 19:6",
  },
  noPlusOneText:
    "This invitation is strictly per invite only. We kindly ask that you do not bring additional guests.",
  giftNoteText:
    "Your presence is the greatest gift of all. If you wish to give, a monetary box will be available at the venue. Please do not bring physical gifts.",
  photoQRHeadline: "Snap & Share",
  photoQRBody:
    "Scan the QR code below to upload your photos to our shared album!",
};
