<template>
    <div class="container">
        <h1>
            <a href="http://developer.intuit.com">
                <img src="./images/quickbooks_logo_horz.png" id="headerLogo" alt="QuickBooks Logo">
            </a>
        </h1>
        <hr>
        <div class="well text-center">
            <h1>intuit-nodejsclient Sample Application</h1>
            <br>
        </div>
        <h2>OAuth2.0</h2>
        <h4>( Please enter the client credentials below )</h4>
        <br>
        <form @submit.prevent>
            <div class="form-group">
                <label for="clientId">Client ID</label>
                <input type="text" class="form-control" placeholder="Enter the Client ID" v-model="clientId"
                    id="clientId" />
            </div>
            <div class="form-group">
                <label for="clientSecret">Client Secret</label>
                <input type="text" class="form-control" placeholder="Enter the Client Secret" v-model="clientSecret"
                    id="clientSecret" />
            </div>
            <div class="form-group">
                <label for="environment">Environment</label>
                <select id="environment" class="form-control" v-model="environment">
                    <option value="sandbox" selected>Sandbox</option>
                    <option value="production">Production</option>
                </select>
            </div>
            <div class="form-group">
                <label for="redirectUri">Redirect URI</label>
                <input type="text" class="form-control" placeholder="Enter the Redirect URI" v-model="redirectUri"
                    id="redirectUri" />
                <br>
            </div>
        </form>
        <p>
            Now click the <b>Connect to QuickBooks</b> button below.
        </p>
        <pre>{{ accessToken }}</pre>
        <a class="imgLink" href="#" @click.prevent="authorizeUri">
            <img src="./images/C2QB_green_btn_lg_default.png" width="178" alt="Connect to QuickBooks" />
        </a>
        <button type="button" @click.prevent="addCustomer" class="btn btn-success">
            Display Access Token
        </button>
        <button type="button" @click.prevent="refreshToken" class="btn btn-success">
            Refresh Token
        </button>
        <hr />

        <h2>Make an API Call</h2>
        <h4>
            ( Please refer to our
            <a target="_blank" href="https://developer.intuit.com/v2/apiexplorer?apiname=V3QBO#?id=Account">API
                Explorer</a>
            )
        </h4>
        <p>
            If there is no access token or the access token is invalid, click either the
            <b>Connect to QuickBooks</b> or <b>Sign with Intuit</b> button above.
        </p>
        <pre>{{ company }}</pre>
        <button type="button" @click.prevent="getCompany" class="btn btn-success">
            Get Company Info
        </button>

        <hr />

        <p>More info:</p>
        <ul>
            <li>
                <a href="https://developer.intuit.com/docs">Intuit API Developer Guide</a>
            </li>
            <li>
                <a href="https://developer.intuit.com/docs/00_quickbooks_online/2_build/50_sample_apps_and_code">Intuit
                    Sample Apps and Code</a>
            </li>
            <li>
                <a href="https://developer.intuit.com/docs/00_quickbooks_online/2_build/40_sdks">Intuit Official
                    SDKs</a>
            </li>
        </ul>
        <hr>
        <p class="text-center text-muted">
            &copy; 2018 Intuit&trade;, Inc. All rights reserved. Intuit and QuickBooks are registered trademarks of
            Intuit Inc.
        </p>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

// Reactive state variables
const clientId = ref('')
const clientSecret = ref('')
const environment = ref('sandbox')
const redirectUri = ref('')
const accessToken = ref('')
const company = ref('')

// Function to authorize URI
const authorizeUri = async () => {
    const jsonBody = {
        clientId: clientId.value,
        clientSecret: clientSecret.value,
        environment: environment.value,
        redirectUri: redirectUri.value,
    }
    console.log("jsonBody: ", jsonBody)
    try {
        const response = await axios.get('http://localhost:3000/authUri', {
            params: { json: JSON.stringify(jsonBody) },
        })
        const uri = response.data
        console.log('The Auth URI is:', uri)

        const parameters = `location=1,width=800,height=650,left=${(window.screen.width - 800) / 2
            },top=${(window.screen.height - 650) / 2}`
        const win = window.open(uri, 'connectPopup', parameters)

        //   const pollOAuth = setInterval(() => {
        //     try {
        //       if (win.document.URL.includes('code')) {
        //         clearInterval(pollOAuth)
        //         win.close()
        //         window.location.reload()
        //       }
        //     } catch (e) {
        //       console.log(e)
        //     }
        //   }, 100)
    } catch (error) {
        console.error('Error fetching authUri:', error)
    }
}

