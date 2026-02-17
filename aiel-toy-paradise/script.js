/* ===========================================
   AIEL TOY PARADISE — Script
   =========================================== */

// ─── Product Data (50+ unique images) ───
const PRODUCTS = [
    // ── ACTION FIGURES ──
    { id: 1, name: "Marvel Avengers Iron Man Action Figure 12-inch", category: "Action Figures", subcategory: "Superheroes", price: 1299, mrp: 1999, rating: 4.4, reviews: 2847, img: "https://images.unsplash.com/photo-1608278047522-58806a6fd2c4?w=400&h=400&fit=crop&auto=format", badge: "Best Seller" },
    { id: 2, name: "T-Rex Dinosaur Toy with Sound Effects & LED Eyes", category: "Action Figures", subcategory: "Dinosaurs", price: 899, mrp: 1499, rating: 4.2, reviews: 1563, img: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop&auto=format", badge: "Deal" },
    { id: 3, name: "Construction Truck Set - 6 Pack Die Cast Vehicles", category: "Action Figures", subcategory: "Vehicles", price: 749, mrp: 1199, rating: 4.5, reviews: 3201, img: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400&h=400&fit=crop&auto=format", badge: "" },
    { id: 4, name: "Spider-Man Web Slinging Action Figure 6-inch", category: "Action Figures", subcategory: "Superheroes", price: 599, mrp: 899, rating: 4.6, reviews: 4102, img: "https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=400&h=400&fit=crop&auto=format", badge: "" },
    { id: 5, name: "Transforming Robot Car 2-in-1 Toy", category: "Action Figures", subcategory: "Vehicles", price: 1599, mrp: 2499, rating: 4.3, reviews: 987, img: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop&auto=format", badge: "New" },
    { id: 6, name: "Jurassic Velociraptor Realistic Dinosaur Set", category: "Action Figures", subcategory: "Dinosaurs", price: 1099, mrp: 1599, rating: 4.1, reviews: 765, img: "https://images.unsplash.com/photo-1619532550766-12c525d012c9?w=400&h=400&fit=crop&auto=format", badge: "" },
    { id: 7, name: "Military Army Soldier Playset 50 Pieces", category: "Action Figures", subcategory: "Superheroes", price: 499, mrp: 799, rating: 4.0, reviews: 1230, img: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop&auto=format", badge: "Deal" },

    // ── DOLLS ──
    { id: 8, name: "Fashion Princess Doll with Accessories Set", category: "Dolls", subcategory: "Fashion", price: 1499, mrp: 2199, rating: 4.7, reviews: 5430, img: "https://images.unsplash.com/photo-1613682988402-a12530de8854?w=400&h=400&fit=crop&auto=format", badge: "Best Seller" },
    { id: 9, name: "Baby Alive Interactive Crying Doll", category: "Dolls", subcategory: "Baby", price: 1899, mrp: 2999, rating: 4.5, reviews: 2876, img: "https://images.unsplash.com/photo-1602734572890-da5e3a4ec823?w=400&h=400&fit=crop&auto=format", badge: "" },
    { id: 10, name: "Unicorn Fairy Doll with Wings & Accessories", category: "Dolls", subcategory: "Fashion", price: 999, mrp: 1599, rating: 4.4, reviews: 1890, img: "https://images.unsplash.com/photo-1563396983906-b3795482a59a?w=400&h=400&fit=crop&auto=format", badge: "New" },
    { id: 11, name: "Dollhouse Furniture Miniature Set 50 Pieces", category: "Dolls", subcategory: "Accessories", price: 699, mrp: 1099, rating: 4.3, reviews: 1456, img: "https://images.unsplash.com/photo-1530982011887-3cc11cc85693?w=400&h=400&fit=crop&auto=format", badge: "" },
    { id: 12, name: "Princess Castle Playset Dream House", category: "Dolls", subcategory: "Accessories", price: 2499, mrp: 3999, rating: 4.6, reviews: 3210, img: "https://images.unsplash.com/photo-1618939304347-e91b1f33d2ab?w=400&h=400&fit=crop&auto=format", badge: "Deal" },
    { id: 13, name: "Baby Doll Stroller & Travel Set", category: "Dolls", subcategory: "Baby", price: 1199, mrp: 1799, rating: 4.2, reviews: 908, img: "https://images.unsplash.com/photo-1596068587619-e4b11c7a3c09?w=400&h=400&fit=crop&auto=format", badge: "" },

    // ── EDUCATIONAL TOYS ──
    { id: 14, name: "STEM Robotics Building Kit 250+ Pieces", category: "Educational Toys", subcategory: "STEM", price: 2499, mrp: 3999, rating: 4.8, reviews: 6701, img: "https://images.unsplash.com/photo-1587654780014-23a3583d5b85?w=400&h=400&fit=crop&auto=format", badge: "Best Seller" },
    { id: 15, name: "1000 Piece World Map Jigsaw Puzzle", category: "Educational Toys", subcategory: "Puzzles", price: 599, mrp: 999, rating: 4.3, reviews: 2340, img: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=400&h=400&fit=crop&auto=format", badge: "" },
    { id: 16, name: "Solar System Science Kit for Kids", category: "Educational Toys", subcategory: "STEM", price: 1199, mrp: 1899, rating: 4.6, reviews: 1870, img: "https://images.unsplash.com/photo-1596623800665-2a7b0f776b5f?w=400&h=400&fit=crop&auto=format", badge: "New" },
    { id: 17, name: "ABC Learning Tablet Touch & Learn", category: "Educational Toys", subcategory: "Learning", price: 899, mrp: 1499, rating: 4.2, reviews: 3456, img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop&auto=format", badge: "" },
    { id: 18, name: "Wooden Alphabet Block Tower 36 Pieces", category: "Educational Toys", subcategory: "Learning", price: 449, mrp: 699, rating: 4.5, reviews: 2100, img: "https://images.unsplash.com/photo-1560859251-d563a49c0ac4?w=400&h=400&fit=crop&auto=format", badge: "Deal" },
    { id: 19, name: "Magnetic Building Tiles 100 Piece Set", category: "Educational Toys", subcategory: "STEM", price: 1799, mrp: 2799, rating: 4.7, reviews: 4520, img: "https://images.unsplash.com/photo-1587825140708-dfaf18c4b4fe?w=400&h=400&fit=crop&auto=format", badge: "" },
    { id: 20, name: "Kids Microscope STEM Science Kit", category: "Educational Toys", subcategory: "STEM", price: 1399, mrp: 2199, rating: 4.4, reviews: 1340, img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=400&fit=crop&auto=format", badge: "" },

    // ── OUTDOOR PLAY ──
    { id: 21, name: "Kids Balance Bike 12-inch No Pedal", category: "Outdoor Play", subcategory: "Bikes", price: 3499, mrp: 5499, rating: 4.6, reviews: 4230, img: "https://images.unsplash.com/photo-1472457897821-70d18b93c4b1?w=400&h=400&fit=crop&auto=format", badge: "Best Seller" },
    { id: 22, name: "Football Starter Kit — Ball, Cones & Pump", category: "Outdoor Play", subcategory: "Balls", price: 799, mrp: 1299, rating: 4.3, reviews: 2876, img: "https://images.unsplash.com/photo-1600679472829-3044539ce8ed?w=400&h=400&fit=crop&auto=format", badge: "Deal" },
    { id: 23, name: "Super Soaker Water Gun 2-Pack", category: "Outdoor Play", subcategory: "Water", price: 599, mrp: 999, rating: 4.4, reviews: 3450, img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop&auto=format", badge: "" },
    { id: 24, name: "Trampoline 55-inch with Safety Net", category: "Outdoor Play", subcategory: "Bikes", price: 4999, mrp: 7999, rating: 4.7, reviews: 1890, img: "https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?w=400&h=400&fit=crop&auto=format", badge: "New" },
    { id: 25, name: "Badminton Racket Set for Kids", category: "Outdoor Play", subcategory: "Balls", price: 499, mrp: 799, rating: 4.1, reviews: 1120, img: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=400&fit=crop&auto=format", badge: "" },
    { id: 26, name: "Kids Inflatable Swimming Pool 5ft", category: "Outdoor Play", subcategory: "Water", price: 1299, mrp: 1999, rating: 4.5, reviews: 2340, img: "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=400&h=400&fit=crop&auto=format", badge: "" },

    // ── BOARD GAMES ──
    { id: 27, name: "Monopoly Classic Family Board Game", category: "Board Games", subcategory: "Family", price: 699, mrp: 1099, rating: 4.6, reviews: 8901, img: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&h=400&fit=crop&auto=format", badge: "Best Seller" },
    { id: 28, name: "Chess Set Wooden Deluxe Edition", category: "Board Games", subcategory: "Strategy", price: 999, mrp: 1599, rating: 4.8, reviews: 5670, img: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=400&h=400&fit=crop&auto=format", badge: "" },
    { id: 29, name: "Scrabble Junior Word Building Game", category: "Board Games", subcategory: "Family", price: 549, mrp: 899, rating: 4.4, reviews: 3210, img: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400&h=400&fit=crop&auto=format", badge: "" },
    { id: 30, name: "Risk Strategy World Domination Game", category: "Board Games", subcategory: "Strategy", price: 1299, mrp: 1999, rating: 4.5, reviews: 2340, img: "https://images.unsplash.com/photo-1606503153255-59d8b2e4ee2c?w=400&h=400&fit=crop&auto=format", badge: "Deal" },
    { id: 31, name: "UNO Card Game Family Fun Pack", category: "Board Games", subcategory: "Family", price: 199, mrp: 349, rating: 4.7, reviews: 12000, img: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop&auto=format", badge: "" },
    { id: 32, name: "Pictionary Draw & Guess Party Game", category: "Board Games", subcategory: "Family", price: 449, mrp: 699, rating: 4.3, reviews: 1870, img: "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=400&h=400&fit=crop&auto=format", badge: "" },

    // ── REMOTE CONTROL ──
    { id: 33, name: "RC Racing Car 2.4GHz High Speed Rechargeable", category: "Remote Control", subcategory: "Cars", price: 1799, mrp: 2999, rating: 4.5, reviews: 4560, img: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&h=400&fit=crop&auto=format", badge: "Best Seller" },
    { id: 34, name: "Mini Drone with HD Camera for Kids", category: "Remote Control", subcategory: "Drones", price: 3499, mrp: 5999, rating: 4.3, reviews: 2340, img: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=400&h=400&fit=crop&auto=format", badge: "New" },
    { id: 35, name: "RC Monster Truck Off-Road 4WD", category: "Remote Control", subcategory: "Cars", price: 2199, mrp: 3499, rating: 4.4, reviews: 1890, img: "https://images.unsplash.com/photo-1612979685485-fa070c901cf6?w=400&h=400&fit=crop&auto=format", badge: "" },
    { id: 36, name: "Remote Control Helicopter 3.5 Channel", category: "Remote Control", subcategory: "Drones", price: 1499, mrp: 2499, rating: 4.1, reviews: 1230, img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop&auto=format", badge: "Deal" },
    { id: 37, name: "RC Boat High Speed Electric Racing", category: "Remote Control", subcategory: "Cars", price: 1299, mrp: 1999, rating: 4.2, reviews: 876, img: "https://images.unsplash.com/photo-1622397815792-67ac0ce3a59e?w=400&h=400&fit=crop&auto=format", badge: "" },

    // ── ARTS & CRAFTS ──
    { id: 38, name: "150-Piece Art Set Drawing Kit Deluxe", category: "Arts & Crafts", subcategory: "Drawing", price: 799, mrp: 1299, rating: 4.6, reviews: 5670, img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop&auto=format", badge: "Best Seller" },
    { id: 39, name: "Modeling Clay 24 Colors Air Dry Set", category: "Arts & Crafts", subcategory: "Clay", price: 499, mrp: 799, rating: 4.4, reviews: 3210, img: "https://images.unsplash.com/photo-1611604548018-d56bbd85d681?w=400&h=400&fit=crop&auto=format", badge: "" },
    { id: 40, name: "Kids Easel Double-Sided Whiteboard & Chalkboard", category: "Arts & Crafts", subcategory: "Drawing", price: 1999, mrp: 3499, rating: 4.7, reviews: 2340, img: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=400&fit=crop&auto=format", badge: "New" },
    { id: 41, name: "Origami Paper Kit 200 Sheets with Instructions", category: "Arts & Crafts", subcategory: "Clay", price: 299, mrp: 499, rating: 4.3, reviews: 1560, img: "https://images.unsplash.com/photo-1582845512747-e42001c95638?w=400&h=400&fit=crop&auto=format", badge: "" },
    { id: 42, name: "Face Paint Kit 16 Colors Non-Toxic", category: "Arts & Crafts", subcategory: "Drawing", price: 399, mrp: 699, rating: 4.5, reviews: 2100, img: "https://images.unsplash.com/photo-1560421683-6856ea585c78?w=400&h=400&fit=crop&auto=format", badge: "Deal" },
    { id: 43, name: "Bead Jewelry Making Kit for Girls", category: "Arts & Crafts", subcategory: "Clay", price: 649, mrp: 999, rating: 4.4, reviews: 1890, img: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&h=400&fit=crop&auto=format", badge: "" },

    // ── Extra products for variety ──
    { id: 44, name: "Stuffed Teddy Bear Giant 4ft Plush", category: "Dolls", subcategory: "Baby", price: 1999, mrp: 3299, rating: 4.8, reviews: 7800, img: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=400&h=400&fit=crop&auto=format", badge: "Best Seller" },
    { id: 45, name: "Nerf Elite Blaster Dart Gun", category: "Action Figures", subcategory: "Superheroes", price: 1799, mrp: 2799, rating: 4.5, reviews: 5430, img: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=400&fit=crop&auto=format", badge: "" },
    { id: 46, name: "Magic 8 Ball Fortune Telling Toy", category: "Board Games", subcategory: "Family", price: 399, mrp: 699, rating: 4.1, reviews: 1230, img: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=400&h=400&fit=crop&auto=format", badge: "" },
    { id: 47, name: "Bubble Machine Automatic Gun with Solution", category: "Outdoor Play", subcategory: "Water", price: 349, mrp: 599, rating: 4.3, reviews: 2870, img: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&h=400&fit=crop&auto=format", badge: "" },
    { id: 48, name: "Slime Making Kit DIY 12 Pack", category: "Arts & Crafts", subcategory: "Clay", price: 599, mrp: 999, rating: 4.6, reviews: 4320, img: "https://images.unsplash.com/photo-1575364289437-fb1479d52732?w=400&h=400&fit=crop&auto=format", badge: "New" },
    { id: 49, name: "Talking Globe Interactive Kids Learning", category: "Educational Toys", subcategory: "Learning", price: 2999, mrp: 4999, rating: 4.7, reviews: 3210, img: "https://images.unsplash.com/photo-1526818802475-981fa1111f82?w=400&h=400&fit=crop&auto=format", badge: "" },
    { id: 50, name: "Skateboard for Beginners Kids 7+", category: "Outdoor Play", subcategory: "Bikes", price: 1499, mrp: 2499, rating: 4.2, reviews: 1120, img: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=400&h=400&fit=crop&auto=format", badge: "" },
    { id: 51, name: "RC Stunt Car 360° Flip Double-Sided", category: "Remote Control", subcategory: "Cars", price: 999, mrp: 1599, rating: 4.4, reviews: 2560, img: "https://images.unsplash.com/photo-1596075780750-81249df16d19?w=400&h=400&fit=crop&auto=format", badge: "" },
    { id: 52, name: "Telescope for Kids Astronomy Starter", category: "Educational Toys", subcategory: "STEM", price: 1899, mrp: 2999, rating: 4.5, reviews: 1450, img: "https://images.unsplash.com/photo-1579566346927-c68383817a25?w=400&h=400&fit=crop&auto=format", badge: "" },

    // ── SENSORY TOYS ──
    { id: 53, name: "Pop It Fidget Toy Rainbow Silicone Push Bubble", category: "Sensory Toys", subcategory: "Fidget", price: 199, mrp: 399, rating: 4.5, reviews: 8920, img: "https://images.unsplash.com/photo-1639006901497-3e1da5fb5e5e?w=400&h=400&fit=crop&auto=format", badge: "Best Seller" },
    { id: 54, name: "Sensory Balls Set 6-Pack Textured for Babies", category: "Sensory Toys", subcategory: "Tactile", price: 499, mrp: 799, rating: 4.6, reviews: 3450, img: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop&auto=format", badge: "" },
    { id: 55, name: "Water Beads Sensory Play Kit 50000 Pieces", category: "Sensory Toys", subcategory: "Tactile", price: 349, mrp: 599, rating: 4.3, reviews: 2100, img: "https://images.unsplash.com/photo-1575364289437-fb1479d52732?w=400&h=400&fit=crop&auto=format", badge: "Deal" },
    { id: 56, name: "Kinetic Sand Playset with Molds 2kg", category: "Sensory Toys", subcategory: "Tactile", price: 899, mrp: 1499, rating: 4.7, reviews: 5670, img: "https://images.unsplash.com/photo-1611604548018-d56bbd85d681?w=400&h=400&fit=crop&auto=format", badge: "New" },

    // ── MONTESSORI TOYS ──
    { id: 57, name: "Montessori Wooden Shape Sorter Toy", category: "Montessori Toys", subcategory: "Sorting", price: 699, mrp: 1199, rating: 4.8, reviews: 4320, img: "https://images.unsplash.com/photo-1560859251-d563a49c0ac4?w=400&h=400&fit=crop&auto=format", badge: "Best Seller" },
    { id: 58, name: "Montessori Bead Stacker Rainbow Tower", category: "Montessori Toys", subcategory: "Stacking", price: 549, mrp: 899, rating: 4.6, reviews: 2870, img: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=400&fit=crop&auto=format", badge: "" },
    { id: 59, name: "Montessori Busy Board Activity Cube", category: "Montessori Toys", subcategory: "Activity", price: 1299, mrp: 1999, rating: 4.7, reviews: 3560, img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop&auto=format", badge: "New" },
    { id: 60, name: "Montessori Counting Bears Sorting Cups Set", category: "Montessori Toys", subcategory: "Sorting", price: 449, mrp: 799, rating: 4.5, reviews: 1890, img: "https://images.unsplash.com/photo-1587825140708-dfaf18c4b4fe?w=400&h=400&fit=crop&auto=format", badge: "Deal" },

    // ── MUSICAL TOYS ──
    { id: 61, name: "Kids Electronic Piano Keyboard 37 Keys", category: "Musical Toys", subcategory: "Keyboards", price: 1499, mrp: 2499, rating: 4.5, reviews: 3210, img: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop&auto=format", badge: "Best Seller" },
    { id: 62, name: "Baby Xylophone Musical Instrument Set", category: "Musical Toys", subcategory: "Percussion", price: 399, mrp: 699, rating: 4.4, reviews: 4560, img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop&auto=format", badge: "" },
    { id: 63, name: "Kids Ukulele Guitar Wooden 23-inch", category: "Musical Toys", subcategory: "Strings", price: 899, mrp: 1499, rating: 4.6, reviews: 2340, img: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=400&fit=crop&auto=format", badge: "New" },
    { id: 64, name: "Drum Set for Kids with Stool 5-Piece", category: "Musical Toys", subcategory: "Percussion", price: 2499, mrp: 3999, rating: 4.3, reviews: 1120, img: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&h=400&fit=crop&auto=format", badge: "Deal" },

    // ── WOODEN TOYS ──
    { id: 65, name: "Wooden Train Set with Tracks 80 Pieces", category: "Wooden Toys", subcategory: "Vehicles", price: 1799, mrp: 2999, rating: 4.7, reviews: 5430, img: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop&auto=format", badge: "Best Seller" },
    { id: 66, name: "Wooden Stacking Rings Rainbow Tower", category: "Wooden Toys", subcategory: "Stacking", price: 349, mrp: 599, rating: 4.8, reviews: 6780, img: "https://images.unsplash.com/photo-1560859251-d563a49c0ac4?w=400&h=400&fit=crop&auto=format", badge: "" },
    { id: 67, name: "Wooden Puzzle Set Animals 6-Pack", category: "Wooden Toys", subcategory: "Puzzles", price: 599, mrp: 999, rating: 4.5, reviews: 3450, img: "https://images.unsplash.com/photo-1587825140708-dfaf18c4b4fe?w=400&h=400&fit=crop&auto=format", badge: "New" },
    { id: 68, name: "Wooden Kitchen Playset Pretend Cooking", category: "Wooden Toys", subcategory: "Pretend", price: 2199, mrp: 3499, rating: 4.6, reviews: 2100, img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop&auto=format", badge: "Deal" },
];

// ─── Category images ───
const CATEGORY_IMAGES = {
    "Action Figures": "https://images.unsplash.com/photo-1608278047522-58806a6fd2c4?w=340&h=300&fit=crop&auto=format",
    "Dolls": "https://images.unsplash.com/photo-1613682988402-a12530de8854?w=340&h=300&fit=crop&auto=format",
    "Educational Toys": "https://images.unsplash.com/photo-1587654780014-23a3583d5b85?w=340&h=300&fit=crop&auto=format",
    "Outdoor Play": "https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?w=340&h=300&fit=crop&auto=format",
    "Board Games": "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=340&h=300&fit=crop&auto=format",
    "Remote Control": "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=340&h=300&fit=crop&auto=format",
    "Arts & Crafts": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=340&h=300&fit=crop&auto=format",
    "Sensory Toys": "https://images.unsplash.com/photo-1639006901497-3e1da5fb5e5e?w=340&h=300&fit=crop&auto=format",
    "Montessori Toys": "https://images.unsplash.com/photo-1560859251-d563a49c0ac4?w=340&h=300&fit=crop&auto=format",
    "Musical Toys": "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=340&h=300&fit=crop&auto=format",
    "Wooden Toys": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=340&h=300&fit=crop&auto=format",
};

const CATEGORIES = Object.keys(CATEGORY_IMAGES);

// ─── Subcategory Data (for sub-nav bar) ───
const SUBCATEGORIES = [
    { name: "Sensory Toys", icon: "🧠", img: "https://images.unsplash.com/photo-1639006901497-3e1da5fb5e5e?w=400&h=280&fit=crop&auto=format", desc: "Fidget toys, textured balls, kinetic sand & more" },
    { name: "Montessori Toys", icon: "🧩", img: "https://images.unsplash.com/photo-1560859251-d563a49c0ac4?w=400&h=280&fit=crop&auto=format", desc: "Shape sorters, busy boards & learning activities" },
    { name: "Educational Toys", icon: "📚", img: "https://images.unsplash.com/photo-1587654780014-23a3583d5b85?w=400&h=280&fit=crop&auto=format", desc: "Puzzles, learning tablets & alphabet toys" },
    { name: "STEM Toys", icon: "🔬", img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=280&fit=crop&auto=format", desc: "Robotics kits, science experiments & coding" },
    { name: "Action Figures", icon: "🦸", img: "https://images.unsplash.com/photo-1608278047522-58806a6fd2c4?w=400&h=280&fit=crop&auto=format", desc: "Superheroes, dinosaurs & vehicle playsets" },
    { name: "Musical Toys", icon: "🎵", img: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=280&fit=crop&auto=format", desc: "Keyboards, drums, ukuleles & xylophones" },
    { name: "Board/Card Games", icon: "🎲", img: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&h=280&fit=crop&auto=format", desc: "Monopoly, UNO, chess & family party games" },
    { name: "Wooden Toys", icon: "🪵", img: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=280&fit=crop&auto=format", desc: "Train sets, stacking rings & wooden puzzles" },
];

// ─── Hero slides ───
const HERO_SLIDES = [
    { img: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1600&h=500&fit=crop&auto=format", title: "Top Toy Deals — Up to 50% Off", subtitle: "Explore thousands of toys for every age. Free delivery on orders above ₹499!", cta: "Shop Now" },
    { img: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=1600&h=500&fit=crop&auto=format", title: "New STEM Toys Collection", subtitle: "Inspire young minds with our curated STEM kits, science experiments & robotics.", cta: "Explore STEM" },
    { img: "https://images.unsplash.com/photo-1563396983906-b3795482a59a?w=1600&h=500&fit=crop&auto=format", title: "Outdoor Fun Starts Here", subtitle: "Bikes, trampolines, water guns & more. Get the kids outside!", cta: "Shop Outdoor" },
    { img: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=1600&h=500&fit=crop&auto=format", title: "Cuddly Friends & Dolls", subtitle: "Stuffed animals, fashion dolls and playsets your kids will love.", cta: "Shop Dolls" },
];

// ─── Offer banners ───
const OFFER_BANNERS = [
    { img: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&h=400&fit=crop&auto=format", title: "Action Figures Sale", text: "Up to 40% off on superheroes & dinosaurs" },
    { img: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=600&h=400&fit=crop&auto=format", title: "Board Game Night", text: "Family fun starting at ₹199" },
    { img: "https://images.unsplash.com/photo-1587654780014-23a3583d5b85?w=600&h=400&fit=crop&auto=format", title: "STEM Learning Week", text: "Robotics & science kits from ₹599" },
    { img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=400&fit=crop&auto=format", title: "Arts & Crafts Festival", text: "Drawing sets, clay, and more from ₹299" },
];

// ─── Utility functions ───
function formatPrice(p) {
    return p.toLocaleString('en-IN');
}
function getDiscount(price, mrp) {
    return Math.round(((mrp - price) / mrp) * 100);
}
function starsHTML(rating) {
    let s = '';
    for (let i = 1; i <= 5; i++) {
        s += i <= Math.floor(rating) ? '★' : (i - 0.5 <= rating ? '★' : '☆');
    }
    return s;
}

// ─── Cart counter ───
let cartCount = 0;
function addToCart(e) {
    e.stopPropagation();
    cartCount++;
    const el = document.getElementById('cart-count');
    el.textContent = cartCount;
    el.classList.remove('cart-bump');
    void el.offsetWidth;
    el.classList.add('cart-bump');
}

// ─── Render a product card ───
function productCardHTML(p) {
    const discount = getDiscount(p.price, p.mrp);
    return `
    <div class="product-card" data-category="${p.category}">
      <div class="product-card-img">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <img src="${p.img}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-card-body">
        <div class="product-card-title">${p.name}</div>
        <div class="product-rating">
          <span class="stars">${starsHTML(p.rating)}</span>
          <span class="rating-count">${p.reviews.toLocaleString()}</span>
        </div>
        <div class="product-price"><span class="symbol">₹</span>${formatPrice(p.price)}</div>
        <div class="product-mrp">M.R.P.: <s>₹${formatPrice(p.mrp)}</s> <span class="discount">(${discount}% off)</span></div>
        <div class="product-delivery">FREE Delivery by <strong>${getDeliveryDate()}</strong></div>
        <div class="product-card-footer">
          <button class="add-to-cart" onclick="addToCart(event)">🛒 Add to Cart</button>
        </div>
      </div>
    </div>`;
}

function getDeliveryDate() {
    const d = new Date();
    d.setDate(d.getDate() + 3 + Math.floor(Math.random() * 3));
    return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
}

// ─── Hero Carousel ───
let heroIndex = 0;
let heroTimer;

function initHeroCarousel() {
    const track = document.getElementById('hero-track');
    const dots = document.getElementById('hero-dots');
    if (!track || !dots) return;

    track.innerHTML = HERO_SLIDES.map(s => `
    <div class="hero-slide">
      <img src="${s.img}" alt="${s.title}">
      <div class="hero-overlay">
        <h1>${s.title}</h1>
        <p>${s.subtitle}</p>
        <button class="btn-primary">${s.cta}</button>
      </div>
    </div>`).join('');

    dots.innerHTML = HERO_SLIDES.map((_, i) =>
        `<button class="hero-dot${i === 0 ? ' active' : ''}" data-index="${i}"></button>`
    ).join('');

    dots.addEventListener('click', e => {
        if (e.target.classList.contains('hero-dot')) {
            heroIndex = parseInt(e.target.dataset.index);
            moveHero();
        }
    });

    startHeroAuto();
}

function moveHero() {
    const track = document.getElementById('hero-track');
    track.style.transform = `translateX(-${heroIndex * 100}%)`;
    document.querySelectorAll('.hero-dot').forEach((d, i) => d.classList.toggle('active', i === heroIndex));
}

function heroNext() {
    heroIndex = (heroIndex + 1) % HERO_SLIDES.length;
    moveHero();
    resetHeroAuto();
}
function heroPrev() {
    heroIndex = (heroIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
    moveHero();
    resetHeroAuto();
}
function startHeroAuto() { heroTimer = setInterval(heroNext, 5000); }
function resetHeroAuto() { clearInterval(heroTimer); startHeroAuto(); }

// ─── Deal Carousel ───
function initDealCarousel() {
    const deals = PRODUCTS.filter(p => p.badge === 'Deal' || getDiscount(p.price, p.mrp) >= 30).slice(0, 12);
    const track = document.getElementById('deal-carousel-track');
    if (!track) return;
    track.innerHTML = deals.map(p => `
    <div class="deal-card">
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <div class="deal-card-body">
        <p>${p.name.substring(0, 35)}...</p>
        <div class="deal-price">₹${formatPrice(p.price)}</div>
        <div class="deal-discount">${getDiscount(p.price, p.mrp)}% off</div>
      </div>
    </div>`).join('');
}

let dealOffset = 0;
function dealNext() {
    const track = document.getElementById('deal-carousel-track');
    const maxScroll = track.scrollWidth - track.parentElement.clientWidth;
    dealOffset = Math.min(dealOffset + 200, maxScroll);
    track.style.transform = `translateX(-${dealOffset}px)`;
}
function dealPrev() {
    const track = document.getElementById('deal-carousel-track');
    dealOffset = Math.max(dealOffset - 200, 0);
    track.style.transform = `translateX(-${dealOffset}px)`;
}

// ─── Best Sellers ───
function initBestSellers() {
    const best = PRODUCTS.filter(p => p.badge === 'Best Seller').slice(0, 8);
    const grid = document.getElementById('best-sellers-grid');
    if (!grid) return;
    grid.innerHTML = best.map(productCardHTML).join('');
}

// ─── Category Cards ───
function initCategories() {
    const grid = document.getElementById('category-grid');
    if (!grid) return;
    grid.innerHTML = CATEGORIES.map(c => `
    <div class="category-card" data-cat="${c}" onclick="filterByCategory('${c}')">
      <img src="${CATEGORY_IMAGES[c]}" alt="${c}" loading="lazy">
      <h3>${c}</h3>
    </div>`).join('');
}

// ─── All Products with Filter ───
let activeFilter = 'All';
let activeSubFilter = null; // tracks subcategory filter

function initAllProducts() {
    renderFilteredProducts();
    initFilterPills();
}

function initFilterPills() {
    const bar = document.getElementById('filter-bar');
    if (!bar) return;
    bar.innerHTML = ['All', ...CATEGORIES].map(c =>
        `<button class="filter-pill${c === 'All' ? ' active' : ''}" onclick="filterByCategory('${c}')">${c}</button>`
    ).join('');
}

function filterByCategory(cat) {
    activeFilter = cat;
    activeSubFilter = null;
    // Update pills
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.toggle('active', p.textContent === cat));
    // Update category cards
    document.querySelectorAll('.category-card').forEach(c => c.classList.toggle('active', c.dataset.cat === cat));
    // Update sub-nav active
    document.querySelectorAll('.sub-nav-item').forEach(s => s.classList.remove('active'));
    renderFilteredProducts();
    // Scroll to products
    document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── Subcategory Filter ───
function filterBySubcategory(subName) {
    activeSubFilter = subName;
    // Map subcategory names to matching category/subcategory in products
    const subcatMap = {
        'Sensory Toys': { type: 'category', value: 'Sensory Toys' },
        'Montessori Toys': { type: 'category', value: 'Montessori Toys' },
        'Educational Toys': { type: 'category', value: 'Educational Toys' },
        'STEM Toys': { type: 'subcategory', value: 'STEM' },
        'Action Figures': { type: 'category', value: 'Action Figures' },
        'Musical Toys': { type: 'category', value: 'Musical Toys' },
        'Board/Card Games': { type: 'category', value: 'Board Games' },
        'Wooden Toys': { type: 'category', value: 'Wooden Toys' },
    };
    const mapping = subcatMap[subName];
    if (!mapping) return;

    const grid = document.getElementById('all-products-grid');
    if (!grid) return;

    let filtered;
    if (mapping.type === 'category') {
        filtered = PRODUCTS.filter(p => p.category === mapping.value);
    } else {
        filtered = PRODUCTS.filter(p => p.subcategory === mapping.value);
    }

    // Update active filter display
    activeFilter = subName;
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.sub-nav-item').forEach(s => {
        s.classList.toggle('active', s.dataset.sub === subName);
    });

    // Update section heading
    const heading = document.querySelector('#all-products .section-header h2');
    if (heading) heading.innerHTML = `🧸 ${subName}`;

    grid.innerHTML = filtered.length
        ? filtered.map(productCardHTML).join('')
        : '<p style="padding:40px;text-align:center;color:#888;">No products found in this category yet. Check back soon!</p>';

    // Animate in
    grid.querySelectorAll('.product-card').forEach((c, i) => {
        c.style.opacity = '0';
        c.style.transform = 'translateY(20px)';
        setTimeout(() => {
            c.style.transition = 'opacity .4s ease, transform .4s ease';
            c.style.opacity = '1';
            c.style.transform = 'translateY(0)';
        }, i * 40);
    });

    // Scroll to products
    document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderFilteredProducts() {
    const grid = document.getElementById('all-products-grid');
    if (!grid) return;

    // Reset heading
    const heading = document.querySelector('#all-products .section-header h2');
    if (heading) heading.innerHTML = '🧸 All Toys';

    const filtered = activeFilter === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeFilter);
    grid.innerHTML = filtered.map(productCardHTML).join('');
    // Animate in
    grid.querySelectorAll('.product-card').forEach((c, i) => {
        c.style.opacity = '0';
        c.style.transform = 'translateY(20px)';
        setTimeout(() => {
            c.style.transition = 'opacity .4s ease, transform .4s ease';
            c.style.opacity = '1';
            c.style.transform = 'translateY(0)';
        }, i * 40);
    });
}

// ─── New Arrivals ───
function initNewArrivals() {
    const items = PRODUCTS.filter(p => p.badge === 'New').slice(0, 6);
    const grid = document.getElementById('new-arrivals-grid');
    if (!grid) return;
    grid.innerHTML = items.map(productCardHTML).join('');
}

// ─── Offer Banners ───
function initOfferBanners() {
    const grid = document.getElementById('offer-grid');
    if (!grid) return;
    grid.innerHTML = OFFER_BANNERS.map(b => `
    <div class="offer-banner">
      <img src="${b.img}" alt="${b.title}" loading="lazy">
      <div class="offer-banner-overlay">
        <h3>${b.title}</h3>
        <p>${b.text}</p>
        <button class="btn-deal">Shop Now</button>
      </div>
    </div>`).join('');
}

// ─── Four-Box Grid (Amazon-style) ───
function initFourBoxes() {
    const container = document.getElementById('four-box-container');
    if (!container) return;

    const boxes = [
        { title: "Up to 60% off | Toys & games", items: PRODUCTS.filter(p => p.category === 'Action Figures').slice(0, 4) },
        { title: "Starting ₹299 | Arts & Creativity", items: PRODUCTS.filter(p => p.category === 'Arts & Crafts').slice(0, 4) },
        { title: "Best Sellers in Board Games", items: PRODUCTS.filter(p => p.category === 'Board Games').slice(0, 4) },
        { title: "Learning toys for curious minds", items: PRODUCTS.filter(p => p.category === 'Educational Toys').slice(0, 4) },
    ];

    container.innerHTML = boxes.map(box => `
    <div class="four-box">
      <h2>${box.title}</h2>
      <div class="four-box-images">
        ${box.items.map(p => `
          <div class="box-item">
            <img src="${p.img}" alt="${p.name}" loading="lazy">
            <span>${p.subcategory}</span>
          </div>`).join('')}
      </div>
      <a href="#all-products">See all deals</a>
    </div>`).join('');
}

// ─── Mobile Menu ───
function openMobileMenu() {
    document.getElementById('mobile-overlay').classList.add('open');
    document.getElementById('mobile-panel').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
    document.getElementById('mobile-overlay').classList.remove('open');
    document.getElementById('mobile-panel').classList.remove('open');
    document.body.style.overflow = '';
}

// ─── Search ───
function initSearch() {
    const input = document.getElementById('search-input');
    if (!input) return;
    input.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        if (q.length < 2) { renderFilteredProducts(); return; }
        const grid = document.getElementById('all-products-grid');
        const results = PRODUCTS.filter(p =>
            p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.subcategory.toLowerCase().includes(q)
        );
        grid.innerHTML = results.length ? results.map(productCardHTML).join('') : '<p style="padding:40px;text-align:center;color:#888;">No products found. Try a different search.</p>';
        document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' });
    });
}

// ─── Back to Top ───
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// ─── Init Sub-Nav ───
function initSubNav() {
    const container = document.getElementById('sub-nav-items');
    if (!container) return;
    container.innerHTML = SUBCATEGORIES.map(s => `
    <li class="sub-nav-item" data-sub="${s.name}">
      <a href="#all-products" onclick="event.preventDefault(); filterBySubcategory('${s.name}')">
        <span class="sub-nav-icon">${s.icon}</span>
        <span class="sub-nav-label">${s.name}</span>
      </a>
      <div class="sub-nav-dropdown">
        <div class="sub-nav-card">
          <img src="${s.img}" alt="${s.name}" loading="lazy">
          <div class="sub-nav-card-body">
            <h4>${s.name}</h4>
            <p>${s.desc}</p>
            <button class="btn-sub-shop" onclick="filterBySubcategory('${s.name}')">Shop Now →</button>
          </div>
        </div>
      </div>
    </li>`).join('');
}

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
    initHeroCarousel();
    initDealCarousel();
    initBestSellers();
    initCategories();
    initFourBoxes();
    initNewArrivals();
    initOfferBanners();
    initAllProducts();
    initSearch();
    initSubNav();
});
