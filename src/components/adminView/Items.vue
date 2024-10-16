<script>
import ItemSettings from './ItemSettings.vue';

export default {
    components: {
        ItemSettings // Register the component here
    },
    data() {
        return {
            dbItems: {
                removeSink: {
                    qboId: '1',
                    calculatedUnits: false,
                    sqftPrice: false,
                    unitCost: 150,
                    markup: 0.65,
                },
                removeCountertops: {
                    qboId: '2',
                    calculatedUnits: false,
                    sqftPrice: 2,
                    unitCost: false,
                    markup: 0.65,
                },
                removeCabinets: {
                    qboId: '3',
                    calculatedUnits: false,
                    sqftPrice: 4,
                    unitCost: false,
                    markup: 0.65,
                },
                removeBacksplash: {
                    qboId: '4',
                    calculatedUnits: false,
                    sqftPrice: false,
                    unitCost: 300,
                    markup: 0.65,
                },
                removeFlooring: {
                    qboId: '5',
                    calculatedUnits: false,
                    sqftPrice: 2,
                    unitCost: false,
                    markup: 0.65,
                },
                lightDemo: {
                    qboId: '6',
                    calculatedUnits: false,
                    sqftPrice: 9,
                    unitCost: false,
                    markup: 0.65,
                },
                anyDemoSelected: {
                    qboId: '7',
                    calculatedUnits: false,
                    sqftPrice: false,
                    unitCost: 425,
                    markup: 0.65,
                },
                moveSink: {
                    qboId: '8',
                    calculatedUnits: false,
                    sqftPrice: false,
                    unitCost: 650,
                    markup: 0.65,
                },
                moveFridgeWater: {
                    qboId: '9',
                    calculatedUnits: false,
                    sqftPrice: false,
                    unitCost: 650,
                    markup: 0.65,
                },
                installPotFiller: {
                    qboId: '10',
                    calculatedUnits: false,
                    sqftPrice: false,
                    unitCost: 1050,
                    markup: 0.65,
                },
                installFaucet: {
                    qboId: '11',
                    calculatedUnits: false,
                    sqftPrice: false,
                    unitCost: 400,
                    markup: 0.65,
                },
                installDisposal: {
                    qboId: '12',
                    calculatedUnits: false,
                    sqftPrice: false,
                    unitCost: 400,
                    markup: 0.65,
                },
                addGasLine: {
                    qboId: '13',
                    calculatedUnits: false,
                    sqftPrice: false,
                    unitCost: 1500,
                    markup: 0.65,
                },
                swapFixtures: {
                    qboId: '14',
                    calculatedUnits: false,
                    sqftPrice: false,
                    unitCost: 150,
                    markup: 0.65,
                },
                addCanLights: {
                    qboId: '15',
                    calculatedUnits: false,
                    sqftPrice: 5,
                    unitCost: false,
                    markup: 0.65,
                },
                addUnderCabinetLights: {
                    qboId: '16',
                    calculatedUnits: false,
                    sqftPrice: 2,
                    unitCost: false,
                    markup: 0.65,
                },
                switchesAndOutlets: {
                    qboId: '17',
                    calculatedUnits: false,
                    sqftPrice: 3,
                    unitCost: false,
                    markup: 0.65,
                },
                applianceOutlets: {
                    qboId: '18',
                    calculatedUnits: false,
                    sqftPrice: 6,
                    unitCost: false,
                    markup: 0.65,
                },
                drywallRepair: {
                    qboId: '19',
                    calculatedUnits: false,
                    sqftPrice: false,
                    unitCost: 850,
                    markup: 0.65,
                },
                paintStainedCabinets: {
                    qboId: '20',
                    calculatedUnits: (formData) => {/* calculation logic */ },
                    sqftPrice: false,
                    unitCost: 220,
                    markup: 0.65,
                },
                paintPaintedCabinets: {
                    qboId: '21',
                    calculatedUnits: (formData) => {/* calculation logic */ },
                    sqftPrice: false,
                    unitCost: 175,
                    markup: 0.65,
                },
                standardLineCabinets: {
                    qboId: '22',
                    calculatedUnits: (formData) => {/* calculation logic */ },
                    sqftPrice: false,
                    unitCost: 317.50,
                    markup: 0.65,
                },
                customColorBase: {
                    qboId: '23',
                    calculatedUnits: (formData) => {/* calculation logic */ },
                    sqftPrice: false,
                    unitCost: 80,
                    markup: 0.65,
                },
                customColorWall: {
                    qboId: '24',
                    calculatedUnits: (formData) => {/* calculation logic */ },
                    sqftPrice: false,
                    unitCost: 80,
                    markup: 0.65,
                },
                fullCustomCabinets: {
                    qboId: '25',
                    calculatedUnits: (formData) => {/* calculation logic */ },
                    sqftPrice: false,
                    unitCost: 1060,
                    markup: 0.65,
                },
                noCabinets: {
                    qboId: '26',
                    calculatedUnits: (formData) => {/* calculation logic */ },
                    sqftPrice: false,
                    unitCost: 0,
                    markup: 0,
                },
                'countertops:Granite': {
                    qboId: '27',
                    calculatedUnits: (formData) => {/* calculation logic */ },
                    sqftPrice: false,
                    unitCost: 60,
                    markup: 0.65,
                },
                'countertops:Quartz': {
                    qboId: '28',
                    calculatedUnits: (formData) => {/* calculation logic */ },
                    sqftPrice: false,
                    unitCost: 60,
                    markup: 0.65,
                },
                'countertops:Solid-Surface': {
                    qboId: '29',
                    calculatedUnits: (formData) => {/* calculation logic */ },
                    sqftPrice: false,
                    unitCost: 55,
                    markup: 0.65,
                },
                'countertops:Butcher Block': {
                    qboId: '30',
                    calculatedUnits: (formData) => {/* calculation logic */ },
                    sqftPrice: false,
                    unitCost: 50,
                    markup: 0.65,
                },
                'newSink:Workstation': {
                    qboId: '31',
                    calculatedUnits: false,
                    sqftPrice: false,
                    unitCost: 850,
                    markup: 0.65,
                },
                newRange: {
                    qboId: '32',
                    calculatedUnits: false,
                    sqftPrice: false,
                    unitCost: 1000,
                    markup: 0,
                },
                newCooktop: {
                    qboId: '33',
                    calculatedUnits: false,
                    sqftPrice: false,
                    unitCost: 1250,
                    markup: 0,
                },
                newWallOven: {
                    qboId: '34',
                    calculatedUnits: false,
                    sqftPrice: false,
                    unitCost: 1500,
                    markup: 0,
                },
                newMicrowave: {
                    qboId: '35',
                    calculatedUnits: false,
                    sqftPrice: false,
                    unitCost: 450,
                    markup: 0,
                },
                newFridge: {
                    qboId: '36',
                    calculatedUnits: false,
                    sqftPrice: false,
                    unitCost: 2500,
                    markup: 0,
                },
                newDishwasher: {
                    qboId: '37',
                    calculatedUnits: false,
                    sqftPrice: false,
                    unitCost: 700,
                    markup: 0,
                },
                newRangeHood: {
                    qboId: '38',
                    calculatedUnits: false,
                    sqftPrice: false,
                    unitCost: 800,
                    markup: 0,
                },
                installAppliances: {
                    qboId: '39',
                    calculatedUnits: false,
                    sqftPrice: false,
                    unitCost: 600,
                    markup: 0.65,
                },
                installVentHood: {
                    qboId: '40',
                    calculatedUnits: false,
                    sqftPrice: false,
                    unitCost: 450,
                    markup: 0.65,
                },
                installWallOven: {
                    qboId: '41',
                    calculatedUnits: false,
                    sqftPrice: false,
                    unitCost: 600,
                    markup: 0.65,
                },
                backsplash: {
                    qboId: '42',
                    calculatedUnits: (formData) => {/* calculation logic */ },
                    sqftPrice: 20,
                    unitCost: false,
                    markup: 0.65,
                },
                paintKitchen: {
                    qboId: '43',
                    calculatedUnits: false,
                    sqftPrice: 6,
                    unitCost: (formData) => {/* calculation logic */ },
                    markup: 0.65,
                },
                cleanKitchen: {
                    qboId: '44',
                    calculatedUnits: false,
                    sqftPrice: 1.1,
                    unitCost: (formData) => {/* calculation logic */ },
                    markup: 0.65,
                },
                'flooring:Hardwood': {
                    qboId: '45',
                    calculatedUnits: false,
                    sqftPrice: 9,
                    unitCost: false,
                    markup: 0.65,
                },
                'flooring:Tile': {
                    qboId: '46',
                    calculatedUnits: false,
                    sqftPrice: 13.5,
                    unitCost: false,
                    markup: 0.65,
                },
                'flooring:LVP/Engineered': {
                    qboId: '47',
                    calculatedUnits: false,
                    sqftPrice: 5,
                    unitCost: false,
                    markup: 0.65,
                },
                runExhaustDucting: {
                    qboId: '48',
                    calculatedUnits: false,
                    sqftPrice: false,
                    unitCost: 750,
                    markup: 0.65,
                },
                runDuctingThroughBrick: {
                    qboId: '49',
                    calculatedUnits: false,
                    sqftPrice: false,
                    unitCost: 450,
                    markup: 0.65,
                },
                waterfallEdges: {
                    qboId: '50',
                    calculatedUnits: false,
                    sqftPrice: false,
                    unitCost: (formData) => {/* calculation logic */ },
                    markup: 0.65,
                },
                fixtureCount: {
                    qboId: '51',
                    calculatedUnits: false,
                    sqftPrice: false,
                    unitCost: false,
                    markup: false,
                },
                newFixtures: {
                    qboId: '52',
                    calculatedUnits: (formData) => {/* calculation logic */ },
                    sqftPrice: false,
                    unitCost: 200,
                    markup: 0.0,
                },
            },
            selectedItem: null
        };
    },
    methods: {
        selectItem(item) {
            console.log(item)
            this.selectedItem = item; // Set the clicked item as the selected item
        },
        handleSave(setting) {
            // Logic to handle saving the setting for the selected item
            console.log(`Saving settings for ${this.selectedItem.name}: ${setting}`);
            this.closeSettingsPopup(); // Optionally close after saving
        },
        closeSettingsPopup() {
            this.selectedItem = null; // Clear selectedItem to close the popup
        },
    }
};
</script>

<template>

    <div class="items">
        <h3>Items</h3>

        <ul class="item-list">
            <li v-for="item in Object.keys(dbItems)" :key="dbItems[item].id" @click="selectItem(dbItems[item])" class="item-list">
                {{ item }}
            </li>
        </ul>

        <ItemSettings v-if="selectedItem" :item="selectedItem" @save="handleSave" @close="closeSettingsPopup" />
    </div>
</template>

<style scoped>
.items {
    grid-column: 3 / 3;
    grid-row: 1 / 1;
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 8px;
    background-color: #fff;
    width: 200px;
    height: 500px; /* Set height to 500px */
    overflow-y: auto; /* Add scrolling if content overflows */
  }
  
  .item-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .item-list li {
    margin-bottom: 10px;
    padding: 5px;
    cursor: pointer;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #f9f9f9;
    transition: background-color 0.3s ease;
  }
  
  .item-list li:hover {
    background-color: #e9e9e9;
  }
</style>
