import type { RouteKind, RoutePost } from "./model";

type SeedDriver = {
  id: string;
  name: string;
  phone: string;
  vehicleModel: string;
  vehiclePlate: string;
  contactLink?: string;
};

type RouteTemplate = {
  from: string;
  to: string;
  schedule: string;
  returnSchedule: string;
  operatingDays: string[];
  note: string;
};

const BASE_CREATED_AT = Date.parse("2026-03-10T05:00:00.000Z");
const REGULAR_WAVE_OFFSETS = [0, 8, 16];

const QLD_DRIVERS: SeedDriver[] = [
  {
    id: "qld-driver-01",
    name: "Harper",
    phone: "+61400001001",
    vehicleModel: "Toyota Corolla Hybrid",
    vehiclePlate: "QLD 401HA",
    contactLink: "https://open.kakao.com/o/qldharper",
  },
  {
    id: "qld-driver-02",
    name: "Ethan",
    phone: "+61400001002",
    vehicleModel: "Hyundai i30",
    vehiclePlate: "QLD 589ET",
  },
  {
    id: "qld-driver-03",
    name: "Mina",
    phone: "+61400001003",
    vehicleModel: "Mazda CX-5",
    vehiclePlate: "QLD 736MN",
    contactLink: "https://t.me/qld_ride_mina",
  },
  {
    id: "qld-driver-04",
    name: "Noah",
    phone: "+61400001004",
    vehicleModel: "Kia Cerato",
    vehiclePlate: "QLD 842NW",
  },
  {
    id: "qld-driver-05",
    name: "Sophie",
    phone: "+61400001005",
    vehicleModel: "Tesla Model 3",
    vehiclePlate: "QLD 193SP",
    contactLink: "https://open.kakao.com/o/qldsophie",
  },
  {
    id: "qld-driver-06",
    name: "Jayden",
    phone: "+61400001006",
    vehicleModel: "Nissan X-Trail",
    vehiclePlate: "QLD 605JD",
  },
  {
    id: "qld-driver-07",
    name: "Olivia",
    phone: "+61400001007",
    vehicleModel: "Honda Civic",
    vehiclePlate: "QLD 782OL",
    contactLink: "https://t.me/qld_ride_olivia",
  },
  {
    id: "qld-driver-08",
    name: "Liam",
    phone: "+61400001008",
    vehicleModel: "Subaru Forester",
    vehiclePlate: "QLD 914LM",
  },
  {
    id: "qld-driver-09",
    name: "Aria",
    phone: "+61400001009",
    vehicleModel: "Toyota RAV4",
    vehiclePlate: "QLD 267AR",
    contactLink: "https://open.kakao.com/o/qldaria",
  },
  {
    id: "qld-driver-10",
    name: "Lucas",
    phone: "+61400001010",
    vehicleModel: "Volkswagen Golf",
    vehiclePlate: "QLD 455LC",
  },
  {
    id: "qld-driver-11",
    name: "Ella",
    phone: "+61400001011",
    vehicleModel: "MG ZS",
    vehiclePlate: "QLD 390EL",
  },
  {
    id: "qld-driver-12",
    name: "Jackson",
    phone: "+61400001012",
    vehicleModel: "Mitsubishi Outlander",
    vehiclePlate: "QLD 633JK",
    contactLink: "https://t.me/qld_ride_jackson",
  },
];

