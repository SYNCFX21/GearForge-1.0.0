import React from 'react';
import { ShoppingBag, Flame, BadgeAlert, Coins, ExternalLink, HelpCircle } from 'lucide-react';

/**
 * LocalStoresDirectory Component
 * Comprehensive guide and directory for trusted Philippine PC gear stores
 * (Datablitz, EasyPC, Shopee, Lazada, Gilmore Cyberzone, Bermor, Dynaquest)
 * with voucher buying tips and physical warranty locations.
 * 
 * @whereUsed
 * - `src/App.tsx` (rendered under the 'stores' active tab)
 */
export default function LocalStoresDirectory() {
  const stores = [
    {
      name: 'Datablitz E-Commerce',
      type: 'Official Retail Chain',
      description: 'The largest gaming chain store in the Philippines. Great for authentic gear, controllers, official consoles, and keyboards (Wooting, Keychron, Logitech, Razer). Includes nationwide shipping and physical store pickups.',
      tips: 'Often has the best stock for genuine imported keyboards and esports mice at direct standard pricing.',
      url: 'https://ecommerce.datablitz.com.ph/'
    },
    {
      name: 'EasyPC',
      type: 'Component Retailer',
      description: 'Highly popular retailer with multiple branches around Manila. Home to local brand Rakk and budget peripherals (Koorui screens, Redragon, Fantech). Famous for fast delivery.',
      tips: 'Check out their official website for direct Rakk gear warranty support, or purchase via their LazMall store for free shipping vouchers.',
      url: 'https://easypc.com.ph/'
    },
    {
      name: 'Shopee Philippines',
      type: 'E-Commerce Marketplace',
      description: 'The absolute king of cheap deals, accessories, small gaming desk organizers, coiled cables, keycap sets, and modding parts.',
      tips: 'Always wait for Monthly Double-Double sales (e.g. 7.7, 8.8) or Midnight Payday sales to collect 30% off Mega Discount vouchers which can save up to ₱1,000 on mice and keyboards!',
      url: 'https://shopee.ph/'
    },
    {
      name: 'Lazada Philippines',
      type: 'E-Commerce Marketplace',
      description: 'Excellent catalog containing highly reliable official brand stores (LazMall). Often features faster logistics to Visayas and Mindanao.',
      tips: 'Stack "Lazada Bonus" coins + store vouchers + credit card partner vouchers during major sales to slash mid-range prices by 15-25%.',
      url: 'https://www.lazada.com.ph/'
    },
    {
      name: 'PC Express',
      type: 'IT Retailer',
      description: 'One of the oldest computer hardware stores in the country. Offers reliable warranty support on mainstream brands like Logitech, ASUS, and Razer.',
      tips: 'Good option if you prefer walk-in testing and buying directly inside malls rather than waiting for shipping.',
      url: 'https://pcx.com.ph/'
    },
    {
      name: 'Bermor Zone',
      type: 'Tech E-Store',
      description: 'An independent enthusiast PC retailer located in Laoag, Ilocos Norte, offering excellent nationwide shipping on monitors and custom accessories.',
      tips: 'They often have unique keyboard stock and competitive monitor pricing that sells out in Manila stores.',
      url: 'https://bermorzone.com.ph/'
    }
  ];  return (
    <div id="local-stores-directory" className="space-y-6 bg-[#141821]/70 backdrop-blur-md p-6 rounded-3xl border border-white/8 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/8 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight font-display uppercase">Philippine Gaming Gear Directory</h2>
          <p className="text-xs text-zinc-400 mt-1">Major trusted stores and e-commerce portals to safely purchase gaming peripherals in PHP.</p>
        </div>
        <div className="flex items-center gap-1.5 text-xxs font-extrabold text-predator-cyan bg-predator-cyan/10 py-1.5 px-3 rounded-full shrink-0 font-mono uppercase tracking-wider">
          <Coins className="w-4 h-4 text-predator-cyan" />
          <span>Voucher Friendly!</span>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stores.map((store, i) => (
          <div
            key={i}
            className="p-5 rounded-3xl border border-white/8 bg-[var(--app-bg)]/20 hover:border-predator-cyan/20 flex flex-col justify-between transition"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-predator-cyan font-mono">
                  {store.type}
                </span>
                <a
                  href={store.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#141821] hover:bg-[var(--app-bg)] text-zinc-400 hover:text-predator-cyan border border-white/5 rounded-xl transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div>
                <h3 className="font-extrabold text-white text-base uppercase font-display">{store.name}</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{store.description}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/8 bg-[var(--app-bg)]/40 p-3 rounded-2xl">
              <div className="flex gap-1.5 items-start">
                <Flame className="w-3.5 h-3.5 text-predator-cyan shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9px] font-bold text-predator-cyan/85 uppercase tracking-widest block font-mono">Pro Tip</span>
                  <p className="text-xxs text-zinc-400 mt-0.5 leading-normal">{store.tips}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Local Buying Safe Guidelines */}
      <div className="bg-predator-cyan/5 border border-predator-cyan/20 p-5 rounded-3xl space-y-4">
        <div className="flex items-center gap-2.5">
          <BadgeAlert className="w-5 h-5 text-predator-cyan" />
          <h4 className="font-extrabold text-sm text-white uppercase font-display">Local Buyer Protection Guide (Iwas-Budol Tips)</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <h5 className="font-bold text-predator-cyan font-mono tracking-wider text-xs uppercase">1. Look for Mall Tags</h5>
            <p className="text-zinc-400 leading-relaxed text-xxs">
              On Shopee and Lazada, prioritize stores tagged with **Shopee Mall** or **LazMall**. They guarantee 100% authentic products or 3x money back.
            </p>
          </div>
          <div className="space-y-1">
            <h5 className="font-bold text-predator-cyan font-mono tracking-wider text-xs uppercase">2. Record Unboxing Videos</h5>
            <p className="text-zinc-400 leading-relaxed text-xxs">
              Always record a continuous unboxing video of your gaming keyboard, mouse or headset. PH couriers require this in case of damage during transit.
            </p>
          </div>
          <div className="space-y-1">
            <h5 className="font-bold text-predator-cyan font-mono tracking-wider text-xs uppercase">3. Claim Local Warranty</h5>
            <p className="text-zinc-400 leading-relaxed text-xxs">
              Keep the product box! Brands like Rakk, Tecware, and Fantech require the original retail box with serial sticker intact for any RMA warranty replacements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
