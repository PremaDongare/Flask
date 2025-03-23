import React, { useState } from 'react';
import { motion } from "framer-motion";


const WasteRecyclingFeature = () => {
  // State to track selected waste type
  const [selectedWasteType, setSelectedWasteType] = useState('');
  
  // Sample data for waste types and their recycling options
  const wasteOptions = [
    {
      type: 'husks',
      label: 'Husks',
      items: [
        {
          name: 'Eco-friendly Packaging',
          // Note: This approach may not work due to CORS restrictions
          image: 'https://www.futurematerialsbank.com/wp-content/uploads/MG_9781-500x333.jpg', // Replace with your own hosted image
          process: <p>
          1. Clean and dry husks thoroughly. <br />
          2. Cut to desired size. <br />
          3. Mold into packaging shapes using natural rice glue. <br />
          4. Allow to dry completely.
        </p>
        
        },
        {
          name: 'Fiber Board',
          image: 'https://media.licdn.com/dms/image/v2/C4D12AQHKWRu9ssXWfQ/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1520217192508?e=2147483647&v=beta&t=HZ9eqeudQpQjlhj2qWzMeIcqT5cLg6dMs6W9ygakEVk',
          process: <p>
          1. Grind husks into fine particles. <br />
          2. Mix with natural resin. <br />
          3. Press in molds under heat. <br />
          4. Cool and cure for 48 hours for sturdy, eco-friendly boards.
        </p>
        
        },
        {
          name: 'Soil Amendment',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsx-Fc_L_XPldmDJrcACnyt93z89oaekwLvg&s',
          process: <p>
            1. Compost husks by mixing with green materials in 3:1 ratio.<br />
            2. Keep moist and turn pile every 2 weeks.<br />
            3.  Ready in 2-3 months.'</p>
        }
      ]
    },
    {
      type: 'straw',
      label: 'Straw',
      items: [
        {
          name: 'Mulch',
          image: 'https://rukminim2.flixcart.com/image/850/1000/knj7wcw0/garden-mulch/s/e/e/0-5-paddy-straw-500gr-for-mushroom-farming-and-gardening-natural-original-imag26uwcmkxhfsd.jpeg?q=90&crop=false',
          process: <p>
          1. Spread straw around plants in 2-3 inch layer.<br/>
          2. Ensure it doesn\'t touch plant stems.<br/>
          3. Replace as needed to maintain coverage and moisture retention.</p>
        },
        {
          name: 'Straw Bale Building Blocks',
          image: 'data:image/jpeg;base64,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',
          process: <p>
            1. Compress straw into tight bales. <br/>
            2. Treat with borax solution for fire resistance. <br/>
            3. Use as building blocks with clay or lime plaster coating.'</p>
        },
        {
          name: ' Disposable Plates & Bowls ',
          image: 'data:image/jpeg;base64,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',
          process: <p> 1. Prepare the Straw Pulp<br/>
          2. Add Natural Adhesive<br/>
          3. Mold the Shape<br/>
          4. Press & Dry<br/>

          </p>
        },
      ]
    },
    
    {
      type: 'leaves',
      label: 'Leaves',
      items: [
        {
          name: 'Leaf Mold',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFHsYEE1EggQCh-AV0ZiFofaZxCDajDTeFXg&s',
          process: <p>
            1. Collect fallen leaves.<br/>
            2. Shred if possible. <br/>
            3. Pile in contained area.<br/>
            4. Keep moist. <br/>
            5. Ready in 6-12 months as rich soil amendment.</p>
        },
        {
          name: 'Natural Dyes',
          image: 'https://www.sarahburnspatterns.com/wp-content/uploads/2020/05/colour-scaled.jpg',
          process: (
            <p>
              1. Boil leaves in water for 1 hour. <br />
              2. Strain liquid. <br />
              3. Add mordant (alum). <br />
              4. Use for dyeing natural fabrics with unique organic colors.
            </p>
          )
        },
        
        {
          name: 'Biodegradable Plates',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEk29HZgHsQR81FnC6mnSPL97JnPMsH2b_iA&s',
          process: <p> 1. Press large, sturdy leaves between heated plates. <br/>
          2. Cool and trim edges. <br/>
          3. Coat with food-safe shellac if desired for water resistance.'</p>
        }
      ]
    },
    
    {
      type: 'peels',
      label: 'Peels',
      items: [
        {
          name: 'Natural Cleaner',
          image: 'https://en-media.thebetterindia.com/uploads/2019/04/Representative-image-15.jpg',
          process: <p>1. Remove the peel from the citrus fruit that you choose. <br/>
          2. Top up the jar with vinegar, close the lid and let soak in for a couple of weeks storing the closed jar inside a cupboard.<br/>
          3. Filter the mixture<br/>
          4. Fill up the rest of the bottle with water.
          </p>
        },
        {
          name: 'Face Powder',
          image: 'https://homesteadandchill.com/wp-content/uploads/2019/11/how-to-make-lemon-peel-powder-feature.jpeg',
          process: <p>1. Dry the Peels <br/>
          2. Grind into Powder <br/>
          3. Mix with Base Ingredients <br/>
          4. Store & Use

          </p>
        },
        {
          name: ' Candy',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGrPj7G4WrJ4ZKR2imc792JouDIAMg10Pt2zCVvgiWhjCZX6W2Ml5uYLIRxeBUt3P9g7g&usqp=CAU',
          process: <p>1. Peel the watermelon rind and remove the green skin. <br/>
          2. Cut the white part into small pieces. <br/>
          3. Boil the pieces in water until they are soft. <br/>
          4. Add sugar and lemon juice. <br/>
          5. Boil until the mixture thickens. <br/>
          6. Let it cool and store in a jar.
          </p>
        }
      ]
    },
    
    {
      type: 'shells',
      label: 'Shells',
      items: [
        {
          name: 'Garden Mulch',
          image: 'https://newscenter.lbl.gov/wp-content/uploads/2024/07/Newscenter_1025x685px_iStock-139550365.jpg',
          process: <p> 1.Crush shells into small pieces. <br/>
            2. Spread around plants.<br/>
            3. Deters pests while slowly releasing calcium and other nutrients into soil.</p>
        },
        {
          name: 'Organic Scrubb',
          image: 'https://5.imimg.com/data5/SELLER/Default/2024/6/426949986/MF/QV/KM/224159098/organic-coconut-body-scrub-title-image-jpg.jpg',
          process: <p> 1. Crush shells into small pieces. <br/>
          2. Mix with coconut oil and essential oils. <br/>
          3. Use as a natural, biodegradable body scrub.</p>
          
        },
        {
          name: 'Animal Feed ',
          image: 'https://5.imimg.com/data5/PQ/DX/MY-13081433/feed-and-nutrition-guide-for-broiler-250x250.jpg',
          process: <p> 1. Crush shells into small pieces. <br/>
          2. Mix with animal feed. <br/>
          3. Provides calcium and other nutrients for healthy bones and eggs.</p>
        }
      ]
    },
    
    {
      type: 'roots',
      label: 'Roots',
      items: [
        {
          name: 'Natural Dyes',
          image: 'https://i.ytimg.com/vi/wTCzzaevJYc/maxresdefault.jpg',
          process: <p>1.Clean and chop roots.<br/>
          2. Boil in water for 1-2 hours. <br/>
          3. Strain liquid. Add mordant. <br/>
          4. Use for dyeing fabrics with earth tones.</p>
        },
        {
          name: 'Crafting Material',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfZsweaoaIiVBrmINDHpfur6xaNHbtdqN2l-XlCGG60mnzuje5U8hPHgFLMzzzTbe0jng&usqp=CAU',
          process: <p> 1. Clean and dry sturdy roots.<br/>
            2. Shape while slightly flexible. Allow to dry completely.<br/>
            3. Use for baskets, decorations, or art pieces.</p>
        },
        {
          name: 'Medicinal Tinctures',
          image: 'https://thehomesteadchallenge.com/wp-content/uploads/2023/02/herbal-tincture-jpg.webp',
          process: <p> 1.Identify medicinal roots carefully. <br/>
          2. Clean and chop. Soak in alcohol for 4-6 weeks. Strain and bottle.<br/>
          3. Label clearly with usage instructions.</p>
        }
      ]
    }
  ];
  
  // Get the selected waste type's items
  const selectedWasteItems = wasteOptions.find(waste => waste.type === selectedWasteType)?.items || [];
  
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-2xl border border-gray-200">
      <h2 className="text-3xl font-extrabold mb-6 text-green-800 text-center">Waste Recycling Options</h2>

      {/* Waste Type Selection */}
      <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <label htmlFor="waste-type" className="block text-lg font-semibold mb-2 text-gray-700">
          Select Type of Waste:
        </label>
        <select
          id="waste-type"
          value={selectedWasteType}
          onChange={(e) => setSelectedWasteType(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 bg-gray-100 hover:bg-gray-200 transition-all duration-300"
        >
          <option value="">-- Select Waste Type --</option>
          {wasteOptions.map((option) => (
            <option key={option.type} value={option.type}>
              {option.label}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Display recycling items */}
      {selectedWasteType && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <h3 className="text-xl font-semibold mb-4 text-green-700 border-b pb-2 border-green-300">
            Products from {wasteOptions.find(waste => waste.type === selectedWasteType)?.label}
          </h3>

          <div className="grid gap-6">
            {selectedWasteItems.map((item, index) => (
              <motion.div
                key={index}
                className="flex flex-col md:flex-row border border-gray-300 rounded-lg overflow-hidden shadow-lg bg-gray-50 hover:shadow-xl transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98, backgroundColor: "#d1fae5" }}
              >
                {/* Image on the left */}
                <div className="md:w-1/2">
                  <div className="relative h-48 md:h-full overflow-hidden border-r border-gray-300">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Content on the right */}
                <div className="md:w-1/2 p-5 flex flex-col justify-center">
                  <h4 className="text-lg font-bold mb-3 text-gray-800">{item.name}</h4>
                  <div>
                    <h5 className="font-medium text-green-700 mb-2">How to Make:</h5>
                    <p className="text-gray-700 leading-relaxed">{item.process}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {!selectedWasteType && (
        <motion.div 
          className="text-center p-8 bg-gray-100 rounded-lg border border-dashed border-gray-300" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5 }}
        >
          <p className="text-gray-500 text-lg">
            Select a waste type above to see recycling options and instructions.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default WasteRecyclingFeature;
