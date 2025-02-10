import dbItems from '../components/adminView/items/items.json' assert { type: "json" };
import categoryMinimums from '../components/adminView/categories/categoryMinimums.json' assert { type: "json" };
import calculatorSettings from '../components/adminView/calculator/calculatorSettings.json' assert { type: "json"};
import { updateVisitor } from '../components/adminView/visitors/updateVisitor.js'
import qboClient from './qbo.js';
import { sendToHatch } from './hatch.js';

/**
 * Gets the database lookup key for an item
 * @param {string} itemName - Name of the item
 * @param {string} categoryName - Name of the category
 * @param {Object} formData - Form data
 * @returns {string} Database lookup key
 */
const getDbNeddle = (itemName, categoryName, formData) => {
  console.log("** getDbNeddle **");
  if (itemName === 'countertopType' || itemName === 'flooringType' || itemName === 'sinkType') {
    console.log(`${categoryName}:${formData[categoryName][itemName]}`);
    return `${categoryName}:${formData[categoryName][itemName]}`;
  }
  if (itemName === 'cabinetType') {
    return formData[categoryName][itemName];
  }
  return itemName;
};

/**
 * Gets the normalized item name for the estimate
 * @param {string} itemName - Name of the item
 * @param {string} categoryName - Name of the category
 * @param {Object} formData - Form data
 * @returns {string} Normalized item name
 */
const getItemsNeddle = (itemName, categoryName, formData) => {
  console.log("** getItemsNeddle **")
  if (itemName === 'countertopType' || itemName === 'flooringType' || itemName === 'sinkType') {
    console.log(`${formData[categoryName][itemName]} `);
    return formData[categoryName][itemName];
  }
  if (itemName === 'cabinetType') {
    return formData[categoryName][itemName];
  }
  return itemName;
};

/**
 * Creates an estimate item from database item and form data
 * @param {Object} dbItem - Database item
 * @param {string} itemsNeddle - Normalized item name
 * @param {Object} formData - Form data
 * @param {Object} dimensions - Kitchen dimensions
 * @param {Object} category - Category data
 * @returns {Object} Estimate item
 */
const createEstimateItem = (dbItem, itemsNeddle, formData, dimensions, category) => {
  console.log("** createEstimateItem **");
  console.log(itemsNeddle)
  const markup = isNaN(parseFloat(dbItem?.markup)) ? calculatorSettings.markUp : parseFloat(dbItem.markup);
  const calculatedUnits = calculateUnits(itemsNeddle, dimensions, formData, category);
  let unitCost = calculateUnitCost(dbItem, itemsNeddle, dimensions);
  const sqftPrice = dbItem?.sqftPrice;

  let unitPrice = 0;

  if (itemsNeddle === 'backsplash') {
    const multiplier = 12;
    unitPrice = (!sqftPrice ? 
      (unitCost * (1 + markup) + (multiplier * calculatedUnits)) : 
      (sqftPrice * ((1 + markup))));
  }else {
    unitPrice = (!sqftPrice ? unitCost * (1 + markup) : sqftPrice * (1 + markup));
  }

  unitPrice += (itemsNeddle === 'Tile' ? 12 : 0) 

  let subtotal = calculateSubtotal(itemsNeddle, unitPrice, calculatedUnits, dimensions, formData);

  // Add style description for cabinets and countertops
  const description = getItemDescription(itemsNeddle, formData);

  // Get selections for appliances
  const selections = getItemSelections(itemsNeddle, formData);

  const estimateItem = {
    qboId: dbItem?.qboId,
    sqftPrice,
    markup,
    name: itemsNeddle,
    unitCost,
    calculatedUnits,
    unitPrice,
    subtotal,
    ...(description && { description }),
    ...(selections && { selections })
  };

  console.log('Created estimate item:', estimateItem);
  return estimateItem;
};

/**
 * Gets selections for an item if applicable
 * @param {string} itemName - Name of the item
 * @param {Object} formData - Form data
 * @returns {Array|null} Array of selections or null
 */
const getItemSelections = (itemName, formData) => {
  // Check if this is an appliance item with selections
  if (formData.newAppliances && 
      formData.newAppliances[itemName] && 
      formData.newAppliances[`${itemName}_selections`]) {
    return formData.newAppliances[`${itemName}_selections`];
  }
  return null;
};

/**
 * Calculates subtotal for an item
 * @param {string} itemType - Type of item
 * @param {number} unitPrice - Price per unit
 * @param {number} calculatedUnits - Number of units
 * @param {Object} dimensions - Kitchen dimensions
 * @param {Object} formData - Form data
 * @returns {number} Calculated subtotal
 */
