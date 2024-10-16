const categoryMinimums = {
    kitchenSize: 0,
    demo: 500,
    plumbing: 600,
    electrical: 1250,
    cabinets: 0,
    countertops: 0,
    newSink: 0,
    newFixtures: 0,
    exhaustHoodDucting: 0,
    newAppliances: 0,
    installation: 0,
    backsplash: 700,
    flooring: 0,
    interiorPainting: 700,
    finalCleaning: 0
}

const dbItems = {
    removeSink: {
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 150, 
        markup: 0.65, 
        // unitPrice: undefined
    },
    removeCountertops: {
        calculatedUnits: undefined,
        sqftPrice: 2, 
        unitCost: undefined, 
        markup: 0.65, 
        unitPrice: undefined

    },
    removeCabinets: {
        calculatedUnits: undefined,
        sqftPrice: 4, 
        unitCost: undefined, 
        markup: 0.65, 
        unitPrice: undefined

    },
    removeBacksplash: {
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 300, 
        markup: 0.65, 
        unitPrice: undefined

    },
    removeFlooring: {
        calculatedUnits: undefined,
        sqftPrice: 2, 
        unitCost: undefined, 
        markup: 0.65, 
        unitPrice:undefined

    },
    lightDemo: {
        calculatedUnits: undefined,
        sqftPrice: 9, 
        unitCost: undefined, 
        markup: 0.65, 
        unitPrice:undefined

    },
    dumpster: {
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 425, 
        markup: 0.65, //f
        unitPrice: undefined
    },
    moveSink: {
        qboId: '',
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 650, 
        markup: 0.65, 
        unitPrice: undefined

    },
    moveFridgeWater: {
        qboId: '',
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 650, 
        markup: 0.65, 
        unitPrice:undefined

    },
    installPotFiller: {
        qboId: '',
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 1050, 
        markup: 0.65, 
        unitPrice:undefined

    },
    installFaucet: {
        qboId: '',
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 400, 
        markup: 0.65, 
        unitPrice:undefined

    },
    installDisposal: {
        qboId: '',
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 400, 
        markup: 0.65, 
        unitPrice:undefined

    },
    addGasLine: {
        qboId: '',
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 1500, 
        markup: 0.65, 
        unitPrice:undefined

    },
    swapFixtures: {
        qboId: '',
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 150, 
        markup: 0.65, 
        unitPrice:undefined

    },
    addCanLights: {
        qboId: '',
        calculatedUnits: undefined,
        sqftPrice: 5, 
        unitCost: undefined, 
        markup: 0.65, 
        unitPrice:undefined

    },
    addUnderCabinetLights: {
        qboId: '',
        calculatedUnits: undefined,
        sqftPrice: 2, 
        unitCost: undefined, 
        markup: 0.65, 
        unitPrice:undefined

    },
    switchesAndOutlets: {
        qboId: '',
        calculatedUnits: undefined,
        sqftPrice: 3, 
        unitCost: undefined, 
        markup: 0.65, 
        unitPrice:undefined
    },
    applianceOutlets: {
        qboId: '',
        calculatedUnits: undefined,
        sqftPrice: 6, 
        unitCost: undefined, 
        markup: 0.65, 
        unitPrice:undefined
    },
    drywallRepair: {
        qboId: '',
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 850, 
        markup: 0.65, 
        unitPrice:undefined
    },
    paintStainedCabinets: {
        qboId: '',
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 220, 
        markup: 0.65, 
        unitPrice:undefined

    },
    paintPaintedCabinets: {
        qboId: '',
        calculatedUnits(formData) { return (((formData.kitchenSize.measurementType == 'sq.in.' ? (formData.kitchenSize.length / 12) : formData.kitchenSize.length) + (formData.kitchenSize.measurementType == 'sq.in.' ? (formData.kitchenSize.width / 12) : formData.kitchenSize.width)) * 1.75 - 9 - 3 - 4 + (formData.kitchenSize.hasIsland ? (formData.kitchenSize.measurementType == 'sq.in.' ? (formData.kitchenSize.islandArea / 144) : formData.kitchenSize.islandArea) * ((formData.kitchenSize.measurementType == 'sq.in.' ? (formData.kitchenSize.islandWidth / 12) : formData.kitchenSize.islandWidth) > (38 / 12)) ? 2 : 1 : 0) + 1) },
        sqftPrice: undefined, 
        unitCost: 175, 
        markup: 0.65, 
        unitPrice:undefined

    },
    standardLineCabinets: {
        qboId: '',
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 317.50, 
        markup: 0.65, 
        unitPrice: undefined

    },
    customColorBase: {
        qboId: '',
        calculatedUnits(formData) { return ((((formData.kitchenSize.measurementType == 'sq.in.' ? (formData.kitchenSize.length / 12) : formData.kitchenSize.length) + (formData.kitchenSize.measurementType == 'sq.in.' ? (formData.kitchenSize.width / 12) : formData.kitchenSize.width)) * 1.75 - 9 - 3 - 4) / 2 + (formData.kitchenSize.hasIsland ? (formData.kitchenSize.measurementType == 'sq.in.' ? (formData.kitchenSize.islandArea / 144) : formData.kitchenSize.islandArea) * ((formData.kitchenSize.measurementType == 'sq.in.' ? (formData.kitchenSize.islandWidth / 12) : formData.kitchenSize.islandWidth) > (38 / 12)) ? 2 : 1 : 0) + 1) },
        sqftPrice: undefined, 
        unitCost: 80, 
        markup: 0.65, 
        unitPrice:undefined
    },
    customColorWall: {
        qboId: '',
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 80, 
        markup: 0.65, 
        unitPrice: undefined

    },
    fullCustomCabinets: {
        qboId: '',
        calculatedUnits(formData) { return (((formData.kitchenSize.measurementType == 'sq.in.' ? (formData.kitchenSize.length / 12) : formData.kitchenSize.length) + (formData.kitchenSize.measurementType == 'sq.in.' ? (formData.kitchenSize.width / 12) : formData.kitchenSize.width)) * 1.75 - 9 - 3 - 4 + (formData.kitchenSize.hasIsland ? (formData.kitchenSize.measurementType == 'sq.in.' ? (formData.kitchenSize.islandArea / 144) : formData.kitchenSize.islandArea) * ((formData.kitchenSize.measurementType == 'sq.in.' ? (formData.kitchenSize.islandWidth / 12) : formData.kitchenSize.islandWidth) > (38 / 12)) ? 2 : 1 : 0) + 1) },
        sqftPrice: undefined, 
        unitCost: 1060, 
        markup: 0.65, 
        unitPrice:undefined
    },
    noCabinets: {
        qboId: '',
        calculatedUnits(formData) { return (((formData.kitchenSize.measurementType == 'sq.in.' ? (formData.kitchenSize.length / 12) : formData.kitchenSize.length) + (formData.kitchenSize.measurementType == 'sq.in.' ? (formData.kitchenSize.width / 12) : formData.kitchenSize.width)) * 1.75 - 9 - 3 - 4 + (formData.kitchenSize.hasIsland ? (formData.kitchenSize.measurementType == 'sq.in.' ? (formData.kitchenSize.islandArea / 144) : formData.kitchenSize.islandArea) * ((formData.kitchenSize.measurementType == 'sq.in.' ? (formData.kitchenSize.islandWidth / 12) : formData.kitchenSize.islandWidth) > (38 / 12)) ? 2 : 1 : 0) + 1) },
        sqftPrice: undefined, 
        unitCost: 0, 
        markup: 0, 
        unitPrice:undefined

    },
    'countertops:Granite': {
        qboId: '',
        calculatedUnits(formData) {
            let l = (formData.kitchenSize.measurementType === 'sq.in.' ? (formData.kitchenSize.length / 12) : formData.kitchenSize.length)
            let w = (formData.kitchenSize.measurementType === 'sq.in.' ? (formData.kitchenSize.width / 12) : formData.kitchenSize.width)
            let hi = formData.kitchenSize.hasIsland
            let il = (formData.kitchenSize.measurementType === 'sq.in.' ? (formData.kitchenSize.islandLength / 12) : formData.kitchenSize.islandLength)
            let iw = (formData.kitchenSize.measurementType === 'sq.in.' ? (formData.kitchenSize.islandWidth / 12) : formData.kitchenSize.islandWidth)

            return ((((l + w) * 1.6 - 9 - 3 - 4) + (hi ? il * iw : 0)) * 2.5);
        },
        sqftPrice: undefined, 
        unitCost: 60, 
        markup: 0.65, 
        unitPrice:undefined
    },
    'countertops:Quartz': {
        qboId: '',
        calculatedUnits(formData) {
            let l = (formData.kitchenSize.measurementType === 'sq.in.' ? (formData.kitchenSize.length / 12) : formData.kitchenSize.length)
            let w = (formData.kitchenSize.measurementType === 'sq.in.' ? (formData.kitchenSize.width / 12) : formData.kitchenSize.width)
            let hi = formData.kitchenSize.hasIsland
            let il = (formData.kitchenSize.measurementType === 'sq.in.' ? (formData.kitchenSize.islandLength / 12) : formData.kitchenSize.islandLength)
            let iw = (formData.kitchenSize.measurementType === 'sq.in.' ? (formData.kitchenSize.islandWidth / 12) : formData.kitchenSize.islandWidth)

            return ((((l + w) * 1.6 - 9 - 3 - 4) + (hi ? il * iw : 0)) * 2.5);
        },
        sqftPrice: undefined, 
        unitCost: 60, 
        markup: 0.65, 
        unitPrice:undefined

    },
    'countertops:Solid-Surface': {
        qboId: '',
        calculatedUnits(formData) {
            let l = (formData.kitchenSize.measurementType === 'sq.in.' ? (formData.kitchenSize.length / 12) : formData.kitchenSize.length)
            let w = (formData.kitchenSize.measurementType === 'sq.in.' ? (formData.kitchenSize.width / 12) : formData.kitchenSize.width)
            let hi = formData.kitchenSize.hasIsland
            let il = (formData.kitchenSize.measurementType === 'sq.in.' ? (formData.kitchenSize.islandLength / 12) : formData.kitchenSize.islandLength)
            let iw = (formData.kitchenSize.measurementType === 'sq.in.' ? (formData.kitchenSize.islandWidth / 12) : formData.kitchenSize.islandWidth)

            return ((((l + w) * 1.6 - 9 - 3 - 4) + (hi ? il * iw : 0)) * 2.5);
        },
        sqftPrice: undefined, 
        unitCost: 55, 
        markup: 0.65, 
        unitPrice:undefined
    },
    'countertops:Butcher Block': {
        qboId: '',
        calculatedUnits(formData) {
            let l = (formData.kitchenSize.measurementType === 'sq.in.' ? (formData.kitchenSize.length / 12) : formData.kitchenSize.length)
            let w = (formData.kitchenSize.measurementType === 'sq.in.' ? (formData.kitchenSize.width / 12) : formData.kitchenSize.width)
            let hi = formData.kitchenSize.hasIsland
            let il = (formData.kitchenSize.measurementType === 'sq.in.' ? (formData.kitchenSize.islandLength / 12) : formData.kitchenSize.islandLength)
            let iw = (formData.kitchenSize.measurementType === 'sq.in.' ? (formData.kitchenSize.islandWidth / 12) : formData.kitchenSize.islandWidth)

            return ((((l + w) * 1.6 - 9 - 3 - 4) + (hi ? il * iw : 0)) * 2.5);
        },
        sqftPrice: undefined, 
        unitCost: 50, 
        markup: 0.65, 
        unitPrice:undefined
    },
    'newSink:Standard': {
        qboId: '',
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 450, 
        markup: 0.65, 
        unitPrice: undefined

    },
    'newSink:Workstation': {
        qboId: '',
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 850, 
        markup: 0.65, 
        unitPrice:undefined
    },
    'newSink:Farmhouse': {
        qboId: '',
        calculatedUnits: undefined,
        sqftPrice: undefined,
        unitCost: 1050,
        markup: 0.65,
        unitPrice: undefined
    },
    'newSink:Custom Finish': {
        qboId: '',
        calculatedUnits: undefined,
        sqftPrice: undefined,
        unitCost: 650,
        markup: 0.65,
        unitPrice: undefined
    },
    newRange: {
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 1000, 
        markup: 0, 
        unitPrice:undefined

    },
    newCooktop: {
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 1250, 
        markup: 0, 
        unitPrice:undefined

    },
    newWallOven: {
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 1500, 
        markup: 0, 
        unitPrice:undefined
    },
    newMicrowave: {
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 450, 
        markup: 0, 
        unitPrice:undefined

    },
    newFridge: {
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 2500, 
        markup: 0, 
        unitPrice:undefined
    },
    newDishwasher: {
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 700, 
        markup: 0, 
        unitPrice:undefined
    },
    newRangeHood: {
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 800, 
        markup: 0, 
        unitPrice:undefined
    },
    installAppliances: {
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 600, 
        markup: 0.65, 
        unitPrice:undefined
    },
    installVentHood: {
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 450, 
        markup: 0.65, 
        unitPrice:undefined
    },
    installWallOven: {
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 600, 
        markup: 0.65, 
        unitPrice:undefined
    },
    backsplash: {
        calculatedUnits(formData) {
            let l = (formData.kitchenSize.measurementType === 'sq.in.' ? (formData.kitchenSize.length / 12) : formData.kitchenSize.length)
            let w = (formData.kitchenSize.measurementType === 'sq.in.' ? (formData.kitchenSize.width / 12) : formData.kitchenSize.width)

            return ((((l + w) * 1.6 - 9 - 3 - 4)) * 2);
        },
        sqftPrice: 20, 
        unitCost: undefined, 
        markup: 0.65, 
        unitPrice:undefined
    },
    paintKitchen: {
        calculatedUnits: undefined,
        sqftPrice: 6, 
        unitCost:undefined, 
        markup: 0.65, 
        unitPrice:undefined
    },
    cleanKitchen: {
        calculatedUnits: undefined,
        sqftPrice: 1.1, 
        unitCost:undefined, 
        markup: 0.65, 
        unitPrice:undefined
    },
    'flooring:Hardwood': {
        qboId: '',
        calculatedUnits: undefined,
        sqftPrice: 9, 
        unitCost: undefined, 
        markup: 0.65, 
        unitPrice:undefined
    },
    'flooring:Tile': {
        qboId: '',
        calculatedUnits: undefined,
        sqftPrice: 13.5, 
        unitCost: undefined, 
        markup: 0.65, 
        unitPrice: undefined

    },
    'flooring:LVP/Engineered': {
        qboId: '',
        calculatedUnits: undefined,
        sqftPrice: 5, 
        unitCost: undefined, 
        markup: 0.65, 
        unitPrice:undefined
    },
    runExhaustDucting: {
        qboId: '',
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 750, 
        markup: 0.65, 
        unitPrice:undefined
    },
    runDuctingThroughBrick: {
        qboId: '',
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 450, 
        markup: 0.65, 
        unitPrice:undefined
    },
    waterfallEdges: {
        qboId: '',
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: 540, 
        markup: 0.65, 
        unitPrice: undefined

    },
    fixtureCount: {
        qboId: '',
        calculatedUnits: undefined,
        sqftPrice: undefined, 
        unitCost: undefined, 
        markup: undefined, 
        unitPrice: undefined, 
        subtotal:undefined
    },
    newFixtures: {
        qboId: '',
        calculatedUnits(formData) {
            let fixtureCount = formData.electrical.fixtureCount || 0;
            if (formData.plumbing.installPotFiller) fixtureCount += 1;
            if (formData.plumbing.installFaucet) fixtureCount += 1;
            return fixtureCount;
        },
        sqftPrice: undefined, 
        unitCost: 200,  
        markup: 0.0, 
        unitPrice:undefined,
        subtotal:undefined
    }
}


