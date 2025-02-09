# Kitchen Calculator Form Handler Documentation

This document provides a visual representation of how the form handler processes kitchen remodel estimates.

## Main Process Flow

```mermaid
graph TD
    A[Form Submission] --> B[Process Form Data]
    B --> C{Calculate Estimate}
    B --> D{Handle Integrations}
    B --> E{Save Visitor Data}
    
    C --> F[Calculate Dimensions]
    C --> G[Process Categories]
    C --> H[Calculate Ranges]
    
    D --> I[QuickBooks Integration]
    D --> J[Hatch Integration]
    
    E --> K[Update Visitor Record]
    
    I --> L[Find/Create Customer]
    I --> M[Create QBO Estimate]
    I --> N[Generate PDF]
```

## Category Processing Flow

```mermaid
graph TD
    A[Start Category] --> B{Is Kitchen Size?}
    B -->|Yes| C[Skip Processing]
    B -->|No| D[Initialize Category]
    D --> E[Process Each Item]
    E --> F{Is Item Selected?}
    F -->|Yes| G[Calculate Item Cost]
    F -->|No| H[Skip Item]
    G --> I[Add to Category Total]
    I --> J{Below Minimum?}
    J -->|Yes| K[Apply Category Minimum]
    J -->|No| L[Keep Current Total]
```

## Cost Calculation Process

```mermaid
graph TD
    A[Start Calculation] --> B[Get Base Cost]
    B --> C{Has Square Foot Price?}
    C -->|Yes| D[Calculate Area Cost]
    C -->|No| E[Use Unit Cost]
    D --> F[Apply Markup]
    E --> F
    F --> G[Calculate Subtotal]
    G --> H[Add to Total]
```

## Dimensions Calculation

```mermaid
graph TD
    A[Get Kitchen Dimensions] --> B[Convert to Feet]
    B --> C[Calculate Kitchen Area]
    C --> D{Has Island?}
    D -->|Yes| E[Calculate Island Area]
    D -->|No| F[Skip Island]
    E --> G[Total Area Calculation]
    F --> G
```

## Integration Flow

```mermaid
sequenceDiagram
    participant C as Calculator
    participant Q as QuickBooks
    participant H as Hatch
    participant V as Visitor DB
    
    C->>Q: Find/Create Customer
    Q-->>C: Customer Data
    C->>Q: Create Estimate
    Q-->>C: Estimate Data
    C->>Q: Get PDF
    Q-->>C: PDF Document
    C->>H: Send Lead Data
    C->>V: Save Estimate
```

## Data Structure

```mermaid
classDiagram
    class Estimate {
        +Array categories
        +Number overallTotal
        +Object dimensions
        +String id
        +String displayName
        +Number lowRange
        +Number highRange
        +Number rng
    }
    
    class Category {
        +String category
        +Array items
        +Number categoryTotal
    }
    
    class Item {
        +String qboId
        +Number sqftPrice
        +Number markup
        +String name
        +Number unitCost
        +Number calculatedUnits
        +Number unitPrice
        +Number subtotal
        +Object description
    }
    
    Estimate "1" *-- "many" Category
    Category "1" *-- "many" Item
```

## Key Calculations

### Price Calculation Formula
```
Unit Price = Base Cost × (1 + Markup)
```

### Area-Based Price Formula
```
Total = Square Foot Price × Area × (1 + Markup)
```

### Range Calculation
```
Low Range = Total - (Total × (Low Buffer + RNG))
High Range = Total + (Total × (High Buffer + RNG))
```

## Important Notes

1. All measurements are converted from inches to feet
2. Category minimums are enforced when applicable
3. Special handling for:
   - Backsplash calculations
   - Cabinet measurements
   - Waterfall edges
   - Fixture counts

## Integration Points

1. **QuickBooks Online**
   - Customer management
   - Estimate creation
   - PDF generation

2. **Hatch**
   - Lead data transmission
   - Customer information sync

3. **Visitor Database**
   - Estimate history
   - Customer information
   - Calculator settings