const QLD_REGULAR_TEMPLATES: RouteTemplate[] = [
  {
    from: "Brisbane CBD, QLD",
    to: "St Lucia, QLD",
    schedule: "07:15",
    returnSchedule: "07:50",
    operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    note: "Morning university commute route.",
  },
  {
    from: "Chermside, QLD",
    to: "Fortitude Valley, QLD",
    schedule: "08:05",
    returnSchedule: "08:40",
    operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    note: "CBD edge drop-off near station.",
  },
  {
    from: "Sunnybank, QLD",
    to: "Brisbane CBD, QLD",
    schedule: "07:40",
    returnSchedule: "08:25",
    operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    note: "Direct city entry via M3.",
  },
  {
    from: "Indooroopilly, QLD",
    to: "South Bank, QLD",
    schedule: "08:20",
    returnSchedule: "09:00",
    operatingDays: ["Mon", "Wed", "Fri"],
    note: "Great for riverside office drop-offs.",
  },
  {
    from: "North Lakes, QLD",
    to: "Brisbane Airport, QLD",
    schedule: "06:30",
    returnSchedule: "07:05",
    operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    note: "Early airport staff commuter route.",
  },
  {
    from: "Redcliffe, QLD",
    to: "Brisbane CBD, QLD",
    schedule: "07:10",
    returnSchedule: "08:00",
    operatingDays: ["Mon", "Tue", "Thu", "Fri"],
    note: "Northside inbound route with one pickup window.",
  },
  {
    from: "Logan Central, QLD",
    to: "Mount Gravatt, QLD",
    schedule: "07:25",
    returnSchedule: "07:55",
    operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    note: "Southside work commute with reliable timing.",
  },
  {
    from: "Ipswich, QLD",
    to: "Springfield Central, QLD",
    schedule: "08:35",
    returnSchedule: "09:00",
    operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    note: "Short west corridor route.",
  },
  {
    from: "Toowoomba, QLD",
    to: "Brisbane CBD, QLD",
    schedule: "05:50",
    returnSchedule: "07:25",
    operatingDays: ["Mon", "Wed", "Fri"],
    note: "Long-distance commuter line.",
  },
  {
    from: "Gold Coast, QLD",
    to: "Brisbane CBD, QLD",
    schedule: "06:05",
    returnSchedule: "07:35",
    operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    note: "Intercity morning commuter.",
  },
  {
    from: "Robina, QLD",
    to: "Surfers Paradise, QLD",
    schedule: "08:15",
    returnSchedule: "08:45",
    operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    note: "Gold Coast local corridor.",
  },
  {
    from: "Maroochydore, QLD",
    to: "Brisbane Airport, QLD",
    schedule: "06:40",
    returnSchedule: "07:45",
    operatingDays: ["Mon", "Tue", "Thu", "Fri"],
    note: "Sunshine Coast airport transfer route.",
  },
  {
    from: "Noosa Heads, QLD",
    to: "Maroochydore, QLD",
    schedule: "07:05",
    returnSchedule: "07:45",
    operatingDays: ["Mon", "Wed", "Fri"],
    note: "Noosa to Sunshine Coast connector.",
  },
  {
    from: "Cairns CBD, QLD",
    to: "Smithfield, QLD",
    schedule: "07:30",
    returnSchedule: "08:00",
    operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    note: "Far North QLD commuter service.",
  },
  {
    from: "Townsville CBD, QLD",
    to: "James Cook University, QLD",
    schedule: "07:20",
    returnSchedule: "07:55",
    operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    note: "Campus route with fixed pickup points.",
  },
  {
    from: "Mackay CBD, QLD",
    to: "Paget, QLD",
    schedule: "06:55",
    returnSchedule: "07:25",
    operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    note: "Industrial area work shuttle.",
  },
  {
    from: "Rockhampton, QLD",
    to: "Yeppoon, QLD",
    schedule: "07:10",
    returnSchedule: "07:45",
    operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    note: "Central coast commuter route.",
  },
  {
    from: "Bundaberg, QLD",
    to: "Hervey Bay, QLD",
    schedule: "06:45",
    returnSchedule: "07:35",
    operatingDays: ["Mon", "Tue", "Thu", "Fri"],
    note: "Wide-area QLD regional connector.",
  },
];