const calculateSubtotal = (itemType, unitPrice, calculatedUnits, dimensions, formData) => {
  const { kitchenArea } = dimensions.kitchen;

  switch (itemType) {
    case 'swapFixtures':
      return (!dbItems[itemType]?.sqftPrice ? 
        unitPrice * calculatedUnits : 
        unitPrice * kitchenArea * formData.electrical.fixtureCount);

    case 'backsplash': {
      const categoryMinimum = 700;
      const allowance = 12;
      const a = 1;

      return (dbItems[itemType]?.sqftPrice === undefined ? 
        unitPrice * a :
        (calculatedUnits * dbItems[itemType].sqftPrice) > categoryMinimum ?
          ((unitPrice + allowance) * a * calculatedUnits) :
          (categoryMinimum * (1 + calculatorSettings.markUp) + (allowance * calculatedUnits)) * a);
    }

    case 'waterfallEdges': {
      const edges = parseInt(formData.countertops.waterfallEdges);
      return (!dbItems[itemType]?.sqftPrice ? 
        unitPrice * (!calculatedUnits ? 1 : calculatedUnits) : 
        unitPrice * kitchenArea * edges);
    }

    case 'fixtureCount':
      return ((formData.electrical.addCanLights || formData.electrical.switchesAndOutlets) ? 1500 : 0);

    case 'flooring:Tile':
    case 'flooring:LVP/Engineered': {
      const a = 1;
      const allowance = itemType === 'flooring:Tile' ? 12 : 0;
      return (!dbItems[itemType]?.sqftPrice ? 
        unitPrice * a * (!calculatedUnits ? 1 : calculatedUnits) : 
        (unitPrice + allowance) * kitchenArea * a);
    }

    default: {
      const a = 1;
      return (!dbItems[itemType]?.sqftPrice ? 
        unitPrice * a * calculatedUnits : 
        unitPrice * kitchenArea * a);
    }
  }
};

/**
 * Gets description for cabinet and countertop items
 * @param {string} itemType - Type of item
 * @param {Object} formData - Form data
 * @returns {Object|null} Item description
 */
const getItemDescription = (itemType, formData) => {
  if (formData.cabinets?.selectedStyle && 
      ['standardLineCabinets', 'paintStainedCabinets', 'paintPaintedCabinets', 'fullCustomCabinets'].includes(itemType)) {
    return {
      style: formData.cabinets.selectedStyle.style,
      imagePath: formData.cabinets.selectedStyle.imagePath,
      title: formData.cabinets.selectedStyle.title
    };
  }

  if (formData.countertops?.selectedStyle && itemType === 'countertops') {
    return {
      style: formData.countertops.selectedStyle.style,
      imagePath: formData.countertops.selectedStyle.imagePath,
      title: formData.countertops.selectedStyle.title
    };
  }

  return null;
};

/**
 * Updates category total based on item and type
 * @param {number} currentTotal - Current category total
 * @param {Object} item - Item being added
 * @param {string} itemType - Type of item
 * @returns {number} Updated category total
 */
const updateCategoryTotal = (currentTotal, item, itemType) => {
  if (itemType === 'backsplash') {
    return item.subtotal;
  }
  return currentTotal + item.subtotal;
};

/**
 * Converts calculator estimate data to QuickBooks Online estimate format
 * @param {Object} calculatorEstimate - The calculator's estimate data
 * @param {string} customerId - The QuickBooks customer ID
 * @returns {Object} QBO formatted estimate data
 */
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

/**
 * Generates a UUID v4
 * @returns {string} UUID string
 */
