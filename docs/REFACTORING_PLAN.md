# Refactoring Plan: Clean Code & Scalability Improvements

**Generated:** 2026-02-19
**Last Updated:** 2026-02-19
**Status:** COMPLETED
**Goal:** Improve maintainability and scalability for future transport service providers (KMB, Citybus, Ferry, etc.)

---

## Executive Summary

After scanning the codebase, **56+ issues** were identified across the following categories:

| Category                   | Count | Priority | Status  |
| -------------------------- | ----- | -------- | ------- |
| Dead code / Unused exports | 12+   | High     | ✅ Done |
| Code duplication           | 8+    | High     | ✅ Done |
| Inconsistent patterns      | 10+   | Medium   | ✅ Done |
| Hard-coded values          | 15+   | Medium   | ✅ Done |
| Missing abstractions       | 6+    | Medium   | ✅ Done |
| Type safety issues         | 5+    | Low      | ✅ Done |

---

## Phase 1: Remove Dead Code (High Priority) - ✅ COMPLETED

### 1.1 Unused Functions in `src/lib/api.ts` - ✅ DONE

**Action:**

- [x] Removed `API_BASE_URL` constant
- [x] Removed `DEFAULT_HEADERS` constant
- [x] Removed `apiFetch` function
- [x] Removed `formatCountdown` function and its tests

### 1.2 Commented-Out Code - ✅ DONE

**Action:**

- [x] Removed commented `getServerSideProps` in `[...params].tsx`

### 1.3 Unused Zod Schemas - ✅ DONE

**Action:**

- [x] Removed entire `src/schemas/` directory

---

## Phase 2: Eliminate Code Duplication (High Priority) - ✅ COMPLETED

### 2.1 Centralize MTR Labels - ✅ DONE

**Created:** `src/constants/mtr-labels.ts`
**Modified:** `MTRArrivalRow.tsx`, `MTREmptyState.tsx`

### 2.2 Extract Row Background Color Utility - ✅ DONE

**Created:** `src/utils/styles.ts` with `getRowBgClass()`

### 2.3 Unify Language Type Definition - ✅ DONE

**Created:** `src/types/language.ts`
**Modified:** `LanguageContext.tsx`, `MTRBoard.tsx`, `MTRArrivalRow.tsx`, `MTREmptyState.tsx`

### 2.4 Consolidate Direction Label Functions - ✅ DONE

**Modified:** `src/data/mtr.ts`

- Merged `getDirectionLabel` and `getDirectionLabelZh` into single function with language parameter
- `getDirectionLabelZh` kept as deprecated wrapper for backward compatibility

### 2.5 Centralize Font Class Logic - ✅ DONE

**Created:** `getLanguageFontClass()` in `src/utils/styles.ts`

---

## Phase 3: Create Centralized Constants (Medium Priority) - ✅ COMPLETED

### 3.1 MTR Theme Constants - ✅ DONE

**Created:** `src/constants/mtr-theme.ts` with:

- `MTR_COLORS` - headerBg, rowAltBg, defaultLine, textPrimary, textInverse
- `MTR_LAYOUT` - headerFlex, paddingX, rowCount
- `MTR_TIMING` - languageToggleMs, clockUpdateMs, arrivingThresholdMs

### 3.2 Board Configuration Constants - ✅ DONE

Constants integrated into `src/constants/mtr-theme.ts` and `src/utils/styles.ts`

---

## Phase 4: Improve Scalability for Future Operators (Medium Priority) - ✅ COMPLETED

### 4.1 Remove Hardcoded Operator Checks - ✅ DONE

**Modified:** `src/adapters/base.ts`, `src/adapters/mtr.ts`, `src/pages/board/[...params].tsx`

- Added `hasCustomUI` to `AdapterCapabilities`
- Board page now uses capability check instead of hardcoded `operatorId === "mtr"`

---

## Phase 5: Type Safety Improvements (Low Priority) - ✅ COMPLETED

### 5.1 Add Runtime Direction Validation - ✅ DONE

**Created:** `src/utils/validation.ts` with `validateMtrDirection()` and `isValidOperatorId()`

### 5.2 Implement Status Constants - ✅ DONE

**Modified:** `src/models/arrival.ts`

- Added `ARRIVAL_STATUS` constant object
- Added `ArrivalStatus` type

---

## Files Created

| File                          | Purpose                                  | Status     |
| ----------------------------- | ---------------------------------------- | ---------- |
| `src/types/language.ts`       | Shared language type                     | ✅ Created |
| `src/constants/mtr-labels.ts` | Centralized MTR UI labels                | ✅ Created |
| `src/constants/mtr-theme.ts`  | MTR colors, layout, and timing constants | ✅ Created |
| `src/utils/styles.ts`         | Styling utility functions                | ✅ Created |
| `src/utils/validation.ts`     | Runtime validation helpers               | ✅ Created |

## Files Removed

| File           | Reason             | Status     |
| -------------- | ------------------ | ---------- |
| `src/schemas/` | Unused Zod schemas | ✅ Removed |

## Files Modified

| File                                         | Changes                                                                      | Status  |
| -------------------------------------------- | ---------------------------------------------------------------------------- | ------- |
| `src/lib/api.ts`                             | Removed dead code (API_BASE_URL, DEFAULT_HEADERS, apiFetch, formatCountdown) | ✅ Done |
| `src/lib/api.test.ts`                        | Removed formatCountdown tests                                                | ✅ Done |
| `src/pages/board/[...params].tsx`            | Removed commented code, use capability check                                 | ✅ Done |
| `src/data/mtr.ts`                            | Consolidated direction functions                                             | ✅ Done |
| `src/data/mtr.test.ts`                       | Updated tests for new function signature                                     | ✅ Done |
| `src/pages/index.tsx`                        | Use unified getDirectionLabel                                                | ✅ Done |
| `src/components/board/mtr/MTRArrivalRow.tsx` | Use shared utilities and constants                                           | ✅ Done |
| `src/components/board/mtr/MTREmptyState.tsx` | Use shared utilities and constants                                           | ✅ Done |
| `src/components/board/mtr/MTRBoard.tsx`      | Use shared Language type and constants                                       | ✅ Done |
| `src/components/board/mtr/MTRHeader.tsx`     | Use theme constants                                                          | ✅ Done |
| `src/components/ui/LoadingSpinner.tsx`       | Use style utilities                                                          | ✅ Done |
| `src/contexts/LanguageContext.tsx`           | Import shared Language type                                                  | ✅ Done |
| `src/adapters/base.ts`                       | Add hasCustomUI capability                                                   | ✅ Done |
| `src/adapters/mtr.ts`                        | Add hasCustomUI capability, use ARRIVAL_STATUS                               | ✅ Done |
| `src/models/arrival.ts`                      | Add ARRIVAL_STATUS constants                                                 | ✅ Done |

---

## Remaining Items (Future Work)

### Phase 6: Documentation & Developer Experience

- [ ] Update CLAUDE.md with new architecture
- [ ] Add JSDoc to public APIs
- [ ] Create adapter template file

### Additional Improvements

- [ ] Create `src/components/board/factory.ts` for board UI selection
- [ ] Define `AdapterError` types in `src/adapters/errors.ts`
- [ ] Add operator-specific theming support in `BoardScreen`

---

## Testing Results

All tests pass and build succeeds:

- `npm run lint` ✅
- `npm run test` ✅ (125 tests passing)
- `npm run build` ✅
