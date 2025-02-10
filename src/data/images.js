export const images = {
  cabinets: {
    'columbia-antique-white': {
      src: new URL('../assets/cabinet_images/Columbia_Antique_White.webp', import.meta.url).href,
      title: 'Columbia Antique White',
      value: 'columbia-antique-white'
    },
    'edgewater-white': {
      src: new URL('../assets/cabinet_images/Edgewater-White.webp', import.meta.url).href,
      title: 'Edgewater White',
      value: 'edgewater-white'
    },
    'odyssey-sage': {
      src: new URL('../assets/cabinet_images/odyssey-sage.webp', import.meta.url).href,
      title: 'Odyssey Sage',
      value: 'odyssey-sage'
    },
    'oxford-mist': {
      src: new URL('../assets/cabinet_images/oxford-mist_1.webp', import.meta.url).href,
      title: 'Oxford Mist',
      value: 'oxford-mist'
    },
    'oxford-toffee': {
      src: new URL('../assets/cabinet_images/oxford-toffee-door.webp', import.meta.url).href,
      title: 'Oxford Toffee',
      value: 'oxford-toffee'
    },
    'sc-prime': {
      src: new URL('../assets/cabinet_images/SC-prime.png', import.meta.url).href,
      title: 'SC Prime',
      value: 'sc-prime'
    },
    'shaker-antique-white': {
      src: new URL('../assets/cabinet_images/Shaker_Antique_White.webp', import.meta.url).href,
      title: 'Shaker Antique White',
      value: 'shaker-antique-white'
    },
    'shaker-dove': {
      src: new URL('../assets/cabinet_images/Shaker_Dove_1.webp', import.meta.url).href,
      title: 'Shaker Dove',
      value: 'shaker-dove'
    },
    'shaker-grey': {
      src: new URL('../assets/cabinet_images/Shaker_Grey.webp', import.meta.url).href,
      title: 'Shaker Grey',
      value: 'shaker-grey'
    },
    'shaker-black': {
      src: new URL('../assets/cabinet_images/Shaker-Black.webp', import.meta.url).href,
      title: 'Shaker Black',
      value: 'shaker-black'
    }
  },
  countertops: {
    'granite-style-1': {
      src: new URL('../assets/countertop_images/Granite.png', import.meta.url).href,
      title: 'Granite Style 1',
      value: 'granite-style-1'
    },
    'granite-style-2': {
      src: new URL('../assets/countertop_images/Granite 2.png', import.meta.url).href,
      title: 'Granite Style 2',
      value: 'granite-style-2'
    },
    'granite-style-3': {
      src: new URL('../assets/countertop_images/Granite 3.png', import.meta.url).href,
      title: 'Granite Style 3',
      value: 'granite-style-3'
    },
    'granite-style-4': {
      src: new URL('../assets/countertop_images/Granite 4.png', import.meta.url).href,
      title: 'Granite Style 4',
      value: 'granite-style-4'
    },
    'quartz-style-1': {
      src: new URL('../assets/countertop_images/Quartz.png', import.meta.url).href,
      title: 'Quartz Style 1',
      value: 'quartz-style-1'
    },
    'quartz-style-2': {
      src: new URL('../assets/countertop_images/Quartz 2.png', import.meta.url).href,
      title: 'Quartz Style 2',
      value: 'quartz-style-2'
    },
    'quartz-soapstone': {
      src: new URL('../assets/countertop_images/Quartz Soapstone.png', import.meta.url).href,
      title: 'Quartz Soapstone',
      value: 'quartz-soapstone'
    },
    'quartz-waterfall': {
      src: new URL('../assets/countertop_images/Quartz Waterfall.png', import.meta.url).href,
      title: 'Quartz Waterfall',
      value: 'quartz-waterfall'
    },
    'butcher-birch': {
      src: new URL('../assets/countertop_images/Butcher_Birch.png', import.meta.url).href,
      title: 'Birch Butcher Block',
      value: 'butcher-birch'
    },
    'butcher-maple': {
      src: new URL('../assets/countertop_images/Butcher_Maple.png', import.meta.url).href,
      title: 'Maple Butcher Block',
      value: 'butcher-maple'
    },
    'butcher-oak': {
      src: new URL('../assets/countertop_images/Butcher_Oak.png', import.meta.url).href,
      title: 'Oak Butcher Block',
      value: 'butcher-oak'
    },
    'butcher-walnut': {
      src: new URL('../assets/countertop_images/Butcher_Walnut.png', import.meta.url).href,
      title: 'Walnut Butcher Block',
      value: 'butcher-walnut'
    }
  }
};

export const getCabinetImages = () => {
  return Object.values(images.cabinets);
};

export const getCountertopImages = (type) => {
  const allCountertops = Object.values(images.countertops);
  
  switch (type) {
    case 'Granite':
      return allCountertops.filter(img => img.value.startsWith('granite'));
    case 'Quartz':
      return allCountertops.filter(img => img.value.startsWith('quartz'));
    case 'Butcher Block':
      return allCountertops.filter(img => img.value.startsWith('butcher'));
    default:
      return allCountertops;
  }
};