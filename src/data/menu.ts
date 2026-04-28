import { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
  // STARTERS
  {
    id: 's1',
    name: 'Truffle Suya Beef Carpaccio',
    description: 'Thinly sliced tenderloin, traditional suya spiced crust, truffle oil, and microgreens.',
    price: 8500,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
    isPopular: true
  },
  {
    id: 's2',
    name: 'Yam & Ginger Soup',
    description: 'Silky yam puree infused with fresh ginger and coconut milk, topped with plantain crisps.',
    price: 5500,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 's3',
    name: 'Honey-Glazed Chicken Gizzards',
    description: 'Peppered gizzards with a honey-soy reduction and charred spring onions.',
    price: 6000,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 's4',
    name: 'Moin Moin Terrine',
    description: 'Savory steamed bean cake with smoked prawns and a bell pepper coulis.',
    price: 4500,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1541014741259-df549fa3bb68?auto=format&fit=crop&q=80&w=800'
  },
  // MAINS
  {
    id: 'm1',
    name: 'Signature Seafood Okra',
    description: 'Finely chopped okra with tiger prawns, calimari, and fresh fish in a rich seafood stock.',
    price: 18500,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=800',
    isPopular: true
  },
  {
    id: 'm2',
    name: 'Slow-Cooked Goat Curry',
    description: 'Tender goat meat slow-braised for 12 hours in authentic Nigerian spices and Scotch Bonnet.',
    price: 12500,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1544124499-58ed34b7520e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm3',
    name: 'Smoked Catfish Risotto',
    description: 'A fusion of Italian Arborio rice cooked with smoked catfish broth and native herbs.',
    price: 14000,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm4',
    name: 'Native Fisherman Pottage',
    description: 'Yam pottage with snails, periwinkles, and dried fish in sustainable red oil.',
    price: 11000,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800'
  },
  // GRILL
  {
    id: 'g1',
    name: 'Whole Charred Croaker',
    description: 'Grilled whole fish stuffed with aromatics, served with plantain fries.',
    price: 22000,
    category: 'Grill',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
    isPopular: true
  },
  {
    id: 'g2',
    name: 'Zuma Rib-Eye',
    description: '300g prime beef, suya-rubbed, with red wine jus and roasted garlic mash.',
    price: 32000,
    category: 'Grill',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'g3',
    name: 'Spiced Lamb Chops',
    description: 'Grilled lamb chops marinated in scent leaf pesto and yogurt.',
    price: 28000,
    category: 'Grill',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800'
  },
  // SIDES
  {
    id: 'si1',
    name: 'Jollof Rice Infusion',
    description: 'Our world-famous long-grain rice cooked in a rich tomato and bell pepper base.',
    price: 3500,
    category: 'Sides',
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'si2',
    name: 'Sweet Plantain Slices',
    description: 'Perfectly ripened yellow plantains, fried to a golden caramelization.',
    price: 2500,
    category: 'Sides',
    image: 'https://images.unsplash.com/photo-1599307734170-83360511de54?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'si3',
    name: 'Truffle Fries with Suya Dust',
    description: 'Double-fried potato spears tossed in truffle oil and spicy suya seasoning.',
    price: 4500,
    category: 'Sides',
    image: 'https://images.unsplash.com/photo-1573016608244-7d52601c098c?auto=format&fit=crop&q=80&w=800'
  },
  // DESSERTS
  {
    id: 'd1',
    name: 'Chocolate Puff-Puff',
    description: 'Traditional fried dough balls with a molten dark chocolate center.',
    price: 6500,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd028c1d5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'd2',
    name: 'Zobo Poached Pears',
    description: 'Pears slow-cooked in hibiscus flower tea, served with vanilla bean gelato.',
    price: 7500,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&q=80&w=800'
  },
  // DRINKS
  {
    id: 'dr1',
    name: 'Palm Wine Cooler',
    description: 'Fresh palm wine infused with lemongrass and ginger.',
    price: 4500,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1544145945-f904253d0c71?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'dr2',
    name: 'Hibiscus Spritz (Zobo)',
    description: 'Sparkling cocktail made with dried hibiscus petals and hints of cinnamon.',
    price: 4000,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'dr3',
    name: 'Chapman Signature',
    description: 'The classic Nigerian cocktail with citrus bitters and cucumber garnish.',
    price: 3500,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'dr4',
    name: 'Abuja Nightfall Martini',
    description: 'Espresso martini with a hint of local coffee beans and spiced rum.',
    price: 8000,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1544145945-f904253d0c71?auto=format&fit=crop&q=80&w=800'
  }
];
