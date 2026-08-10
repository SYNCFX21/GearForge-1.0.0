import { Accessory, BudgetTier, PlaystylePreset, CategoryType } from '../types';

export function getSearchUrl(store: string, query: string): string {
  const encoded = encodeURIComponent(query);
  switch (store) {
    case 'Shopee':
      return `https://shopee.ph/search?keyword=${encoded}`;
    case 'Lazada':
      return `https://www.lazada.com.ph/catalog/?q=${encoded}`;
    case 'Datablitz':
      return `https://ecommerce.datablitz.com.ph/pages/search-results-page?q=${encoded}`;
    case 'EasyPC':
      return `https://easypc.com.ph/pages/search-results-page?q=${encoded}`;
    case 'PC Express':
      return `https://pcx.com.ph/search?q=${encoded}`;
    case 'Dynaquest':
      return `https://dynaquestpc.com/pages/search-results-page?q=${encoded}`;
    case 'Bermor Zone':
      return `https://bermorzone.com.ph/?s=${encoded}&post_type=product`;
    default:
      return '#';
  }
}

export const BUDGET_TIERS: BudgetTier[] = [
  {
    id: 'budget',
    name: 'Sari-Sari Saver (Ultra Budget)',
    minPrice: 500,
    maxPrice: 3000,
    description: 'Entry-level gaming gear that focuses on absolute cost efficiency without breaking. Best for casual players, students, and net-cafe style setups.',
    tagline: 'Mura pero may Palag! (Cheap but can compete!)',
    colorClass: 'text-emerald-600 dark:text-emerald-400',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/20',
    borderClass: 'border-emerald-200 dark:border-emerald-900/30'
  },
  {
    id: 'midrange',
    name: 'Kasama sa Rank (Sweet Spot)',
    minPrice: 3001,
    maxPrice: 8000,
    description: 'The golden middle. True performance mechanical keyboards, wireless mice with high-end sensors, and headsets with clear communication.',
    tagline: 'Best bang-for-the-buck setups for ranking up.',
    colorClass: 'text-primary-600 dark:text-primary-400',
    bgClass: 'bg-indigo-50 dark:bg-indigo-950/20',
    borderClass: 'border-primary-200 dark:border-primary-900/30'
  },
  {
    id: 'premium',
    name: 'Malakas Build (Pro Level)',
    minPrice: 8001,
    maxPrice: 20000,
    description: 'Top-tier esports equipment from international brands, custom-modded options, crisp microphones for streaming, and highly-rated 144Hz+ screens.',
    tagline: 'Serious gear for serious competitors and content creators.',
    colorClass: 'text-primary-600 dark:text-primary-400',
    bgClass: 'bg-amber-50 dark:bg-primary-950/20',
    borderClass: 'border-primary-200 dark:border-primary-900/30'
  },
  {
    id: 'enthusiast',
    name: 'Wala Nang Bukas (Enthusiast / God-Tier)',
    minPrice: 20001,
    maxPrice: 75000,
    description: 'No compromise. Hall-effect rapid trigger keyboards, top-performing lightweight wireless mice, professional audiophile studio monitors, and multi-monitor gear.',
    tagline: 'End-game luxury setup. Zero bottleneck, full flex.',
    colorClass: 'text-primary-600 dark:text-primary-400',
    bgClass: 'bg-rose-50 dark:bg-rose-950/20',
    borderClass: 'border-primary-200 dark:border-primary-900/30'
  }
];

export const PLAYSTYLE_PRESETS: PlaystylePreset[] = [
  {
    id: 'allrounder',
    name: 'All-Rounder (Balanced)',
    description: 'A well-rounded budget distribution for single-player, productivity, and casual multiplayer gaming.',
    icon: 'Gamepad2',
    distribution: {
      mouse: 25,
      keyboard: 35,
      headset: 30,
      mousepad: 10,
      mic: 0,
      monitor: 0,
      controller: 0,
      speakers: 0
    }
  },
  {
    id: 'fps',
    name: 'Competitive FPS (CS2 / Valorant Focus)',
    description: 'Prioritizes an ultra-precise sensor mouse and a clear positional-audio headset, with a high-quality mousepad.',
    icon: 'Crosshair',
    distribution: {
      mouse: 45,
      keyboard: 20,
      headset: 25,
      mousepad: 10,
      mic: 0,
      monitor: 0,
      controller: 0,
      speakers: 0
    }
  },
  {
    id: 'streamer',
    name: 'Starter Streamer / Content Creator',
    description: 'Allocates portion of the budget to a clear standalone microphone and comfortable long-session headset.',
    icon: 'Tv',
    distribution: {
      mouse: 20,
      keyboard: 25,
      headset: 20,
      mousepad: 5,
      mic: 30,
      monitor: 0,
      controller: 0,
      speakers: 0
    }
  },
  {
    id: 'fullstation',
    name: 'Full Battlestation Upgrader',
    description: 'Includes structural items like high refresh monitors, dedicated controllers, and speakers for complete room audio.',
    icon: 'Monitor',
    distribution: {
      mouse: 15,
      keyboard: 20,
      headset: 15,
      mousepad: 5,
      mic: 0,
      monitor: 35,
      controller: 5,
      speakers: 5
    }
  }
];

