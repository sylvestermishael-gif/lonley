# Security Specification - Zuma Hearth

## Data Invariants
1. A **User** profile must correspond to the `request.auth.uid`.
2. An **Order** must contain valid customer contact info and a non-empty list of items.
3. **Timestamps** (`createdAt`, `updatedAt`) must always be set to `request.time`.
4. **Order Status** can only be transitioned through logical states (not implemented in client yet, but rules will protect).
5. **PII Isolation**: User email and phone in orders are restricted to the owner and admins.

## The "Dirty Dozen" Payloads

1. **Identity Spoofing**: Attempt to create a user profile with a different `uid` than the authenticated user.
2. **PII Leak**: Attempt to read another user's profile or private email.
3. **Shadow Update**: Attempt to update an order with an extra `isVerified: true` field.
4. **Price Manipulation**: Attempt to create an order with a total of `0.01` for expensive items.
5. **State Shortcut**: Attempt to update an order status directly to `completed`.
6. **ID Poisoning**: Attempt to create an order with a 2KB junk character string as the ID.
7. **Resource Exhaustion**: Attempt to create an order with an items array of 10,000 elements.
8. **Owner Hijack**: Attempt to update an existing order's `userId` to a different user.
9. **Timestamp Fraud**: Attempt to set a manual `createdAt` date in the past.
10. **Unauthenticated Write**: Attempt to create a user profile without being signed in.
11. **Malicious ID injection**: Attempting to use `../` or special characters in document paths.
12. **Blanket Query**: Attempting to list all orders without a `userId` filter.

## Test Runner (Conceptual)
The `firestore.rules.test.ts` would verify that all above payloads return `PERMISSION_DENIED`.