const QLD_ONE_TIME_TEMPLATES: RouteTemplate[] = [
  {
    from: "Brisbane CBD, QLD",
    to: "Gold Coast, QLD",
    schedule: "18:20",
    returnSchedule: "19:35",
    operatingDays: ["Fri"],
    note: "Friday evening intercity trip.",
  },
  {
    from: "Brisbane Airport, QLD",
    to: "South Bank, QLD",
    schedule: "21:15",
    returnSchedule: "21:55",
    operatingDays: ["Sun"],
    note: "Late airport pickup route.",
  },
  {
    from: "St Lucia, QLD",
    to: "Indooroopilly, QLD",
    schedule: "13:10",
    returnSchedule: "13:30",
    operatingDays: ["Sat"],
    note: "Weekend short-distance route.",
  },
  {
    from: "Fortitude Valley, QLD",
    to: "New Farm, QLD",
    schedule: "22:05",
    returnSchedule: "22:20",
    operatingDays: ["Fri"],
    note: "Event night city transfer.",
  },
  {
    from: "Chermside, QLD",
    to: "Brisbane Showgrounds, QLD",
    schedule: "11:20",
    returnSchedule: "11:45",
    operatingDays: ["Sat"],
    note: "Showgrounds day event drop-off.",
  },
  {
    from: "Robina, QLD",
    to: "Gold Coast Airport, QLD",
    schedule: "16:10",
    returnSchedule: "16:45",
    operatingDays: ["Sun"],
    note: "Airport connection from central coast.",
  },
  {
    from: "Maroochydore, QLD",
    to: "Noosa Heads, QLD",
    schedule: "19:00",
    returnSchedule: "19:40",
    operatingDays: ["Sat"],
    note: "Sunshine Coast evening route.",
  },
  {
    from: "Ipswich, QLD",
    to: "Brisbane CBD, QLD",
    schedule: "12:15",
    returnSchedule: "13:05",
    operatingDays: ["Sat"],
    note: "Midday city run from Ipswich.",
  },
  {
    from: "Logan Central, QLD",
    to: "Sunnybank, QLD",
    schedule: "20:05",
    returnSchedule: "20:30",
    operatingDays: ["Fri"],
    note: "Short Friday evening southside run.",
  },
  {
    from: "Townsville CBD, QLD",
    to: "Magnetic Island Ferry, QLD",
    schedule: "09:10",
    returnSchedule: "09:35",
    operatingDays: ["Sun"],
    note: "Ferry terminal connection route.",
  },
  {
    from: "Cairns CBD, QLD",
    to: "Cairns Airport, QLD",
    schedule: "15:45",
    returnSchedule: "16:10",
    operatingDays: ["Sat"],
    note: "Airport run for afternoon flights.",
  },
  {
    from: "Mackay CBD, QLD",
    to: "Mackay Airport, QLD",
    schedule: "17:25",
    returnSchedule: "17:55",
    operatingDays: ["Sun"],
    note: "Regional airport one-time transfer.",
  },
  {
    from: "Rockhampton, QLD",
    to: "Rockhampton Airport, QLD",
    schedule: "18:05",
    returnSchedule: "18:35",
    operatingDays: ["Sun"],
    note: "Airport evening route.",
  },
  {
    from: "Bundaberg, QLD",
    to: "Bargara, QLD",
    schedule: "14:00",
    returnSchedule: "14:25",
    operatingDays: ["Sat"],
    note: "Weekend coastal transfer.",
  },
  {
    from: "Toowoomba, QLD",
    to: "Brisbane Airport, QLD",
    schedule: "05:30",
    returnSchedule: "07:05",
    operatingDays: ["Sun"],
    note: "Early airport transfer from west.",
  },
  {
    from: "North Lakes, QLD",
    to: "Redcliffe, QLD",
    schedule: "10:10",
    returnSchedule: "10:35",
    operatingDays: ["Sat"],
    note: "Weekend short route on the north coast.",
  },
  {
    from: "West End, QLD",
    to: "Brisbane CBD, QLD",
    schedule: "23:00",
    returnSchedule: "23:15",
    operatingDays: ["Fri"],
    note: "Late-night city drop.",
  },
  {
    from: "South Bank, QLD",
    to: "Brisbane Airport, QLD",
    schedule: "04:55",
    returnSchedule: "05:35",
    operatingDays: ["Mon"],
    note: "Early-morning airport run.",
  },
];

const shiftTime = (time: string, deltaMinutes: number) => {
  const [hourRaw, minuteRaw] = time.split(":");
  const hour = Number.parseInt(hourRaw ?? "0", 10);
  const minute = Number.parseInt(minuteRaw ?? "0", 10);
  const total = hour * 60 + minute + deltaMinutes;
  const wrapped = ((total % 1440) + 1440) % 1440;
  const nextHour = Math.floor(wrapped / 60);
  const nextMinute = wrapped % 60;
  return `${String(nextHour).padStart(2, "0")}:${String(nextMinute).padStart(2, "0")}`;
};

const buildSeedPost = (
  kind: RouteKind,
  template: RouteTemplate,
  postIndex: number,
  idSuffix: string
): RoutePost => {
  const driver = QLD_DRIVERS[postIndex % QLD_DRIVERS.length];
  const createdAt = new Date(BASE_CREATED_AT + postIndex * 1000 * 60 * 29).toISOString();

  return {
    id: `seed-qld-${idSuffix}`,
    kind,
    from: template.from,
    to: template.to,
    schedule: template.schedule,
    returnSchedule: template.returnSchedule,
    availableSeats: 1 + (postIndex % 4),
    operatingDays: template.operatingDays,
    contactPhone: driver.phone,
    contactLink: driver.contactLink,
    note: template.note,
    vehicleModel: driver.vehicleModel,
    vehiclePlate: driver.vehiclePlate,
    ownerUserId: driver.id,
    ownerName: driver.name,
    isPublic: true,
    createdAt,
  };
};

const regularSeedPosts = QLD_REGULAR_TEMPLATES.flatMap((template, templateIndex) =>
  REGULAR_WAVE_OFFSETS.map((offsetMinutes, waveIndex) => {
    const postIndex = templateIndex * REGULAR_WAVE_OFFSETS.length + waveIndex;
    const shiftedTemplate: RouteTemplate = {
      ...template,
      schedule: shiftTime(template.schedule, offsetMinutes),
      returnSchedule: shiftTime(template.returnSchedule, offsetMinutes),
      note: `${template.note} Wave ${waveIndex + 1}.`,
    };

    return buildSeedPost(
      "regular",
      shiftedTemplate,
      postIndex,
      `regular-${templateIndex + 1}-${waveIndex + 1}`
    );
  })
);

const oneTimeSeedPosts = QLD_ONE_TIME_TEMPLATES.map((template, index) =>
  buildSeedPost("one_time", template, regularSeedPosts.length + index, `one-time-${index + 1}`)
);

export const SEED_POSTS: RoutePost[] = [...regularSeedPosts, ...oneTimeSeedPosts];