const generateUUID = () => {
  let dt = new Date().getTime();
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

/**
 * Calculates kitchen dimensions from form data
 * @param {Object} formData - The submitted form data
 * @returns {Object} Kitchen and island dimensions
 */
const calculateDimensions = (formData) => {
  const kitchenLength = formData.kitchenSize.length / 12;
  const kitchenWidth = formData.kitchenSize.width / 12;
  const kitchenArea = kitchenLength * kitchenWidth;
  const islandLength = formData.kitchenSize.islandLength / 12;
  const islandWidth = formData.kitchenSize.islandWidth / 12;
  const hasIsland = formData.kitchenSize.hasIsland;
  const islandArea = (islandLength * islandWidth);

  return {
    kitchen: { kitchenLength, kitchenWidth, kitchenArea },
    island: { islandLength, islandWidth, islandArea, hasIsland }
  };
};

/**
 * Calculates item units based on dimensions and type
 * @param {string} itemType - Type of item being calculated
 * @param {Object} dimensions - Kitchen dimensions
 * @param {Object} formData - Form data
 * @param {Object} category - Category data
 * @returns {number} Calculated units
 */
const calculateUnits = (itemType, dimensions, formData, category) => {
  console.log("** calculateUnits **");
  if(itemType === 'Tile') console.log("itemType: ", itemType);
  const { kitchenLength, kitchenWidth, kitchenArea } = dimensions.kitchen;
  const { hasIsland, islandLength, islandWidth, islandArea } = dimensions.island;

  switch (itemType) {
    case 'removeCountertops':
    case 'removeCabinets':
    case 'removeFlooring':
    case 'lightDemo':
    case 'addCanLights':
    case 'addUnderCabinetLights':
    case 'switchesAndOutlets':
    case 'applianceOutlets':
    case 'paintKitchen':
    case 'cleanKitchen':
    case 'Tile':
    case 'Hardwood':
    case 'LVP/Engineered':
      return kitchenArea;

    case 'standardLineCabinets':
    case 'paintStainedCabinets':
    case 'paintPaintedCabinets':
    case 'fullCustomCabinets':
      return ((kitchenLength + kitchenWidth) * calculatorSettings.cabinet_multiplier - 
              calculatorSettings.window_constant - calculatorSettings.appliance_constant + 
              (hasIsland ? islandLength * (islandWidth > (38 / 12) ? 2 : 1) : 0));

    case 'backsplash':
      return ((((kitchenLength + kitchenWidth) * calculatorSettings.countertop_multiplier - 
                calculatorSettings.window_constant - calculatorSettings.appliance_constant)) * 2);

    case 'customColorBase':
      return (((kitchenLength + kitchenWidth) * calculatorSettings.cabinet_multiplier - 
              calculatorSettings.window_constant - calculatorSettings.appliance_constant) / 2 + 
              ((hasIsland ? (islandArea * (kitchenWidth > (38 / 12)) ? 2 : 1) : 0)));

    case 'customColorWall':
      const cabinetUnits = category.items.find(item => item.name === 'standardLineCabinets')?.calculatedUnits ?? 0;
      const customColorBase = category.items.find(item => item.name === 'customColorBase')?.calculatedUnits ?? 0;
      return cabinetUnits - customColorBase;

    case 'Quartz':
      return (((kitchenLength + kitchenWidth) * calculatorSettings.countertop_multiplier -  calculatorSettings.window_constant - calculatorSettings.appliance_constant) + (hasIsland ? (islandLength * islandWidth) : 0)) * 2.5;

    case 'waterfallEdges':
      return formData.countertops.waterfallEdges;

    case 'swapFixtures':
      return formData.electrical.fixtureCount;

    case 'newFixtures':
      let count = formData.electrical.fixtureCount || 0;
      if (formData.plumbing.installPotFiller) count += 1;
      if (formData.plumbing.installFaucet) count += 1;
      return count;

    default:
      return 1;
  }
};

/**
 * Calculates unit cost based on item type and dimensions
 * @param {Object} dbItem - Database item data
 * @param {string} itemType - Type of item
 * @param {Object} dimensions - Kitchen dimensions
 * @returns {number} Calculated unit cost
 */
const calculateUnitCost = (dbItem, itemType, dimensions) => {
  console.log("** calculateUnitCost **")
  if(itemType === 'Tile') console.log("itemType: ", itemType);
  const { kitchenArea } = dimensions.kitchen;
  const { islandWidth } = dimensions.island;

  switch (itemType) {
    case 'paintKitchen':
      return Math.max((dbItem.sqftPrice * kitchenArea), 500);

    case 'waterfallEdges':
      const base = 65;
      const multiplier = 3;
      return (base * islandWidth * multiplier);

    case 'cleanKitchen':
      return dbItem.sqftPrice * kitchenArea;

    default:
      return dbItem.unitCost ?? 1;
  }
};

/**
 * Processes form data and generates estimate
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const processFormData = async (req, res) => {
  try {
    const formData = req?.body;
    console.log("Processing form data:", formData);

    // Initialize response data
    const responseData = { estimate: await calculateEstimate(formData) };

    // Handle integrations
    try {
      const integrationData = await handleIntegrations(formData, responseData.estimate);
      Object.assign(responseData, integrationData);
    } catch (integrationError) {
      console.error('Integration error:', integrationError);
      responseData.integrationError = integrationError.message;
    }

    // Save visitor data
    try {
      await saveVisitorData(formData, responseData.estimate);
    } catch (visitorError) {
      console.error('Error saving visitor data:', visitorError);
      responseData.visitorError = visitorError.message;
    }

    res.status(200).send(responseData);
  } catch (error) {
    console.error('Error processing form data:', error);
    res.status(500).send({ error: 'Error processing form data' });
  }
};

/**
 * Calculates the complete estimate from form data
 * @param {Object} formData - The submitted form data
 * @returns {Object} Complete estimate data
 */
const calculateEstimate = async (formData) => {
  const dimensions = calculateDimensions(formData);
  const estimate = {
    categories: [],
    overallTotal: 0,
    dimensions,
    id: generateUUID(),
    displayName: `Estimate ${new Date().toLocaleDateString("en-US")}`,
  };

  // Process each category
  for (const categoryName in formData) {
    if (categoryName === 'kitchenSize') continue;

    const category = {
      category: categoryName,
      items: [],
      categoryTotal: 0
    };

    const formCategory = formData[categoryName];
    await processCategory(category, formCategory, categoryName, formData, dimensions);

    // Apply category minimum if applicable
    if (categoryMinimums[categoryName] && category.categoryTotal > 0 && 
        category.categoryTotal < categoryMinimums[categoryName]) {
      category.categoryTotal = categoryMinimums[categoryName];
    }

    estimate.categories.push(category);
    estimate.overallTotal += category.categoryTotal;
  }

  // Calculate estimate ranges
  const rng = (Math.floor(Math.random() * 75) + 1) / 10000;
  estimate.rng = rng;
  estimate.lowRange = estimate.overallTotal - (estimate.overallTotal * (calculatorSettings.lowBuffer + rng));
  estimate.highRange = estimate.overallTotal + (estimate.overallTotal * (calculatorSettings.highBuffer + rng));

  return estimate;
};

/**
 * Processes a single category for the estimate
 * @param {Object} category - Category object being processed
 * @param {Object} formCategory - Form data for the category
 * @param {string} categoryName - Name of the category
 * @param {Object} formData - Complete form data
 * @param {Object} dimensions - Kitchen dimensions
 */
const processCategory = async (category, formCategory, categoryName, formData, dimensions) => {
  if (categoryName === 'newFixtures') {
    formCategory.newFixtures = true;
  }

  for (const itemName in formCategory) {
    console.log("itemName: ", itemName)
    const dbNeddle = getDbNeddle(itemName, categoryName, formData);
    const itemsNeddle = getItemsNeddle(itemName, categoryName, formData);
    const dbItem = dbItems[dbNeddle];

    if (formCategory[itemName] && dbItem) {
      const item = createEstimateItem(dbItem, itemsNeddle, formData, dimensions, category);
      if (item) {
        category.items.push(item);
        category.categoryTotal = updateCategoryTotal(category.categoryTotal, item, dbNeddle);
      }
    }
  }
};

/**
 * Handles third-party integrations (QBO and Hatch)
 * @param {Object} formData - The submitted form data
 * @param {Object} estimate - The calculated estimate
 * @returns {Object} Integration results
 */
const handleIntegrations = async (formData, estimate) => {
  const results = {};
  const contactInfo = formData.user || {};

  // QBO Integration
  try {
    let customer = await qboClient.findCustomerByEmail(contactInfo.email);
    
    if (!customer) {
      console.log("customer not found")
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

    const qboEstimateData = createQboEstimateData(estimate, customer.Id);
    // console.log("** qboEstimateData: ",JSON.stringify(qboEstimateData,null,2))
    // const qboEstimate = await qboClient.createEstimate(qboEstimateData);
    // const estimatePdf = await qboClient.getEstimatePdf(qboEstimate.Id);

    results.qbo = { customer, estimate: qboEstimate, pdf: estimatePdf };
    estimate.qboId = qboEstimate.Id;

    // Hatch Integration
    try {
      await sendToHatch({
        ...customer,
        estimate: {
          lowRange: estimate.lowRange,
          highRange: estimate.highRange
        }
      });
    } catch (hatchError) {
      results.hatchError = hatchError.message;
    }
  } catch (qboError) {
    results.qboError = qboError.message;
  }

  return results;
};

/**
 * Saves visitor data to the database
 * @param {Object} formData - The submitted form data
 * @param {Object} estimate - The calculated estimate
 */
const saveVisitorData = async (formData, estimate) => {
  const { id, ...contactInfoData } = formData.user;
  const visitor = {
    contactInfo: contactInfoData,
    calculatorSettingsValue: {
      rng: estimate.rng,
      lowBuffer: calculatorSettings.lowBuffer,
      highBuffer: calculatorSettings.highBuffer
    },
    estimates: [estimate]
  };

  await updateVisitor({ body: { id: formData.user.id, data: visitor } });
};