export const ACCESSORY_CATALOG: Accessory[] = [
  // --- MICE ---
  {
    id: 'm1',
    name: 'Rakk Dasig',
    brand: 'Rakk',
    category: 'mouse',
    imageUrl: 'https://cf.shopee.ph/file/1db63abc0dd61147b10dc5ad451f16f3',
    pricePhp: 545,
    description: 'Highly popular local budget gaming mouse featuring an ergonomic design and reliable Huano switches.',
    specs: ['Wired', 'PixArt 3325 Sensor', 'Up to 10,000 DPI', 'RGB Lighting', 'Huano Switches (20M clicks)'],
    links: [
      { storeName: 'EasyPC', url: getSearchUrl('EasyPC', 'Rakk Dasig') },
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'Rakk Dasig') },
      { storeName: 'Lazada', url: getSearchUrl('Lazada', 'Rakk Dasig') }
    ],
    rating: 4.4,
    tier: 'budget',
    isWireless: false
  },
  {
    id: 'm2',
    name: 'Logitech G102 Lightsync',
    brand: 'Logitech',
    category: 'mouse',
    imageUrl: 'https://imtechdz.com/wp-content/uploads/2024/10/Mouse_Logitech_G102_Black.png',
    pricePhp: 990,
    description: 'The legendary gateway mouse of Filipino gamers. Clean design, beautiful RGB, and classic reliable shape.',
    specs: ['Wired', '8,000 DPI Sensor', '6 Programmable Buttons', 'Lightsync RGB', 'Classic symmetrical design'],
    links: [
      { storeName: 'Datablitz', url: getSearchUrl('Datablitz', 'Logitech G102 Lightsync') },
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'Logitech G102 Lightsync') },
      { storeName: 'Lazada', url: getSearchUrl('Lazada', 'Logitech G102 Lightsync') }
    ],
    rating: 4.6,
    tier: 'budget',
    isWireless: false
  },
  {
    id: 'm3',
    name: 'VXE Dragonfly R1 (SE/Promo)',
    brand: 'VXE / VGN',
    category: 'mouse',
    imageUrl: 'https://down-sg.img.susercontent.com/file/cn-11134207-7r98o-lpharbu4uo2k12',
    pricePhp: 1650,
    description: 'The ultimate budget wireless king. Sub-55 gram weight, flawless PAW3395 sensor, and ultra-smooth glide.',
    specs: ['Wireless (2.4Ghz / Bluetooth)', 'PAW3395 Flagship Sensor', '51g Ultra-Lightweight', 'Up to 26,000 DPI', 'Huano Ice Blue Powder Dot switches'],
    links: [
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'VXE Dragonfly R1') },
      { storeName: 'Lazada', url: getSearchUrl('Lazada', 'VXE Dragonfly R1') }
    ],
    rating: 4.8,
    tier: 'midrange',
    isWireless: true
  },
  {
    id: 'm4',
    name: 'Logitech G304 Lightspeed',
    brand: 'Logitech',
    category: 'mouse',
    imageUrl: 'https://m.media-amazon.com/images/I/51VpABY-b6L._SL1500_.jpg',
    pricePhp: 1990,
    description: 'Filipino favorite wireless mouse for productivity and gaming alike. Powered by a single AA battery that lasts for months.',
    specs: ['Wireless Lightspeed (2.4Ghz)', 'HERO 12K Sensor', '99g with Lithium Battery', '250-hour continuous battery life'],
    links: [
      { storeName: 'Datablitz', url: getSearchUrl('Datablitz', 'Logitech G304 Lightspeed') },
      { storeName: 'EasyPC', url: getSearchUrl('EasyPC', 'Logitech G304') },
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'Logitech G304') }
    ],
    rating: 4.7,
    tier: 'midrange',
    isWireless: true
  },
  {
    id: 'm5',
    name: 'Razer Viper V3 Hyperspeed',
    brand: 'Razer',
    category: 'mouse',
    imageUrl: 'https://microless.com/cdn/products/6c6ea0457a5d1ea3f987927f54a25cee-hi.jpg',
    pricePhp: 3890,
    description: 'Premium ergonomic-symmetrical shape used by esports pros, powered by high-speed wireless tech and an optical sensor.',
    specs: ['Wireless (Hyperspeed 2.4Ghz)', 'Focus Pro 30K Optical Sensor', 'Gen-2 Mechanical Mouse Switches', '82g weight', 'Up to 280 hours battery life'],
    links: [
      { storeName: 'Datablitz', url: getSearchUrl('Datablitz', 'Razer Viper V3 Hyperspeed') },
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'Razer Viper V3 Hyperspeed') },
      { storeName: 'Lazada', url: getSearchUrl('Lazada', 'Razer Viper V3 Hyperspeed') }
    ],
    rating: 4.7,
    tier: 'premium',
    isWireless: true
  },
  {
    id: 'm6',
    name: 'Logitech G Pro X Superlight 2',
    brand: 'Logitech',
    category: 'mouse',
    imageUrl: 'https://resource.logitechg.com/d_transparent.gif/content/dam/gaming/en/products/pro-x-superlight-2/gallery-5-pro-x-superlight-2-gaming-mouse-white.png',
    pricePhp: 7950,
    description: 'The absolute choice for professional Valorant and CS2 players in the Philippines. Flawless tracking and zero delay.',
    specs: ['Wireless Lightspeed (2.4Ghz)', 'HERO 2 Sensor', '60g Ultra-Lightweight', 'LIGHTFORCE Hybrid Switches', 'Up to 95 hours battery life', 'USB-C charging'],
    links: [
      { storeName: 'Datablitz', url: getSearchUrl('Datablitz', 'Logitech G Pro X Superlight 2') },
      { storeName: 'PC Express', url: getSearchUrl('PC Express', 'G Pro X Superlight 2') },
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'Logitech G Pro X Superlight 2') }
    ],
    rating: 4.9,
    tier: 'enthusiast',
    isWireless: true
  },

  // --- KEYBOARDS ---
  {
    id: 'k1',
    name: 'Rakk Pluma',
    brand: 'Rakk',
    category: 'keyboard',
    imageUrl: 'https://rakk.ph/wp-content/uploads/2024/10/9101-a.png',
    pricePhp: 1195,
    description: 'Ultra-compact 68-key mechanical keyboard with removable Type-C cable and hot-swappable switches. Incredible entry level.',
    specs: ['60% Layout (68 Keys)', 'Hot-swappable Outemu Outemu Red/Blue Switches', 'Detachable Type-C', 'RGB Backlight', 'ABS keycaps'],
    links: [
      { storeName: 'EasyPC', url: getSearchUrl('EasyPC', 'Rakk Pluma') },
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'Rakk Pluma') },
      { storeName: 'Lazada', url: getSearchUrl('Lazada', 'Rakk Pluma') }
    ],
    rating: 4.5,
    tier: 'budget',
    isWireless: false
  },
  {
    id: 'k2',
    name: 'Tecware Phantom 87 RGB',
    brand: 'Tecware',
    category: 'keyboard',
    imageUrl: 'http://cdn.shopify.com/s/files/1/2301/4381/products/tecware-phantom-87-key-mechanical-rgb-keyboard-outemu-red-980410_1200x1200.jpg?v=1589406363',
    pricePhp: 1450,
    description: 'Renowned for its heavy duty aluminum plate, bright RGB, modular switches, and high durability. A staple of budget setups.',
    specs: ['TKL Layout (87 Keys)', 'Hot-swappable Outemu switches', 'Floating Key Design', 'Double-Shot ABS Keycaps', 'Braided Cable', 'Modular switches'],
    links: [
      { storeName: 'EasyPC', url: getSearchUrl('EasyPC', 'Tecware Phantom 87') },
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'Tecware Phantom 87') },
      { storeName: 'Lazada', url: getSearchUrl('Lazada', 'Tecware Phantom 87') }
    ],
    rating: 4.7,
    tier: 'budget',
    isWireless: false
  },
  {
    id: 'k3',
    name: 'Royal Kludge RK61 Triple Mode',
    brand: 'Royal Kludge',
    category: 'keyboard',
    imageUrl: 'https://alexnld.com/wp-content/uploads/2022/04/50217a2f-742e-4fc6-b3aa-7fcb5b18da10.jpg',
    pricePhp: 1890,
    description: 'The entry point to modding. 60% compact wireless mechanical keyboard that easily connects to phones, laptops, and PCs.',
    specs: ['60% Compact Layout', 'Bluetooth 5.0 / 2.4Ghz / Wired', 'Hot-swappable RK Switches', 'Per-key RGB Backlit', 'High capacity battery'],
    links: [
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'Royal Kludge RK61') },
      { storeName: 'Lazada', url: getSearchUrl('Lazada', 'Royal Kludge RK61') }
    ],
    rating: 4.6,
    tier: 'budget',
    isWireless: true
  },
  {
    id: 'k4',
    name: 'Keychron V1 QMK Custom Keyboard',
    brand: 'Keychron',
    category: 'keyboard',
    imageUrl: 'https://keychron.in/wp-content/uploads/2023/01/keychronv1custommechanicalkeyboard28-1657706139858-scaled.jpg',
    pricePhp: 4190,
    description: 'An exceptional custom mechanical keyboard with screw-in stabilizers, sound-absorbing foam, and full QMK/VIA software remapping.',
    specs: ['75% Layout', 'Screw-in PCB Stabilizers', 'Hot-swappable Keychron K Pro switches', 'Double-shot OSA PBT Keycaps', 'South-facing RGB', 'QMK/VIA Support'],
    links: [
      { storeName: 'Datablitz', url: getSearchUrl('Datablitz', 'Keychron V1') },
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'Keychron V1') },
      { storeName: 'Lazada', url: getSearchUrl('Lazada', 'Keychron V1') }
    ],
    rating: 4.8,
    tier: 'midrange',
    isWireless: false
  },
  {
    id: 'k5',
    name: 'MonsGeek M1 V3 Alu Gasket',
    brand: 'MonsGeek',
    category: 'keyboard',
    imageUrl: 'https://media.karousell.com/media/photos/products/2023/10/21/monsgeek_m1_aluminium_custom_r_1697903650_f2f3c216_progressive',
    pricePhp: 5350,
    description: 'Anodized aluminum CNC case featuring a flex-cut gasket mount that produces an incredible deep "creamy" sound profile.',
    specs: ['75% Layout', 'CNC Aluminum Case', 'Gasket Mount', 'Flex-cut PCB & Plate', 'Screw-in Stabilizers', 'Coiled Cable Included'],
    links: [
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'MonsGeek M1') },
      { storeName: 'Lazada', url: getSearchUrl('Lazada', 'MonsGeek M1') }
    ],
    rating: 4.9,
    tier: 'midrange',
    isWireless: false
  },
  {
    id: 'k6',
    name: 'Wooting 60HE+ Rapid Trigger',
    brand: 'Wooting',
    category: 'keyboard',
    imageUrl: 'https://down-id.img.susercontent.com/file/id-11134201-7rbkb-m9joyg88sl6b0d',
    pricePhp: 13950,
    description: 'The gold standard for esports. Magnetic Lekker switches provide analog control and instant key resets for perfect stutter-stepping.',
    specs: ['60% Layout', 'Analog Magnetic Lekker Switches', 'Rapid Trigger (0.1mm - 4.0mm actuation)', '0.1ms Input Latency', 'PBT Keycaps'],
    links: [
      { storeName: 'Datablitz', url: getSearchUrl('Datablitz', 'Wooting 60HE') },
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'Wooting 60HE') }
    ],
    rating: 5.0,
    tier: 'enthusiast',
    isWireless: false
  },

  // --- HEADSETS ---
  {
    id: 'h1',
    name: 'Rakk Hatin RGB',
    brand: 'Rakk',
    category: 'headset',
    imageUrl: 'https://ph-test-11.slatic.net/p/09fab2cfe041cb9396b8c4e67fff61c9.jpg',
    pricePhp: 795,
    description: 'Excellent ultra-budget gaming headset. Lightweight, breathable earcups, and loud virtual 7.1 surround sound output.',
    specs: ['Wired USB Connection', 'Virtual 7.1 Surround Sound', 'Flexible Gooseneck Mic', 'Over-Ear memory foam', 'Inline Volume Controls'],
    links: [
      { storeName: 'EasyPC', url: getSearchUrl('EasyPC', 'Rakk Hatin') },
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'Rakk Hatin') }
    ],
    rating: 4.3,
    tier: 'budget',
    isWireless: false
  },
  {
    id: 'h2',
    name: 'Fantech HG11 Captain 7.1',
    brand: 'Fantech',
    category: 'headset',
    imageUrl: 'https://numberonestore.net/image/cache/catalog/PRODUCT/AUDIO/GAMING HEADSET/FANTECH/hg11/fantech-hg11-captain-7.1-sourround-sound-rgb-gaming-headset-6-1100x1100.jpg',
    pricePhp: 990,
    description: 'A classic internet cafe standard in the Philippines. Durable suspension headband design and noise-cancelling microphone.',
    specs: ['Wired USB', 'True Virtual 7.1 Surround', '50mm Speaker Drivers', 'Suspension Headband', 'Noise-cancelling mic'],
    links: [
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'Fantech HG11 Captain') },
      { storeName: 'Lazada', url: getSearchUrl('Lazada', 'Fantech HG11 Captain') }
    ],
    rating: 4.5,
    tier: 'budget',
    isWireless: false
  },
  {
    id: 'h3',
    name: 'Razer BlackShark V2 X',
    brand: 'Razer',
    category: 'headset',
    imageUrl: 'https://m.media-amazon.com/images/I/61ARHuuiNuL._AC_SL1500_.jpg',
    pricePhp: 2190,
    description: 'Superb competitive headset. Extremely lightweight, exceptional sound isolation, and high-clarity cardioid microphone.',
    specs: ['Wired 3.5mm Analog', 'TriForce 50mm Drivers', 'HyperClear Cardioid Mic', 'Advanced Passive Noise Cancellation', '240g Lightweight Design'],
    links: [
      { storeName: 'Datablitz', url: getSearchUrl('Datablitz', 'Razer BlackShark V2 X') },
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'Razer BlackShark V2 X') },
      { storeName: 'Lazada', url: getSearchUrl('Lazada', 'Razer BlackShark V2 X') }
    ],
    rating: 4.7,
    tier: 'midrange',
    isWireless: false
  },
  {
    id: 'h4',
    name: 'Logitech G435 Lightspeed',
    brand: 'Logitech',
    category: 'headset',
    imageUrl: 'https://m.media-amazon.com/images/I/81bQEkMevBL.jpg',
    pricePhp: 3150,
    description: 'Perfect for long gaming session comfort. Weight is just 165g, wireless connectivity is zero-latency, and features hidden beamforming dual mics.',
    specs: ['Wireless Lightspeed + Bluetooth', '165g featherlight design', 'Dual beamforming embedded microphones', '18-hour battery life', 'Eco-friendly materials'],
    links: [
      { storeName: 'Datablitz', url: getSearchUrl('Datablitz', 'Logitech G435') },
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'Logitech G435') },
      { storeName: 'Lazada', url: getSearchUrl('Lazada', 'Logitech G435') }
    ],
    rating: 4.6,
    tier: 'midrange',
    isWireless: true
  },
  {
    id: 'h5',
    name: 'HyperX Cloud III Gaming Headset',
    brand: 'HyperX',
    category: 'headset',
    imageUrl: 'https://m.media-amazon.com/images/I/81dkzD4hxIL.jpg',
    pricePhp: 4790,
    description: 'The king of comfort and build quality. All-metal frame, plush memory foam, and a redesigned high-definition detachable mic.',
    specs: ['Wired 3.5mm + USB Dongle', 'Durable Aluminum Frame', 'Plush Signature Memory Foam', 'Angled 53mm Drivers', '10mm Ultra-Clear Mic'],
    links: [
      { storeName: 'Datablitz', url: getSearchUrl('Datablitz', 'HyperX Cloud III') },
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'HyperX Cloud III') },
      { storeName: 'Lazada', url: getSearchUrl('Lazada', 'HyperX Cloud III') }
    ],
    rating: 4.8,
    tier: 'midrange',
    isWireless: false
  },
  {
    id: 'h6',
    name: 'SteelSeries Arctis Nova 7 Wireless',
    brand: 'SteelSeries',
    category: 'headset',
    imageUrl: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6515/6515802cv21d.jpg',
    pricePhp: 9495,
    description: 'Simultaneous wireless audio allows you to play on PC via ultra-fast 2.4Ghz while listening to music or discord on your phone via Bluetooth.',
    specs: ['Wireless 2.4Ghz + Bluetooth + USB-C', 'High Fidelity Speaker Drivers', 'ClearCast Gen 2 Retractable Mic', '38-hour battery with fast charge', 'ComfortMAX Headband System'],
    links: [
      { storeName: 'Datablitz', url: getSearchUrl('Datablitz', 'Arctis Nova 7') },
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'Arctis Nova 7 Wireless') }
    ],
    rating: 4.8,
    tier: 'premium',
    isWireless: true
  },

  // --- MOUSEPADS ---
  {
    id: 'p1',
    name: 'Rakk Maris Pro Deskmat',
    brand: 'Rakk',
    category: 'mousepad',
    imageUrl: 'https://rakk.ph/wp-content/uploads/2023/06/4568-a.jpg',
    pricePhp: 350,
    description: 'Full sized 900x400mm deskmat with beautifully printed local designs, stitched edges, and reliable anti-slip rubber.',
    specs: ['900 x 400 x 3mm', 'Speed/Control Hybrid surface', 'Stitched Anti-fray borders', 'Anti-slip rubber base'],
    links: [
      { storeName: 'EasyPC', url: getSearchUrl('EasyPC', 'Rakk Maris') },
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'Rakk Maris Pro') }
    ],
    rating: 4.4,
    tier: 'budget',
    isWireless: false
  },
  {
    id: 'p2',
    name: 'Fantech Vigil MP456',
    brand: 'Fantech',
    category: 'mousepad',
    imageUrl: 'https://www.ryans.com/storage/media_gallery/Fantech Vigil MP456 Black Gaming Mouse Pad 4_1712213591.jpg',
    pricePhp: 390,
    description: 'Optimized tracking mousepad that fits standard desk sizes. Resistant to moisture, humidity, and easily washable.',
    specs: ['450 x 400 x 4mm', 'Micro-woven speed cloth', 'Water resistant surface coating', 'Thick 4mm premium foam'],
    links: [
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'Fantech MP456') },
      { storeName: 'Lazada', url: getSearchUrl('Lazada', 'Fantech MP456') }
    ],
    rating: 4.5,
    tier: 'budget',
    isWireless: false
  },
  {
    id: 'p3',
    name: 'MD Custom Mousepad / Deskmat',
    brand: 'MD Custom',
    category: 'mousepad',
    imageUrl: 'https://lzd-img-global.slatic.net/g/p/e7e134619ce2cbde26096f46c2540a14.png_720x720q80.png',
    pricePhp: 650,
    description: 'Locally crafted custom deskmat shop. Offers top-tier printing clarity, dense stitch lines, and personalized gaming aesthetics.',
    specs: ['900 x 400 x 4mm', 'High density microfiber cloth', 'Customizable graphics', 'Thicker 4mm base for wrist support'],
    links: [
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'MD Custom Mousepad') }
    ],
    rating: 4.7,
    tier: 'midrange',
    isWireless: false
  },
  {
    id: 'p4',
    name: 'SteelSeries QcK Large',
    brand: 'SteelSeries',
    category: 'mousepad',
    imageUrl: 'https://down-my.img.susercontent.com/file/my-11134207-7qul5-lf0im67yo905d5',
    pricePhp: 1150,
    description: 'The definitive cloth mousepad designed for competitive shooter players. Incredible control and predictable friction resistance.',
    specs: ['450 x 400 x 2mm', 'Exclusive QcK micro-woven cloth', 'Optimized for low and high CPI tracking', 'Washed easily'],
    links: [
      { storeName: 'Datablitz', url: getSearchUrl('Datablitz', 'SteelSeries QcK Large') },
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'SteelSeries QcK Large') }
    ],
    rating: 4.6,
    tier: 'midrange',
    isWireless: false
  },
  {
    id: 'p5',
    name: 'Artisan FX Zero (MID/XSOFT)',
    brand: 'Artisan',
    category: 'mousepad',
    imageUrl: 'https://img.lazcdn.com/g/p/1998e1c5c797b2f7910d364de4402c4f.png_720x720q80.png',
    pricePhp: 3850,
    description: 'Handcrafted Japanese masterpiece mousepad. Resistant to Philippine humidity, never slides on desk, offering the ultimate speed-stop control balance.',
    specs: ['490 x 420 x 4mm XL Size', 'Esports standard knitting', 'Amazing resistance to sweat and humidity', 'PORON high density foam backing', 'Ultra fine stitching'],
    links: [
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'Artisan FX Zero') }
    ],
    rating: 5.0,
    tier: 'enthusiast',
    isWireless: false
  },

  // --- STANDALONE MICROPHONES ---
  {
    id: 'mc1',
    name: 'Fifine AmpliGame A6V USB',
    brand: 'Fifine',
    category: 'mic',
    imageUrl: 'https://lzd-img-global.slatic.net/g/ff/kf/Sb4e42dfe049942a7bf805cb2606e64bbE.jpg_720x720q80.jpg',
    pricePhp: 1650,
    description: 'Plug-and-play USB condenser mic with standard pop filter, robust shock mount, and instant tap-to-mute capacitive sensor.',
    specs: ['USB-C Connection', 'Cardioid Polar Pattern', 'RGB Lighting', 'Capacitive Tap-to-Mute sensor', 'Included Shockmount & Pop Filter'],
    links: [
      { storeName: 'Datablitz', url: getSearchUrl('Datablitz', 'Fifine AmpliGame A6V') },
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'Fifine A6V') }
    ],
    rating: 4.7,
    tier: 'midrange',
    isWireless: false
  },
  {
    id: 'mc2',
    name: 'Razer Seiren Mini',
    brand: 'Razer',
    category: 'mic',
    imageUrl: 'https://m.media-amazon.com/images/I/61SOA8-WWJL.jpg',
    pricePhp: 2190,
    description: 'Ultra-compact condenser microphone tuned with a tight pickup angle to isolate keyboard clicks and fan noises behind the mic.',
    specs: ['USB Wired', 'Supercardioid precise pickup pattern', 'Heavy duty tilting stand', 'Built-in shockmount'],
    links: [
      { storeName: 'Datablitz', url: getSearchUrl('Datablitz', 'Razer Seiren Mini') },
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'Razer Seiren Mini') },
      { storeName: 'Lazada', url: getSearchUrl('Lazada', 'Razer Seiren Mini') }
    ],
    rating: 4.6,
    tier: 'midrange',
    isWireless: false
  },
  {
    id: 'mc3',
    name: 'Maono DM30 RGB USB',
    brand: 'Maono',
    category: 'mic',
    imageUrl: 'https://down-sg.img.susercontent.com/file/cn-11134207-7r98o-lwwqi2az8dnnf2',
    pricePhp: 2450,
    description: 'A metal-bodied gaming microphone with multi-functional software. Gain dial, headphone monitor output, and customized RGB.',
    specs: ['USB-C Wired', 'Real metal housing', 'Hardware Gain Controller Dial', '3.5mm Headphone Jack Monitoring', 'Maono Link Software control'],
    links: [
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'Maono DM30') },
      { storeName: 'Lazada', url: getSearchUrl('Lazada', 'Maono DM30') }
    ],
    rating: 4.7,
    tier: 'midrange',
    isWireless: false
  },

  // --- MONITORS ---
  {
    id: 'mn1',
    name: 'Koorui 24E3 165Hz IPS',
    brand: 'Koorui',
    category: 'monitor',
    imageUrl: 'https://microless.com/cdn/products/bc7c11bb4fbfdb15992b70bdb5d5b26e-hi.jpg',
    pricePhp: 5650,
    description: 'The undisputed budget esports screen of the decade. IPS panel, stunning viewing angles, vibrant colors, and true high refresh.',
    specs: ['24-inch Display', 'FHD (1920x1080) Resolution', '165Hz Refresh Rate', 'IPS Panel Technology', '1ms Response Time', 'G-Sync/FreeSync compatible'],
    links: [
      { storeName: 'EasyPC', url: getSearchUrl('EasyPC', 'Koorui 24E3') },
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'Koorui 24E3') },
      { storeName: 'Lazada', url: getSearchUrl('Lazada', 'Koorui 24E3') }
    ],
    rating: 4.8,
    tier: 'midrange',
    isWireless: false
  },
  {
    id: 'mn2',
    name: 'AOC 24G2SP 165Hz',
    brand: 'AOC',
    category: 'monitor',
    imageUrl: 'https://m.media-amazon.com/images/I/71dqrdXvfnL._AC_SL1500_.jpg',
    pricePhp: 7850,
    description: 'Highly acclaimed competitive screen. Exceptional color gamut coverage, height-adjustable premium stand, and zero ghosting.',
    specs: ['23.8-inch Panel', 'IPS Wide-viewing', '165Hz High Refresh', 'Ergonomic Height, Tilt, Pivot Stand', 'Adaptive Sync', 'DCI-P3 90% wide color'],
    links: [
      { storeName: 'Datablitz', url: getSearchUrl('Datablitz', 'AOC 24G2SP') },
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'AOC 24G2SP') }
    ],
    rating: 4.8,
    tier: 'midrange',
    isWireless: false
  },
  {
    id: 'mn3',
    name: 'ASUS TUF Gaming VG249Q3A',
    brand: 'ASUS',
    category: 'monitor',
    imageUrl: 'https://m.media-amazon.com/images/I/71v6eqZJt2L._AC_.jpg',
    pricePhp: 8450,
    description: 'Tough, robust gaming build quality, offering a fast IPS screen with extreme low motion blur (ELMB) technology for perfect clarity.',
    specs: ['23.8-inch Full HD', 'Fast IPS 180Hz overclocked', '1ms (GTG) Response Time', 'ASUS ELMB Sync technology', 'Shadow Boost details helper'],
    links: [
      { storeName: 'Datablitz', url: getSearchUrl('Datablitz', 'ASUS VG249Q3A') },
      { storeName: 'PC Express', url: getSearchUrl('PC Express', 'ASUS VG249Q3A') },
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'ASUS VG249Q3A') }
    ],
    rating: 4.8,
    tier: 'premium',
    isWireless: false
  },

  // --- CONTROLLERS ---
  {
    id: 'c1',
    name: '8BitDo Ultimate C Wireless',
    brand: '8BitDo',
    category: 'controller',
    imageUrl: 'https://m.media-amazon.com/images/I/51LwKh2jMmL.jpg',
    pricePhp: 1150,
    description: 'Beautiful pastel designs with robust build quality, excellent textured grip, and lag-free 2.4Ghz wireless receiver inclusion.',
    specs: ['Wireless (2.4Ghz USB Dongle)', 'Compatible with PC, Steam Deck, Android', 'Asymmetrical joystick layout', '25-hour rechargeable battery life'],
    links: [
      { storeName: 'Datablitz', url: getSearchUrl('Datablitz', '8BitDo Ultimate C') },
      { storeName: 'Shopee', url: getSearchUrl('Shopee', '8BitDo Ultimate C') }
    ],
    rating: 4.7,
    tier: 'budget',
    isWireless: true
  },
  {
    id: 'c2',
    name: 'Flydigi Direwolf 2 Wireless',
    brand: 'Flydigi',
    category: 'controller',
    imageUrl: 'https://www.maxgaming.com/bilder/artiklar/zoom/34368_1.jpg?m=1741599005',
    pricePhp: 1650,
    description: 'Equipped with highly accurate Hall Effect joysticks that guarantee zero drift over millions of action cycles.',
    specs: ['Tri-mode (2.4G / Bluetooth / Wired)', 'Hall Effect Anti-Drift Joysticks', 'Multi-platform support', '800Hz high polling rate wired', 'Rear programmable macro back buttons'],
    links: [
      { storeName: 'Datablitz', url: getSearchUrl('Datablitz', 'Flydigi Direwolf 2') },
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'Flydigi Direwolf 2') }
    ],
    rating: 4.8,
    tier: 'midrange',
    isWireless: true
  },

  // --- SPEAKERS ---
  {
    id: 'sp1',
    name: 'Redragon GS520 Anvil RGB',
    brand: 'Redragon',
    category: 'speakers',
    imageUrl: 'https://m.media-amazon.com/images/I/71UuyaUmkhL._AC_SL1500_.jpg',
    pricePhp: 790,
    description: 'Compact 2.0 dual stereo speaker system featuring modern touch-controlled RGB lighting and clean desktop layout.',
    specs: ['USB Powered 5V', 'Dual 3W Stereo Drivers', 'Touch RGB lighting', '3.5mm Aux input', 'Front volume knobs'],
    links: [
      { storeName: 'EasyPC', url: getSearchUrl('EasyPC', 'Redragon GS520') },
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'Redragon GS520') }
    ],
    rating: 4.4,
    tier: 'budget',
    isWireless: false
  },
  {
    id: 'sp2',
    name: 'Creative Pebble V3 USB-C',
    brand: 'Creative',
    category: 'speakers',
    imageUrl: 'https://img.creative.com/inline/products/23507/6_colour_black.jpg',
    pricePhp: 1890,
    description: 'A modern, award-winning speaker system with clear vocal processing, custom elevated drivers, and integrated Bluetooth streaming.',
    specs: ['USB-C Single Cable connection', 'Built-in Bluetooth 5.0 receiver', 'Custom 45-degree elevated drivers', 'High Gain mode switch (up to 16W output)'],
    links: [
      { storeName: 'Datablitz', url: getSearchUrl('Datablitz', 'Creative Pebble V3') },
      { storeName: 'Shopee', url: getSearchUrl('Shopee', 'Creative Pebble V3') },
      { storeName: 'Lazada', url: getSearchUrl('Lazada', 'Creative Pebble V3') }
    ],
    rating: 4.7,
    tier: 'midrange',
    isWireless: false
  }
];

