# Guest Orders Implementation

## Overview
This implementation allows orders to be created without requiring user authentication. Guests can place orders by providing their email address for order notifications.

## Changes Made

### 1. Entity Updates
- **Order Entity** (`src/orders/entities/order.entity.ts`):
  - Made `user` field nullable: `user: UserEntity | null`
  - Added `{ nullable: true }` to the `@ManyToOne` relationship

### 2. New DTO
- **Create Guest Order DTO** (`src/orders/dto/create-guest-order.dto.ts`):
  - Extends `CreateOrderDto` with additional fields for guest information
  - Required: `customerEmail` (for order notifications)
  - Optional: `customerName`, `customerPhone`

### 3. Controller Updates
- **Orders Controller** (`src/orders/orders.controller.ts`):
  - Added new endpoint: `POST /orders/guest`
  - No authentication required for guest orders
  - Uses `CreateGuestOrderDto` for validation

### 4. Service Updates
- **Orders Service** (`src/orders/orders.service.ts`):
  - Added `createGuestOrder()` method
  - Updated all email notification logic to handle null users
  - Guest orders automatically send confirmation emails to provided email address

## API Usage

### Create Guest Order
```http
POST /orders/guest
Content-Type: application/json

{
  "customerEmail": "customer@example.com",
  "customerName": "John Doe",
  "customerPhone": "+1234567890",
  "shippingAddress": {
    "name": "John Doe",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "postalCode": "10001",
    "state": "NY",
    "country": "USA"
  },
  "products": [
    {
      "id": 1,
      "product_quantity": 2
    }
  ]
}
```

### Response
```json
{
  "id": 123,
  "orderAt": "2025-01-12T16:00:00.000Z",
  "status": "processing",
  "user": null,
  "shippingAddress": {
    "name": "John Doe",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "postalCode": "10001",
    "state": "NY",
    "country": "USA"
  },
  "products": [
    {
      "id": 1,
      "product_quantity": 2,
      "product_unit_price": 29.99,
      "product": {
        "id": 1,
        "name": "Product Name",
        "price": 29.99
      }
    }
  ],
  "totalAmount": 59.98
}
```

## Database Migration Required

Before deploying to production, you need to run a database migration to make the `user` field nullable in the `orders` table:

```sql
ALTER TABLE orders ALTER COLUMN userId DROP NOT NULL;
```

Or using TypeORM CLI:
```bash
npm run migration:generate -- db/migrations/make-order-user-nullable
npm run migration:run
```

## Features

### ✅ Implemented
- Guest order creation without authentication
- Email notifications for guest orders
- Proper null handling for user references
- Stock validation for guest orders
- Order status updates work for both user and guest orders

### ⚠️ Considerations
- Guest orders cannot be retrieved by customer (no authentication)
- Guest orders don't have cart functionality
- Admin can still manage guest orders through existing endpoints
- Email notifications are sent to the provided guest email address

## Testing

### Test the Guest Order Endpoint
```bash
# Test with valid data
curl -X POST http://localhost:3000/orders/guest \
  -H "Content-Type: application/json" \
  -d '{
    "customerEmail": "test@example.com",
    "customerName": "Test User",
    "shippingAddress": {
      "name": "Test User",
      "phone": "+1234567890",
      "address": "123 Test St",
      "city": "Test City",
      "postalCode": "12345",
      "state": "TS",
      "country": "USA"
    },
    "products": [
      {
        "id": 1,
        "product_quantity": 1
      }
    ]
  }'
```

### Test Email Validation
```bash
# Test with invalid email
curl -X POST http://localhost:3000/orders/guest \
  -H "Content-Type: application/json" \
  -d '{
    "customerEmail": "invalid-email",
    "shippingAddress": {...},
    "products": [...]
  }'
```

## Future Enhancements

Potential improvements for guest orders:

1. **Guest Order Tracking**: Add order tracking by email and order ID
2. **Guest Cart**: Allow guests to build a cart before checkout
3. **Guest Account Conversion**: Allow guests to create accounts after ordering
4. **Order History**: Allow guests to view their order history by email
5. **Guest Shipping Addresses**: Save guest shipping addresses temporarily