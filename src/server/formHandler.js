import dbItems from '../components/adminView/items/items.json' assert { type: "json" };
import categoryMinimums from '../components/adminView/categories/categoryMinimums.json' assert { type: "json" };
import calculatorSettings from '../components/adminView/calculator/calculatorSettings.json' assert { type: "json"};
import { updateVisitor } from '../components/adminView/visitors/updateVisitor.js'
import qboClient from './qbo.js';
import { sendToHatch } from "./hatch.js";

// Convert calculator estimate to QBO estimate format
const createQboEstimateData = (calculatorEstimate, customerId) => {
  const lines = [];
  let lineNumber = 1;

  calculatorEstimate.categories.forEach(category => {
    category.items.forEach(item => {
      if (item.qboId) {
        lines.push({
          Id: lineNumber.toString(),
          LineNum: lineNumber,
          Description: item.name,
          Amount: item.subtotal,
          DetailType: "SalesItemLineDetail",
          SalesItemLineDetail: {
            ItemRef: {
              value: item.qboId
            },
            UnitPrice: item.unitPrice,
            Qty: item.calculatedUnits,
            MarkupInfo: {
              PercentBased: true,
              Percent: item.markup * 100
            }
          }
        });
        lineNumber++;
      }
    });
  });

  return {
    Line: lines,
    CustomerRef: {
      value: customerId
    },
    CustomField: [
      {
        DefinitionId: "1",
        Name: "Estimate Range",
        Type: "StringType",
        StringValue: `${calculatorEstimate.lowRange} - ${calculatorEstimate.highRange}`
      }
    ]
  };
};

