# VazhipaduBook Firestore Security Specification

## 1. Data Invariants
1. **Default Deny:** All unspecified Firestore paths are denied by default (`/{document=**}`).
2. **PII Isolation (`users/{userId}`):** User profile documents contain PII (`email`, `phone`). Only the authenticated owner (`request.auth.uid == userId`) can `get`, `create`, or `update` their own profile. `list` and `delete` on `/users` are strictly denied.
3. **Immutable Booking Receipts (`bookings/{bookingId}`):** Completed bookings have `paymentStatus == "SUCCESS"` (terminal state). Once created by the authenticated owner (`incoming().userId == request.auth.uid`), bookings cannot be modified or deleted via client SDKs.
4. **Secure List Queries:** `allow list` on `/bookings` explicitly enforces `resource.data.userId == request.auth.uid`, preventing any cross-user query scraping.
5. **Temporal Integrity:** `createdAt` and `lastLoginAt` are strictly enforced to equal `request.time`, and `createdAt` is immutable on update.
6. **Strict Schema & Size Bounds:** Every write validates `keys().hasAll(...)` and `keys().hasOnly(...)` to block shadow fields, enforces `.size()` limits on all strings and the `items` array (`1 <= items.size() <= 25`), and validates numeric arithmetic (`totalAmount == subtotalAmount + convenienceFee + deliveryFee`).

## 2. The "Dirty Dozen" Adversarial Payloads (Must Return PERMISSION_DENIED)
1. **Unauthenticated Booking Create:** `auth: null`, `create /bookings/PKD-2026-1001`.
2. **Cross-User Spoofed `userId` on Booking Create:** `auth.uid: "userA"`, payload `userId: "userB"`.
3. **Cross-User PII Read (`users`):** `auth.uid: "userA"`, `get /users/userB`.
4. **Blanket User List Scraping:** `auth.uid: "userA"`, `list /users`.
5. **Cross-User Booking List Query:** `auth.uid: "userA"`, `list /bookings` without `where("userId", "==", "userA")`.
6. **Shadow / Ghost Field Injection:** `create /bookings/PKD-2026-1002` with extra field `isAdminVerified: true`.
7. **Privilege Escalation on User Profile:** `create /users/userA` with extra field `role: "admin"`.
8. **Invalid Document ID Poisoning:** `create /bookings/../../admin$123` (fails `isValidId`).
9. **Client-Spoofed Timestamp:** `create /bookings/PKD-2026-1003` with `createdAt: Timestamp(2020-01-01)` instead of `serverTimestamp()`.
10. **Tampered Total Amount:** `create /bookings/PKD-2026-1004` with `subtotalAmount: 200, convenienceFee: 5, deliveryFee: 0, totalAmount: 1`.
11. **Speed Post Without Address:** `create /bookings/PKD-2026-1005` with `prasadamDelivery: "Speed Post"` and `deliveryAddress: ""`.
12. **Terminal State Mutation / Tampering:** `update /bookings/PKD-2026-1001` attempting to modify `totalAmount` or `paymentStatus`.