export const processFormData = (req, res) => {

    let formData = req?.body;
    console.log(formData)
    // Function to calculate total cost
    const calculateTotalCost = (dbItems, formData) => {

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
                console.log(">>> categoryItem :", categoryItem)
                const dbNeddle = ((categoryItem == 'countertopType') || (categoryItem == 'flooringType') || (categoryItem == 'sinkType') ? `${cat}:${formData[cat][categoryItem]}` : (categoryItem == 'cabinetType') ? `${formData[cat][categoryItem]}`: categoryItem);
                const itemsNeddle = ((categoryItem == 'countertopType') || (categoryItem == 'flooringType' || (categoryItem == 'sinkType')) ? cat : (categoryItem == 'cabinetType') ? `${formData[cat][categoryItem]}` : categoryItem);
                console.log("dbNeddle: ",dbNeddle)
                if (formCategory[categoryItem] && dbItems[dbNeddle]) {  // Ensure the categoryItem is selected and exists in dbItems

                    const dbItem = dbItems[dbNeddle];
                    const markup = dbItem?.markup ?? 1;
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
                        console.log("dbNeddle: ",dbNeddle)
                        calculatedUnits = ((((kitchenLength + kitchenWidth) * 1.6 - 9 - 3 - 4) + (hasIsland ? islandLength * islandWidth : 0)) * 2.5);
                        console.log("calculatedUnits: ", calculatedUnits)
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
                        unitPrice = (sqftPrice == undefined ? unitCost * (1 + markup) : sqftPrice * (1 + markup));
                    }

                    // calculate subtotal
                    //d sqft
                    //e unit cost
                    //f markup
                    //g unit price
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
                        const a = 1 // if(D11="",G11*A11*(if(C11="",1,C11)),G11*D$3*A11)
                        console.log(">>>>dbNeddle: ", dbNeddle, "\nsqftPrice: ",sqftPrice, "\nunitPrice: ", unitPrice, "\ncalculatedUnits: ", calculatedUnits, "\nkitchenArea: ", kitchenArea)
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
        console.log(cat)
    })
    // console.log(JSON.stringify(estimate, null, 2));

    // Send a response back to the client
    res?.status(200).send({ estimate });
};