import dbItems from '../db/items.json' assert { type: "json" };
import categoryMinimums from '../components/adminView/categories/categoryMinimums.json' assert { type: "json" };

export const processFormData = (req, res) => {

    let formData = req?.body;
    console.log(formData)

    const isSelected = (item) => {
        if (!item) return item

        return true
    }

    // Function to calculate total cost
    const calculateTotalCost = (dbItems, formData) => {
        console.log("dbItems: ", dbItems)
        const estimate = {
            categories: [],
            overallTotal: 0
        };

        // Loop through formData categories 
        for (let cat in formData) {

            if (cat === 'kitchenSize') {

                var kitchenLength = formData.kitchenSize.length / 12;
                var kitchenWidth = formData.kitchenSize.width / 12;
                var kitchenArea = kitchenLength * kitchenWidth;
                var islandLength = formData.kitchenSize.islandLength / 12;
                var islandWidth = formData.kitchenSize.islandWidth / 12;
                var hasIsland = formData.kitchenSize.hasIsland;
                var islandArea = (islandLength * islandWidth);

                continue;
            }

            const category = {
                category: cat,
                items: [],
                categoryTotal: 0
            }

            const formCategory = formData[cat];

            if (cat == 'newFixtures') {
                formCategory.newFixtures = true;
            }

            for (let categoryItem in formCategory) {
                const item = {};
                const dbNeddle = ((categoryItem == 'countertopType') || (categoryItem == 'flooringType') || (categoryItem == 'sinkType') ? `${cat}:${formData[cat][categoryItem]}` : (categoryItem == 'cabinetType') ? `${formData[cat][categoryItem]}`: categoryItem);
                const itemsNeddle = (
                    (categoryItem == 'countertopType') || (categoryItem == 'flooringType' || (categoryItem == 'sinkType')) 
                    ? cat 
                    : (categoryItem == 'cabinetType') 
                        ? `${formData[cat][categoryItem]}` 
                        : categoryItem);

                console.log("categoryItem ", categoryItem, " Value", formCategory[categoryItem])
                console.log("dbNeddle: ",dbNeddle, "itemsNeddle: ", itemsNeddle)

                if (isSelected(formCategory[categoryItem]) && dbItems[dbNeddle]) {  

                    const dbItem = dbItems[dbNeddle];
                    const markup = parseFloat(dbItem?.markup) ?? 1;
                    const sqftPrice = dbItem?.sqftPrice;

                    // calculate units
                    let calculatedUnits = 1;

                    if (['paintStainedCabinets', 'paintPaintedCabinets', 'standardLineCabinets', 'fullCustomCabinets'].includes(dbNeddle)) {

                        calculatedUnits = ((kitchenLength + kitchenWidth) * 1.75 - 9 - 3 - 4 + (hasIsland ? islandLength * (islandWidth > (38 / 12) ? 2 : 1) : 0))

                    } else if (dbNeddle == 'backsplash') {

                        calculatedUnits = ((((kitchenLength + kitchenWidth) * 1.6 - 9 - 3 - 4)) * 2);

                    } else if (dbNeddle == 'customColorBase') {

                        calculatedUnits = (((kitchenLength + kitchenWidth) * 1.75 - 9 - 3 - 4) / 2 + ((hasIsland ? (islandArea * (kitchenWidth > (38 / 12)) ? 2 : 1) : 0)))

                    } else if (dbNeddle == 'customColorWall') {

                        const cabinetUnits = category.items.filter(item => item.name == 'standardLineCabinets')[0]?.calculatedUnits ?? 0;
                        const customColorBase = category.items.filter(item => item.name == 'customColorBase')[0]?.calculatedUnits ?? 0;
                        calculatedUnits = cabinetUnits - customColorBase;

                    } else if (['countertops:Granite', 'countertops:Quartz', 'countertops:Solid-Surface', 'countertops:Butcher Block'].includes(dbNeddle)) {
                        const a = 1; //=IF(A42,((B$3+C$3)*1.6-9-3-4)+(IF(A$6,B$6*C$6,0)),0)*2.5

                        calculatedUnits = ((((kitchenLength + kitchenWidth) * 1.6 - 9 - 3 - 4) + (hasIsland ? islandLength * islandWidth : 0)) * 2.5);

                    } else if (dbNeddle == 'waterfallEdges') {

                        calculatedUnits = formCategory[categoryItem]

                    } else if (dbNeddle == 'swapFixtures') {

                        calculatedUnits = formData['electrical'].fixtureCount;

                    } else if (dbNeddle == 'newFixtures') {

                        let newFixturesCount = formData.electrical.fixtureCount || 0;
                        if (formData.plumbing.installPotFiller) newFixturesCount += 1;
                        if (formData.plumbing.installFaucet) newFixturesCount += 1;
                        calculatedUnits = newFixturesCount;
                    }

                    //calculate unit cost
                    let unitCost = dbItem.unitCost ?? 1;

                    if (dbNeddle == 'paintKitchen') {
                        unitCost = Math.max((sqftPrice * kitchenArea), 500);
                    } else if (dbNeddle == 'waterfallEdges') {
                        const base = 60; // needs explaination
                        const multiplier = 3 // needs explaination
                        unitCost = (base * islandWidth * multiplier)
                    } else if (dbNeddle == 'cleanKitchen') {
                        unitCost = sqftPrice * kitchenArea
                    }


                    // calculate unit price
                    let unitPrice = 0;
                    if (dbNeddle == 'backsplash') {

                        const multiplier = 12;
                        unitPrice = (!sqftPrice ? (unitCost * (1 + markup) + (multiplier * calculatedUnits)) : (sqftPrice * ((1 + markup))));

                    } else {
                        
                        unitPrice = (sqftPrice == null ? unitCost * (1 + markup) : sqftPrice * (1 + markup));
                        if (dbNeddle == 'cleanKitchen'){
                            console.log("calculate unit price\nItem: ", dbItem[dbNeddle])
                            console.log("sqftPrice: ", sqftPrice, "\nunitCost: ", unitCost, "\nmarkup: ", markup, "\nunitPrice: ", unitPrice)
                        }
                    }

                    let subtotal = 0;

                    if (dbNeddle == 'swapFixtures') {

                        subtotal = (!sqftPrice
                            ? unitPrice * calculatedUnits
                            : unitPrice * parseFloat(kitchenArea) * formData.electrical.fixtureCount);

                    } else if (dbNeddle == 'backsplash') {
                        const categoryMinimum = 700;// j
                        const allowance = 12
                        const a = 1 // 

                        subtotal = (

                            sqftPrice == undefined
                                ? unitPrice * a
                                : (calculatedUnits * sqftPrice) > categoryMinimum
                                    ? ((unitPrice + allowance) * a * calculatedUnits)
                                    : (categoryMinimum * (1 + markup) + (allowance * calculatedUnits)) * a
                        )
                    } else if (dbNeddle == 'waterfallEdges') {

                        const edges = parseInt(formData.countertops.waterfallEdges);

                        subtotal = (
                            !sqftPrice
                                ? unitPrice * (!calculatedUnits
                                    ? 1
                                    : calculatedUnits)
                                : unitPrice * kitchenArea * edges
                        );

                    } else if (dbNeddle == 'fixtureCount') {

                        subtotal = ((formData.electrical.addCanLights || formData.electrical.switchesAndOutlets) ? 1500 : 0);

                    } else if (['flooring:Tile', 'flooring:LVP/Engineered'].includes(dbNeddle)) {
                        let a = 1;
                        let allowance = dbNeddle == 'flooring:Tile' ? 12 : 0;
                        subtotal = (!sqftPrice ? unitPrice * a * (!calculatedUnits ? 1 : calculatedUnits) : (unitPrice + allowance) * kitchenArea * a)
                    } else {
                        const a = 1 
                        subtotal = (!sqftPrice ? unitPrice * a * calculatedUnits : unitPrice * kitchenArea * a)
                    }

                    //build the estimate item
                    item.qboId = dbItem?.qboId;
                    item.sqftPrice = sqftPrice;
                    item.markup = markup;
                    item.name = itemsNeddle;
                    item.unitCost = unitCost;
                    item.calculatedUnits = calculatedUnits;
                    item.unitPrice = unitPrice;
                    item.subtotal = subtotal;

                    // add item to category items
                    category.items.push(item);

                    if (dbNeddle == 'backsplash') {
                        category.categoryTotal = (item.subtotal);
                    } else {
                        category.categoryTotal += item.subtotal;
                    }
                }
            }

            // Apply category minimum if applicable
            if (categoryMinimums[cat] && category.categoryTotal > 0 && category.categoryTotal < categoryMinimums[cat] ) {
                category.categoryTotal = categoryMinimums[cat];
            }

            estimate.categories.push(category);
            estimate.overallTotal += category.categoryTotal;
        };

        const lowSideBuffer = 0.06
        const highSideBuffer = 0.1
        const rng = (Math.floor(Math.random() * 75) + 1) / 10000;

        estimate.lowRange = estimate.overallTotal - (estimate.overallTotal * (lowSideBuffer + rng))
        estimate.highRange = estimate.overallTotal + (estimate.overallTotal * (highSideBuffer + rng))

        return estimate;
    }

    const estimate = calculateTotalCost(dbItems, formData);

    // Output estimate as a JSON response
    estimate.categories.forEach(cat => {
        // console.log(cat)
    })
    // console.log(JSON.stringify(estimate, null, 2));

    // Send a response back to the client
    res?.status(200).send({ estimate });
};