// Function to retrieve token
const retrieveToken = async () => {
    try {
        const response = await axios.get('http://localhost:3000/retrieveToken')
        const token = response.data
        accessToken.value = token || 'Please authorize using Connect to QuickBooks first!'
    } catch (error) {
        console.error('Error retrieving token:', error)
    }
}

const getCustomer = async () => {
    try {
        const response = await axios.get('http://localhost:3000/getCustomer')
        const token = response.data
        accessToken.value = !token ? 'Please authorize using Connect to QuickBooks first!' : token
    } catch (error) {
        console.error('Error retrieving token:', error)
    }
}

// Function to refresh token
const refreshToken = async () => {
    try {
        const response = await axios.get('http://localhost:3000/refreshAccessToken')
        const token = response.data
        accessToken.value = token || 'Please authorize using Connect to QuickBooks first!'
    } catch (error) {
        console.error('Error refreshing token:', error)
    }
}

const addCustomer = async () => {
    const customer = {
        "BillAddr": {
            "Line1": "4581 Finch St.",
            "City": "Bayshore",
            "CountrySubDivisionCode": "CA",
            "PostalCode": "94326"
        },
        "CurrencyRef": {
            "value": "USD",
            "name": "United States Dollar"
        },
        "IsProject": false,
        "DisplayName": "A customer",
        "Active": true,
        "PrimaryPhone": {
            "FreeFormNumber": "(650) 555-3991"
        },
        "PrimaryEmailAddr": {
            "Address": "B@Intuit.com"
        }
    }



    const response = await axios.post('http://localhost:3000/addCustomer', customer);
    let projectResponse = null;
    let customerCreated = false;
    let projectCreated = false;
    let estimateCreated = false;

    if (response.status === 200) {
        customerCreated = true;
        accessToken.value = response.data.Customer;
    }

    if (customerCreated) {
        console.log("customerCreated: ", customerCreated)
        const project = {
            "Job": true,
            "ParentRef": {
                "value": response.data.Customer.Id
            },
            "DisplayName": "Kitchen project",
            "Active": true,
            "BillWithParent": true,
        }
        projectResponse = await axios.post('http://localhost:3000/addCustomer', project);

        if (projectResponse.status === 200) {
            projectCreated = true;
            accessToken.value = projectResponse.data.Customer;
        }
    }

    if (projectCreated) {
        console.log("projectCreated: ", projectCreated)
        let estimate = {
            "CustomField": [
                {
                    "DefinitionId": "1",
                    "Name": "companyId",
                    "Type": "StringType"
                }
            ],
            "Line": [
                {
                    "Id": "1",
                    "LineNum": 1,
                    "Description": "Rock Fountain",
                    "Amount": 275,
                    "DetailType": "SalesItemLineDetail",
                    "SalesItemLineDetail": {
                        "ItemRef": {
                            "value": "5",
                            "name": "Rock Fountain"
                        },
                        "UnitPrice": 275,
                        "Qty": 1,
                        "ItemAccountRef": {
                            "value": "48",
                            "name": "Landscaping Services:Job Materials:Fountains and Garden Lighting"
                        },
                        "TaxCodeRef": {
                            "value": "TAX"
                        }
                    }
                },
                {
                    "Id": "2",
                    "LineNum": 2,
                    "Description": "Fountain Pump",
                    "Amount": 12.75,
                    "DetailType": "SalesItemLineDetail",
                    "SalesItemLineDetail": {
                        "ItemRef": {
                            "value": "11",
                            "name": "Pump"
                        },
                        "UnitPrice": 12.75,
                        "Qty": 1,
                        "ItemAccountRef": {
                            "value": "48",
                            "name": "Landscaping Services:Job Materials:Fountains and Garden Lighting"
                        },
                        "TaxCodeRef": {
                            "value": "TAX"
                        }
                    }
                },
                {
                    "Id": "3",
                    "LineNum": 3,
                    "Description": "Concrete for fountain installation",
                    "Amount": 47.5,
                    "DetailType": "SalesItemLineDetail",
                    "SalesItemLineDetail": {
                        "ItemRef": {
                            "value": "3",
                            "name": "Concrete"
                        },
                        "UnitPrice": 9.5,
                        "Qty": 5,
                        "ItemAccountRef": {
                            "value": "48",
                            "name": "Landscaping Services:Job Materials:Fountains and Garden Lighting"
                        },
                        "TaxCodeRef": {
                            "value": "TAX"
                        }
                    }
                },
                {
                    "Amount": 335.25,
                    "DetailType": "SubTotalLineDetail",
                    "SubTotalLineDetail": {}
                }
            ],
            "CustomerRef": {
                "value": projectResponse.data.Customer.Id,
            },
            "CustomerMemo": {
                "value": "Thank you for your business and have a great day!"
            },
            "PrintStatus": "NeedToPrint",
            "EmailStatus": "NotSet"
        }
        console.log("estimate: ", estimate)

        const esitmateResponse = await axios.post('http://localhost:3000/createEstimate', estimate);

        if (esitmateResponse.status === 200) {
            estimateCreated = true;
            console.log(esitmateResponse.data)
            accessToken.value = esitmateResponse.data.Estimate;
        }else {
            console.log(esitmateResponse);
        }
    }

}

