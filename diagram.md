```mermaid
classDiagram
    class ExpressServer {
        +PORT: number
        +use(middleware)
        +listen(port)
        +setupRoutes()
    }
    class VueRouter {
        +history: WebHistory
        +routes: Route[]
        +createRouter()
        +createWebHistory()
    }
    class Views {
        +CalculatorView
        +AdminView
        +CalendarView
        +EmailView
        +QBOView
    }
    class FormHandler {
        -dbItems: JSON
        -categoryMinimums: JSON
        -calculatorSettings: JSON
        +processFormData(req, res)
        -calculateTotalCost()
        -isSelected()
        -updateVisitor()
    }
    class EmailService {
        -GMAIL_USER: string
        -GMAIL_PASS: string
        +sendEmail(req, res)
        -createTransporter()
    }
    class JSONData {
        +items.json
        +categoryMinimums.json
        +calculatorSettings.json
        +visitors.json
    }
    class EstimateCalculator {
        +categories: array
        +overallTotal: number
        +lowRange: number
        +highRange: number
        -calculateUnitCost()
        -calculateSubtotal()
    }
    class QBOController {
        -oauth2_token_json: string
        -oauthClient: OAuthClient
        +showToken(req, res)
        +authUri(req, res)
        +callback(req, res)
        +refreshAccessToken(req, res)
        +disconnect(req, res)
        +companyInfo(req, res)
    }
    class APIRoutes {
        +/submit-form
        +/send-email
        +/qbo/*
        +/admin/*
        +/update-category
        +/update-item
        +/update-visitor
    }
    class JSONUpdater {
        +updateCategorySetting(req, res)
        +updateItem(req, res)
        -writeFile()
        -handleError()
    }
    class VisitorManager {
        +updateVisitor(req, res)
        -readVisitorData()
        -writeVisitorData()
        +getVisitor(id)
    }
    class Visitor {
        +id: string
        +contactInfo: object
        +calculatorSettings: object
        +estimate: object
        -categories: array
    }
    class ItemsView {
        -dbItems: ref
        -selectedItem: ref
        -itemName: ref
        -isModalVisible: ref
        +selectItem(item, key)
        +closeModal()
        +saveItem(updatedItem)
    }
    class ItemSettingsView {
        -itemCopy: ref
        +handleSave()
        +handleClose()
    }

    VueRouter --> Views : routes
    Views ..> APIRoutes : HTTP Requests
    Views --> ItemsView
    APIRoutes --> FormHandler : processes form
    APIRoutes --> EmailService : sends emails
    APIRoutes --> QBOController : handles QBO
    APIRoutes --> JSONUpdater : updates settings
    APIRoutes --> VisitorManager : manages visitors
    FormHandler --> JSONData : reads
    JSONUpdater --> JSONData : writes
    VisitorManager --> JSONData : reads/writes
    FormHandler --> EstimateCalculator : calculates
    EmailService ..> nodemailer : uses
    VisitorManager --> Visitor : manages
    ItemsView --> ItemSettingsView : opens modal for editing

    note for FormHandler "Processes calculator form\nCalculates estimates\nUpdates visitor data"
    note for EmailService "Handles email sending\nvia Gmail SMTP"
    note for JSONData "Configuration files:\n- Items\n- Category minimums\n- Calculator settings\n- Visitor data"
    note for EstimateCalculator "Calculates total costs\nApplies markups\nHandles category minimums"
    note for JSONUpdater "Handles updates to:\n- Category minimums\n- Item settings"
    note for VisitorManager "Manages visitor data:\n- Create/Update visitors\n- Persist visitor data\n- Handle estimates"
    note for ItemsView "Manages item list\nHandles item selection and updates"
    note for ItemSettingsView "Allows editing of selected items\nEmits save and close events"