export const processFormData = async (req, res) => {
  let formData = req?.body;

  const isSelected = (item) => {
    if (!item) return item;
    return true;
  };

  // Function to calculate total cost
  const calculateTotalCost = (dbItems, formData) => {
    const MARK_UP = calculatorSettings.markUp;
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
        const dbNeddle = ((categoryItem == 'countertopType') || (categoryItem == 'flooringType') || (categoryItem == 'sinkType') ? `${cat}:${formData[cat][categoryItem]}` : (categoryItem == 'cabinetType') ? `${formData[cat][categoryItem]}` : categoryItem);
        const itemsNeddle = (
          (categoryItem == 'countertopType') || (categoryItem == 'flooringType' || (categoryItem == 'sinkType'))
            ? cat
            : (categoryItem == 'cabinetType')
              ? `${formData[cat][categoryItem]}`
              : categoryItem);

        if (isSelected(formCategory[categoryItem]) && dbItems[dbNeddle]) {
          const dbItem = dbItems[dbNeddle];
          const markup = isNaN(parseFloat(dbItem?.markup)) ? parseFloat(dbItem?.markup) : MARK_UP;
          const sqftPrice = dbItem?.sqftPrice;

          // calculate units
          let calculatedUnits = 1;

          if (['paintStainedCabinets', 'paintPaintedCabinets', 'standardLineCabinets', 'fullCustomCabinets'].includes(dbNeddle)) {
            calculatedUnits = ((kitchenLength + kitchenWidth) * calculatorSettings.cabinet_multiplier - calculatorSettings.window_constant - calculatorSettings.appliance_constant + (hasIsland ? islandLength * (islandWidth > (38 / 12) ? 2 : 1) : 0))
          } else if (dbNeddle == 'backsplash') {
            calculatedUnits = ((((kitchenLength + kitchenWidth) * calculatorSettings.countertop_multiplier - calculatorSettings.window_constant - calculatorSettings.appliance_constant)) * 2);
          } else if (dbNeddle == 'customColorBase') {
            calculatedUnits = (((kitchenLength + kitchenWidth) * calculatorSettings.cabinet_multiplier - calculatorSettings.window_constant - calculatorSettings.appliance_constant) / 2 + ((hasIsland ? (islandArea * (kitchenWidth > (38 / 12)) ? 2 : 1) : 0)))
          } else if (dbNeddle == 'customColorWall') {
            const cabinetUnits = category.items.filter(item => item.name == 'standardLineCabinets')[0]?.calculatedUnits ?? 0;
            const customColorBase = category.items.filter(item => item.name == 'customColorBase')[0]?.calculatedUnits ?? 0;
            calculatedUnits = cabinetUnits - customColorBase;
          } else if (['countertops:Granite', 'countertops:Quartz', 'countertops:Solid-Surface', 'countertops:Butcher Block'].includes(dbNeddle)) {
            const a = 1;
            calculatedUnits = ((((kitchenLength + kitchenWidth) * calculatorSettings.countertop_multiplier - calculatorSettings.window_constant - calculatorSettings.appliance_constant) + (hasIsland ? islandLength * islandWidth : 0)) * 2.5);
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
            const base = 60;
            const multiplier = 3
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
            unitPrice = ((sqftPrice == null || sqftPrice == "") ? unitCost * (1 + markup) : sqftPrice * (1 + markup));
          }

          let subtotal = 0;

          if (dbNeddle == 'swapFixtures') {
            subtotal = (!sqftPrice
              ? unitPrice * calculatedUnits
              : unitPrice * parseFloat(kitchenArea) * formData.electrical.fixtureCount);
          } else if (dbNeddle == 'backsplash') {
            const categoryMinimum = 700;
            const allowance = 12
            const a = 1

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
      if (categoryMinimums[cat] && category.categoryTotal > 0 && category.categoryTotal < categoryMinimums[cat]) {
        category.categoryTotal = categoryMinimums[cat];
      }

      estimate.categories.push(category);
      estimate.overallTotal += category.categoryTotal;
    };

    const rng = (Math.floor(Math.random() * 75) + 1) / 10000;
    
    estimate.lowRange = estimate.overallTotal - (estimate.overallTotal * (calculatorSettings.lowBuffer + rng));
    estimate.highRange = estimate.overallTotal + (estimate.overallTotal * (calculatorSettings.highBuffer + rng));
    estimate.rng = rng;

    console.log("rng: ", estimate.rng, "\nlowBuffer: ", calculatorSettings.lowBuffer, "\nhighBuffer: ", calculatorSettings.highBuffer, "\nLow: ", estimate.lowRange, "\nHigh: ", estimate.highRange);
    return estimate;
  };

  try {
    // Calculate estimate
    const estimate = calculateTotalCost(dbItems, formData);

    // Store visitor data
    const calculatorSettingsValue = {
      rng: estimate.rng,
      lowBuffer: calculatorSettings.lowBuffer,
      highBuffer: calculatorSettings.highBuffer
    };
    const { id, ...contactInfo } = formData.user;
    const visitor = {
      contactInfo,
      calculatorSettingsValue,
      estimate
    };

    // Save visitor data
    await updateVisitor({ body: { id: [formData.user.id], data: visitor } });

    // QBO Integration
    try {
      // Find or create customer
      let customer = await qboClient.findCustomerByEmail(contactInfo.email);
      
      if (!customer) {
        const customerData = {
          DisplayName: contactInfo.name,
          PrimaryEmailAddr: { Address: contactInfo.email },
          PrimaryPhone: { FreeFormNumber: contactInfo.phone },
          BillAddr: {
            Line1: contactInfo.address,
            City: contactInfo.city,
            CountrySubDivisionCode: contactInfo.state,
            PostalCode: contactInfo.zip
          }
        };
        customer = await qboClient.createCustomer(customerData);
      }

      // Send customer data to Hatch
      try {
        await sendToHatch({
          ...customer,
          estimate: {
            lowRange: estimate.lowRange,
            highRange: estimate.highRange
          }
        });
        console.log('Successfully sent customer data to Hatch');
      } catch (hatchError) {
        console.error('Error sending to Hatch:', hatchError);
        // Continue with QBO estimate creation even if Hatch fails
      }

      // Create QBO estimate
      const qboEstimateData = createQboEstimateData(estimate, customer.Id);

      const qboEstimate = await qboClient.createEstimate(qboEstimateData);

      // Get estimate PDF
      const estimatePdf = await qboClient.getEstimatePdf(qboEstimate.Id);

      // Send response with all data
      res.status(200).send({
        estimate,
        // qbo: {
          // customer,
          // estimate: qboEstimate,
          // pdf: estimatePdf
        // }
      });
    } catch (qboError) {
      console.error('QBO integration error:', qboError);
      // Still send the estimate even if QBO integration fails
      res.status(200).send({ estimate, qboError: qboError.message });
    }
  } catch (error) {
    console.error('Error processing form data:', error);
    res.status(500).send({ error: 'Error processing form data' });
  }
};