// Function to make API call
const getCompany = async () => {
    try {
        const response = await axios.get('http://localhost:3000/getCompanyInfo')
        const data = response.data
        company.value = !data ? 'Please authorize using Connect to QuickBooks first!' : JSON.stringify(data, null, 4)
    } catch (error) {
        console.error('Error making API call:', error)
    }
}

const createEstimate = async () => {
    {
        let estimate = {
            "Line": [
                {
                    "Id": "1",
                    "LineNum": 1,
                    "Description": "Rock Fountain",
                    "Amount": 275,
                    "DetailType": "SalesItemLineDetail",
                    "SalesItemLineDetail": {
                        "ItemRef": {
                            "value": "5",
                            "name": "Rock Fountain"
                        },
                        "UnitPrice": 275,
                        "Qty": 1,
                        "ItemAccountRef": {
                            "value": "48",
                            "name": "Landscaping Services:Job Materials:Fountains and Garden Lighting"
                        },
                        "TaxCodeRef": {
                            "value": "TAX"
                        }
                    }
                },
                {
                    "Id": "2",
                    "LineNum": 2,
                    "Description": "Fountain Pump",
                    "Amount": 12.75,
                    "DetailType": "SalesItemLineDetail",
                    "SalesItemLineDetail": {
                        "ItemRef": {
                            "value": "11",
                            "name": "Pump"
                        },
                        "UnitPrice": 12.75,
                        "Qty": 1,
                        "ItemAccountRef": {
                            "value": "48",
                            "name": "Landscaping Services:Job Materials:Fountains and Garden Lighting"
                        },
                        "TaxCodeRef": {
                            "value": "TAX"
                        }
                    }
                },
                {
                    "Id": "3",
                    "LineNum": 3,
                    "Description": "Concrete for fountain installation",
                    "Amount": 47.5,
                    "DetailType": "SalesItemLineDetail",
                    "SalesItemLineDetail": {
                        "ItemRef": {
                            "value": "3",
                            "name": "Concrete"
                        },
                        "UnitPrice": 9.5,
                        "Qty": 5,
                        "ItemAccountRef": {
                            "value": "48",
                            "name": "Landscaping Services:Job Materials:Fountains and Garden Lighting"
                        },
                        "TaxCodeRef": {
                            "value": "TAX"
                        }
                    }
                }
            ],
            "CustomerRef": {
                "value": 104,
            }
        }
        console.log("estimate: ", estimate)
        esitmateResponse = await axios.post('http://localhost:3000/createEstimate', estimate);

        if (esitmateResponse.status === 200) {
            estimateCreated = true;
            console.log(esitmateResponse.data)
            accessToken.value = esitmateResponse.data.Customer;
        }else {
            console.log(esitmateResponse);
        }
    }
}
</script>

<style scoped>
/* Import Bootstrap CSS */
@import "https://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css";
@import "https://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap-theme.min.css";

/* Import custom CSS */
@import "./common.css";

#headerLogo {
    max-width: 100%;
    height: auto;
}

.imgLink img {
    cursor: pointer;
}

.container {
    max-width: 100%;
}
</style>