export function getRecommendedPresetLoadout(
  budget: number, 
  playstyleId: string, 
  shuffleSeed: number = 0,
  itemOverrides?: Partial<Record<CategoryType, string>>
): Accessory[] {
  const preset = PLAYSTYLE_PRESETS.find(p => p.id === playstyleId) || PLAYSTYLE_PRESETS[0];
  const selected: Accessory[] = [];
  
  // Define required categories based on playstyle
  const categoriesToFind: CategoryType[] = ['mouse', 'keyboard', 'headset', 'mousepad'];
  if (preset.id === 'streamer') {
    categoriesToFind.push('mic');
  } else if (preset.id === 'fullstation') {
    categoriesToFind.push('monitor');
    categoriesToFind.push('controller');
    categoriesToFind.push('speakers');
  }

  let spent = 0;
  
  // Map categories to list of options matching target budget tier
  categoriesToFind.forEach((cat, index) => {
    // Check if user manually picked an override item for this category
    if (itemOverrides && itemOverrides[cat]) {
      const overrideItem = ACCESSORY_CATALOG.find(item => item.id === itemOverrides[cat]);
      if (overrideItem) {
        selected.push(overrideItem);
        spent += overrideItem.pricePhp;
        return;
      }
    }

    const pct = preset.distribution[cat] || (100 / categoriesToFind.length);
    const targetBudgetForCat = budget * (pct / 100);
    
    // Find all items in this category
    const items = ACCESSORY_CATALOG.filter(item => item.category === cat);
    if (items.length === 0) return;
    
    // Sort items by absolute price difference to targetBudgetForCat
    const sorted = [...items].sort((a, b) => {
      const diffA = Math.abs(a.pricePhp - targetBudgetForCat);
      const diffB = Math.abs(b.pricePhp - targetBudgetForCat);
      return diffA - diffB;
    });
    
    // Rotate candidate picking based on shuffleSeed
    const rotatedIndex = (shuffleSeed + index) % sorted.length;
    const matchItem = sorted[rotatedIndex] || sorted[0];
    selected.push(matchItem);
    spent += matchItem.pricePhp;
  });

  // Simple optimization: if we went over budget, swap out the most expensive non-overridden items to cheaper ones
  let attempts = 0;
  while (spent > budget && attempts < 10) {
    attempts++;
    let itemToSwapIdx = -1;
    let maxCheaperDiff = 0;
    let alternativeItem: Accessory | null = null;
    
    for (let i = 0; i < selected.length; i++) {
      const currentItem = selected[i];
      if (itemOverrides && itemOverrides[currentItem.category]) continue; // preserve user lock if possible

      const cheaperAlternatives = ACCESSORY_CATALOG.filter(
        item => item.category === currentItem.category && item.pricePhp < currentItem.pricePhp
      );
      
      if (cheaperAlternatives.length > 0) {
        const sortedAlt = cheaperAlternatives.sort((a, b) => b.pricePhp - a.pricePhp);
        const bestAlt = sortedAlt[0];
        const diff = currentItem.pricePhp - bestAlt.pricePhp;
        if (diff > maxCheaperDiff) {
          maxCheaperDiff = diff;
          itemToSwapIdx = i;
          alternativeItem = bestAlt;
        }
      }
    }
    
    if (itemToSwapIdx !== -1 && alternativeItem) {
      spent = spent - selected[itemToSwapIdx].pricePhp + alternativeItem.pricePhp;
      selected[itemToSwapIdx] = alternativeItem;
    } else {
      break;
    }
  }

  // If remaining budget > 10%, upgrade items if possible
  attempts = 0;
  while (spent < budget * 0.9 && attempts < 10) {
    attempts++;
    let itemToUpgradeIdx = -1;
    let minUpgradeCost = Infinity;
    let upgradedAlternative: Accessory | null = null;
    
    for (let i = 0; i < selected.length; i++) {
      const currentItem = selected[i];
      if (itemOverrides && itemOverrides[currentItem.category]) continue;

      const remainingBudget = budget - spent;
      const moreExpensiveAlternatives = ACCESSORY_CATALOG.filter(
        item => item.category === currentItem.category && 
                item.pricePhp > currentItem.pricePhp &&
                (item.pricePhp - currentItem.pricePhp) <= remainingBudget
      );
      
      if (moreExpensiveAlternatives.length > 0) {
        const sortedAlt = moreExpensiveAlternatives.sort((a, b) => a.pricePhp - b.pricePhp);
        const bestAlt = sortedAlt[0];
        const additionalCost = bestAlt.pricePhp - currentItem.pricePhp;
        if (additionalCost < minUpgradeCost) {
          minUpgradeCost = additionalCost;
          itemToUpgradeIdx = i;
          upgradedAlternative = bestAlt;
        }
      }
    }
    
    if (itemToUpgradeIdx !== -1 && upgradedAlternative) {
      spent = spent - selected[itemToUpgradeIdx].pricePhp + upgradedAlternative.pricePhp;
      selected[itemToUpgradeIdx] = upgradedAlternative;
    } else {
      break;
    }
  }

  return selected;
}
