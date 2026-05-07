const ALL_PROVIDERS = {
  grocery: [
    { id:"g1", name:"Al-Baraka Market", rating:4.9, reviews:210, distance:"5 min walk", badge:"Open", icon:"🛒", bg:"#D8F3DC", fg:"#2D6A4F",
      about:"Al-Baraka has served the neighbourhood for 12 years. Fresh produce daily, competitive prices, and free delivery over SAR 100.",
      stats:[["12 yrs","Running"],["4.9★","Rating"],["210","Reviews"],["Free","Delivery >100"]],
      services:[
        { icon:"🛍️", name:"Standard Delivery", desc:"Up to 20 items", price:15, dur:"30–45 min" },
        { icon:"📦", name:"Bulk Order", desc:"Weekly or monthly bulk orders for your household needs.", price:"Custom", dur:"Same day" },
        { icon:"🍎", name:"Fresh Produce Box", desc:"Seasonal fruits and vegetables delivered to your door.", price:45, dur:"Next day" },
      ]
    },
    { id:"g2", name:"Fresh Picks", rating:4.7, reviews:180, distance:"1.2 km", badge:"Open", icon:"🥕", bg:"#DBEAFE", fg:"#1E40AF",
      about:"Organic and locally sourced produce. We support local farms and sustainable practices.",
      stats:[["5 yrs","Running"],["4.7★","Rating"],["180","Reviews"],["Local","Organic"]],
      services:[
        { icon:"🥬", name:"Organic Veggie Box", desc:"Weekly subscription for organic vegetables.", price:70, dur:"Weekly" },
        { icon:"🥛", name:"Dairy & Eggs", desc:"Fresh dairy products from local farms.", price:"Varies", dur:"Next day" },
      ]
    },
  ],
  laundry: [
    { id:"l1", name:"Sparkle Clean Laundry", rating:4.8, reviews:95, distance:"800 m", badge:"Open", icon:"👕", bg:"#FFF3E0", fg:"#92400E",
      about:"Professional laundry and dry cleaning services. Eco-friendly products and express options available.",
      stats:[["7 yrs","Running"],["4.8★","Rating"],["95","Reviews"],["Eco","Friendly"]],
      services:[
        { icon:"👔", name:"Wash & Fold", desc:"Per kg, includes washing, drying, and folding.", price:10, dur:"24 hours" },
        { icon:"👗", name:"Dry Cleaning", desc:"Per item, for delicate garments.", price:25, dur:"48 hours" },
        { icon:"🧺", name:"Express Service", desc:"Same-day wash and fold.", price:15, dur:"Same day" },
      ]
    },
  ],
  maintenance: [
    { id:"m1", name:"FixIt Home Services", rating:4.5, reviews:150, distance:"2.5 km", badge:"Open", icon:"🛠️", bg:"#FCE7F3", fg:"#9D174D",
      about:"Reliable home maintenance services including plumbing, electrical, and AC repair.",
      stats:[["10 yrs","Running"],["4.5★","Rating"],["150","Reviews"],["24/7","Emergency"]],
      services:[
        { icon:"💧", name:"Plumbing Repair", desc:"Fix leaks, clogs, and installations.", price:"Starts at 100", dur:"1-2 hours" },
        { icon:"💡", name:"Electrical Services", desc:"Wiring, fixture installation, and repairs.", price:"Starts at 120", dur:"1-3 hours" },
        { icon:"❄️", name:"AC Maintenance", desc:"Cleaning, gas refill, and repair.", price:"Starts at 180", dur:"2-4 hours" },
      ]
    },
  ],
  food: [
    { id:"f1", name:"The Gourmet Kitchen", rating:4.9, reviews:300, distance:"1.5 km", badge:"Open", icon:"🍽️", bg:"#EDE9FE", fg:"#5B21B6",
      about:"Fine dining experience delivered to your home. International cuisine with a local touch.",
      stats:[["8 yrs","Running"],["4.9★","Rating"],["300","Reviews"],["Award","Winning"]],
      services:[
        { icon:"🍝", name:"Italian Pasta", desc:"Freshly made pasta with your choice of sauce.", price:60, dur:"30-45 min" },
        { icon:"🍣", name:"Sushi Platter", desc:"Assorted sushi and sashimi.", price:120, dur:"45-60 min" },
      ]
    },
  ],
  health: [
    { id:"h1", name:"Wellness Pharmacy", rating:4.7, reviews:70, distance:"500 m", badge:"Open", icon:"💊", bg:"#D8F3DC", fg:"#2D6A4F",
      about:"Your trusted neighborhood pharmacy. Prescription delivery and over-the-counter medicines.",
      stats:[["15 yrs","Running"],["4.7★","Rating"],["70","Reviews"],["Free","Delivery"]],
      services:[
        { icon:"💉", name:"Prescription Delivery", desc:"Delivery of prescribed medications.", price:"Free", dur:"1-2 hours" },
        { icon:"🩹", name:"First Aid Supplies", desc:"Essential first aid kits and supplies.", price:"Varies", dur:"Same day" },
      ]
    },
  ],
  education: [
    { id:"e1", name:"Bright Minds Tutors", rating:4.9, reviews:45, distance:"3 km", badge:"Open", icon:"📚", bg:"#DBEAFE", fg:"#1E40AF",
      about:"Personalized tutoring for all ages and subjects. Experienced and certified tutors.",
      stats:[["3 yrs","Running"],["4.9★","Rating"],["45","Reviews"],["Certified","Tutors"]],
      services:[
        { icon:"📝", name:"Math Tutoring", desc:"One-on-one sessions for all levels.", price:150, dur:"1 hour" },
        { icon:"🔬", name:"Science Tutoring", desc:"Physics, Chemistry, Biology.", price:150, dur:"1 hour" },
      ]
    },
  ],
};

export default ALL_PROVIDERS;
