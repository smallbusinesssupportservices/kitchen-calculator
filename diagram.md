```mermaid
classDiagram
    class ExpressApp {
        +PORT: number
        +use(middleware)
        +listen(port)
    }

    class Routes {
        +authUri: endpoint
        +callback: endpoint
        +retrieveToken: endpoint
        +refreshAccessToken: endpoint
        +getCompanyInfo: endpoint
        +disconnect: endpoint
        +submitForm: endpoint
        +updateCalculatorSetting: endpoint
        +updateCategorySetting: endpoint
        +updateItem: endpoint
        +addVisitor: endpoint
        +sendEmail: endpoint
    }

    class Middleware {
        +cors()
        +express.json()
        +express.urlencoded()
    }

    class QBOHandler {
        +authUri()
        +callback()
        +showToken()
        +refreshAccessToken()
        +companyInfo()
        +disconnect()
    }

    class AdminHandler {
        +updateCalculatorSetting()
        +updateCategorySetting()
        +updateItem()
        +updateVisitor()
    }

    class FormHandler {
        +processFormData()
    }

    class EmailHandler {
        +sendEmail()
    }

    class OAuthClient {
        +intuit-oauth functions
    }

    ExpressApp --> Routes : defines
    ExpressApp --> Middleware : uses
    Routes --> QBOHandler : routes to
    Routes --> AdminHandler : routes to
    Routes --> FormHandler : routes to
    Routes --> EmailHandler : routes to
    QBOHandler --> OAuthClient : uses